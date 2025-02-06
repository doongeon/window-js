import { Position, Size } from '.';

export interface Resizable {
  resize: (arg: any) => Resizable;
  resetPivot: () => Resizable;
}

export interface Rescalable {
  rescale: (arg: any) => Rescalable;
  resetPivot: () => Rescalable;
}

export interface Movable {
  position: Position;
  setPosition: ({ newPos }: { newPos: Position }) => Movable;
}

export class Asset {
  readonly id: number;
  position: Position;
  pivot?: Position;
  size: Size;
  scale: number;
  viewSize: Size;

  // 유저가 선택한 스퀘어는 selection에서 관리합니다.
  constructor({
    id,
    position,
    pivot,
    size = { width: 100, height: 40 },
    scale = 1,
  }: {
    id: number;
    position: Position;
    pivot?: Position;
    size: { width: number; height: number };
    scale?: number;
    color?: string;
  }) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.scale = scale;
    this.pivot = pivot;
    this.viewSize = { width: size.width * scale, height: size.height * scale };
  }

  getCenter(): Position {
    return {
      x: this.position.x + this.size.width / 2,
      y: this.position.y + this.size.height / 2,
    };
  }

  checkIsIn({
    absPosition1,
    absPosition2,
  }: {
    absPosition1: Position;
    absPosition2: Position;
  }) {
    // left top position
    const positionLT = {
      x: Math.min(absPosition1.x, absPosition2.x),
      y: Math.min(absPosition1.y, absPosition2.y),
    };

    // right bottom position
    const positionRB = {
      x: Math.max(absPosition1.x, absPosition2.x),
      y: Math.max(absPosition1.y, absPosition2.y),
    };

    return (
      this.position.x >= positionLT.x &&
      this.position.y >= positionLT.y &&
      this.position.x + this.size.width <= positionRB.x &&
      this.position.y + this.size.height <= positionRB.y
    );
  }

  calcScale(viewSize: Size) {
    return Math.max(
      viewSize.width / this.size.width,
      viewSize.height / this.size.height
    );
  }

  calcSize(viewSize: Size) {
    return {
      width: Math.floor((viewSize.width / this.scale) * 100) / 100,
      height: Math.floor((viewSize.height / this.scale) * 100) / 100,
    } as Size;
  }

  getTR() {
    return {
      x: this.position.x + this.viewSize.width,
      y: this.position.y,
    } as Position;
  }

  getTL() {
    return {
      x: this.position.x,
      y: this.position.y,
    } as Position;
  }

  getBR() {
    return {
      x: this.position.x + this.viewSize.width,
      y: this.position.y + this.viewSize.height,
    } as Position;
  }

  getBL() {
    return {
      x: this.position.x,
      y: this.position.y + this.viewSize.height,
    } as Position;
  }
}
