export type MouseType = "select" | "hand";
export type MouseTarget = "bg" | "card" | "resizeBtn";
export type ResizeBtn = "rt" | "lt" | "lb" | "rb";

export const WALL_WIDTH = 100000;
export const WALL_HEIGHT = 100000;

export interface Position {
  x: number;
  y: number;
}
