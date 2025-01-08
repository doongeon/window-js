import { Position } from "../App";

export class Square {
  public id: number;
  public position: Position;
  public size: { width: number; height: number };
  public isSelected: boolean;
  public color: string;

  constructor({
    id,
    position = { x: 100, y: 100 },
    size = { width: 100, height: 40 },
    isSelected = false,
    color = "transparent",
  }: {
    id: number;
    position: Position;
    size: { width: number; height: number };
    isSelected: boolean;
    color: string;
  }) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.isSelected = isSelected;
    this.color = color;
  }

  getCenter(): Position {
    return {
      x: this.position.x + this.size.width / 2,
      y: this.position.y + this.size.height / 2,
    };
  }

  checkCenterIsIn({ p1, p2 }: { p1: Position; p2: Position }) {
    const center = this.getCenter();
    return (
      center.x >= p1.x &&
      center.x <= p2.x &&
      center.y >= p1.y &&
      center.y <= p2.y
    );
  }
}
