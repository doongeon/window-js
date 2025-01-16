import { Square } from "../types/square";

export interface SquareProps {
  square: Square;
  zIndex: number;
  isSelected: boolean;
  isSelectedOnly: boolean;
}

export function SquareView({ square, zIndex, isSelected }: SquareProps) {
  return (
    <div
      className={`asset square border border-slate-900 dark:border-white container text-black dark:text-white outline-none
        ${isSelected ? "ring-4" : ""} 
      rounded-lg`}
      style={{
        position: "absolute",
        width: square.size.width,
        height: square.size.height,
        left: square.position.x,
        top: square.position.y,
        backgroundColor: square.color,
        zIndex: zIndex,
      }}
      data-asset-id={square.id}
    ></div>
  );
}
