import { Descendant } from "slate";
import { Position } from ".";
import { Asset } from "./asset";

export class Geul extends Asset {
  public slate: Descendant[];

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
    this.slate = [{ type: "paragraph", children: [{ text: "새로운 글" }] }];
  }

  updateSlate({ slate }: { slate: Descendant[] }) {
    this.slate = slate;
  }
}
