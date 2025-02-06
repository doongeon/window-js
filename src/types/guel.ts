import { Descendant } from 'slate';
import { Position, ResizeBtn } from '.';
import { Asset, Movable, Rescalable } from './asset';

export class Geul extends Asset implements Movable, Rescalable {
  public slate: Descendant[];

  constructor({
    id,
    position,
    pivot,
    slate = [{ type: 'paragraph', children: [{ text: '새로운 글' }] }],
    scale = 1,
    size = { width: 20, height: 40 },
  }: {
    id: number;
    position: Position;
    pivot?: Position;
    size?: { width: number; height: number };
    scale?: number;
    slate?: Descendant[];
  }) {
    super({
      id,
      position,
      pivot,
      size,
      scale,
    });
    this.slate = slate;
  }

  setPosition({ newPos }: { newPos: Position }) {
    return new Geul({
      ...this,
      position: newPos,
    });
  }

  rescale({ type, mousePos }: { type?: ResizeBtn; mousePos: Position }) {
    if (!this.pivot) {
      switch (type) {
        case 'TL':
          this.pivot = this.getBR();
          break;
        case 'TR':
          this.pivot = this.getBL();
          break;
        case 'BL':
          this.pivot = this.getTR();
          break;
        case 'BR':
          this.pivot = this.getTL();
          break;
        default:
          return this;
      }
    }

    let position = this.position;

    if (mousePos.x > this.pivot.x && mousePos.y < this.pivot.y) {
      // 마우스가 피벗 기준 1 사분면에 있을떄
      position = {
        x: this.pivot.x,
        y: this.pivot.y - this.size.height * this.scale,
      };
    } else if (mousePos.x < this.pivot.x && mousePos.y < this.pivot.y) {
      // 마우스가 피벗 기준 2 사분면에 있을떄
      position = {
        x: this.pivot.x - this.size.width * this.scale,
        y: this.pivot.y - this.size.height * this.scale,
      };
    } else if (mousePos.x < this.pivot.x && mousePos.y > this.pivot.y) {
      // 마우스가 피벗 기준 3 사분면에 있을떄
      position = {
        x: this.pivot.x - this.size.width * this.scale,
        y: this.pivot.y,
      };
    } else {
      // 마우스가 피벗 기준 4 사분면에 있을떄
      position = this.pivot;
    }

    const viewSize = {
      width: Math.abs(mousePos.x - this.pivot.x),
      height: Math.abs(mousePos.y - this.pivot.y),
    };

    return new Geul({
      id: this.id,
      position,
      pivot: this.pivot,
      size: this.size,
      scale: this.calcScale(viewSize),
      slate: this.slate,
    });
  }

  resetPivot() {
    // 리사이즈가 끝난 후 호출해 줘야 다음 리사이즈가 정상적으로 동작함
    return new Geul({
      ...this,
      pivot: undefined,
    });
  }

  setSlate({ slate }: { slate: Descendant[] }) {
    return new Geul({
      ...this,
      slate,
    });
  }
}
