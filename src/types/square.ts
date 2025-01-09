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
    position?: Position;
    size?: { width: number; height: number };
    isSelected?: boolean;
    color?: string;
  }) {
    this.id = id;
    this.position = position;
    this.size = size;
    this.isSelected = isSelected;
    this.color = color;
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
