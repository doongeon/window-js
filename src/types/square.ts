import { Descendant } from 'slate';
import { Position, ResizeBtn } from '.';
import { Asset, Movable, Resizable } from './asset';

export class Square extends Asset implements Movable, Resizable {
  color: string;
  slate?: Descendant[];

  // 유저가 선택한 스퀘어는 selection에서 관리합니다.
  constructor({
    id,
    position,
    pivot,
    size = { width: 100, height: 40 },
    scale = 1,
    color = 'transparent',
    slate,
  }: {
    id: number;
    position: Position;
    pivot?: Position;
    size?: { width: number; height: number };
    scale?: number;
    color?: string;
    slate?: Descendant[];
  }) {
    super({
      id,
      position,
      pivot,
      size,
      scale,
    });
    this.color = color;
    this.slate = slate;
  }

  setPosition({ newPos }: { newPos: Position }) {
    return new Square({
      ...this,
      position: newPos,
    });
  }

  setColor({ color }: { color: string }) {
    return new Square({
      ...this,
      color,
    });
  }

  setSlate({ slate }: { slate: Descendant[] }) {
    return new Square({
      ...this,
      slate,
    });
  }

  resize({ type, mousePos }: { type?: ResizeBtn; mousePos: Position }) {
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

    let position;

    if (mousePos.x > this.pivot.x && mousePos.y < this.pivot.y) {
      // 마우스가 피벗 기준 1 사분면에 있을떄
      position = {
        x: this.pivot.x,
        y: mousePos.y,
      };
    } else if (mousePos.x < this.pivot.x && mousePos.y < this.pivot.y) {
      // 마우스가 피벗 기준 2 사분면에 있을떄
      position = {
        x: mousePos.x,
        y: mousePos.y,
      };
    } else if (mousePos.x < this.pivot.x && mousePos.y > this.pivot.y) {
      // 마우스가 피벗 기준 3 사분면에 있을떄
      position = {
        x: mousePos.x,
        y: this.pivot.y,
      };
    } else {
      // 마우스가 피벗 기준 4 사분면에 있을떄
      position = this.pivot;
    }

    const size = {
      width: Math.abs(this.pivot.x - mousePos.x),
      height: Math.abs(this.pivot.y - mousePos.y),
    };

    return new Square({
      ...this,
      position,
      size,
    });
  }

  resetPivot() {
    // 리사이즈가 끝난 후 호출해 줘야 다음 리사이즈가 정상적으로 동작함
    return new Square({
      ...this,
      pivot: undefined,
    });
  }
}
