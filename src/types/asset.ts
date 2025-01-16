import { Position } from ".";

export class Asset {
  public id: number;
  public position: Position;
  public size: { width: number; height: number };

  // 유저가 선택한 스퀘어는 selection에서 관리합니다.
  constructor({
    id,
    position,
    size = { width: 100, height: 40 },
  }: {
    id: number;
    position: Position;
    size?: { width: number; height: number };
    color?: string;
  }) {
    this.id = id;
    this.position = position;
    this.size = size;
  }

  setLT({ x, y }: Position) {
    if (x > this.position.x + this.size.width) return;
    if (y > this.position.y + this.size.height) return;

    this.size.width = this.position.x + this.size.width - x;
    this.size.height = this.position.y + this.size.height - y;
    this.position = { x, y };
  }

  setRT({ x, y }: Position) {
    if (x < this.position.x) return;
    if (y > this.position.y + this.size.height) return;

    this.size.width = x - this.position.x;
    this.size.height = this.position.y + this.size.height - y;

    this.position = { x: this.position.x, y };
  }

  setLB({ x, y }: Position) {
    if (x > this.position.x + this.size.width) return;
    if (y < this.position.y) return;

    this.size.width = this.position.x + this.size.width - x;
    this.size.height = y - this.position.y;

    this.position = { x, y: this.position.y };
  }

  setRB({ x, y }: Position) {
    if (x < this.position.x) return;
    if (y < this.position.y) return;

    this.size.width = x - this.position.x;
    this.size.height = y - this.position.y;
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
}
