import { Position } from "../types";

const WALL_WIDTH = 100000;
const WALL_HEIGHT = 100000;

export default function SelectSquare({
  start,
  end,
  pageOffset,
}: {
  start: { x: number; y: number };
  end: { x: number; y: number };
  pageOffset: Position;
}) {
  const left = Math.min(start.x, end.x) + WALL_WIDTH / 2 - pageOffset.x;
  const top = Math.min(start.y, end.y) + WALL_HEIGHT / 2 - pageOffset.y;
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <div
      className="select-square absolute bg-blue-300 border border-blue-700 opacity-30 border-collapse"
      style={{
        left,
        top,
        width,
        height,
      }}
    ></div>
  );
}
