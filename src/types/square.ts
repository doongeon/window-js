import { Position } from ".";
import { Asset } from "./asset";

export class Square extends Asset {
  public color: string;

  // 유저가 선택한 스퀘어는 selection에서 관리합니다.
  constructor({
    id,
    position,
    size = { width: 100, height: 40 },
    color = "transparent",
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
    this.color = color;
  }
}
