import { Position } from ".";
import { Asset } from "./asset";

export class Geul extends Asset {
  public html: string;

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
    this.html = `<p>글</p>`;
  }

  updateHtml({ html }: { html: string }) {
    this.html = html;
  }
}
