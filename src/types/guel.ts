import { Position } from ".";
import { Asset } from "./asset";

export class Geul extends Asset {
  public text: string;

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
    super({
      id,
      position,
      size,
    });
    this.text = "";
  }

  updateText({ text }: { text: string }) {
    this.text = text;
  }
}
