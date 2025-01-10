import { useState } from "react";
import { Square } from "../types/square";

export interface CardProps {
  card: Square;
  zIndex: number;
  isSelected: boolean;
  isSelectedOnly: boolean;
}

export function Card({ card, zIndex, isSelected, isSelectedOnly }: CardProps) {
  const [text] = useState(`Card #${card.id}`);

  function handleDoubleClick(e: React.MouseEvent) {
    console.log(e);
  }

  return (
    <div
      className={`card border border-white container outline-none
        ${isSelected ? "ring-4" : ""} 
      rounded-lg`}
      onDoubleClick={handleDoubleClick}
      style={{
        position: "absolute",
        width: card.size.width,
        height: card.size.height,
        left: card.position.x,
        top: card.position.y,
        backgroundColor: card.color,
        zIndex: zIndex,
      }}
      data-card-id={card.id}
    >
      <textarea
        className="w-full h-full bg-transparent resize-none overflow-hidden border-none outline-none"
        defaultValue={text}
        draggable={false}
      />
      <div className={`resize-btns ${isSelectedOnly ? "" : "hidden"}`}>
        <button
          className="card-lt w-2 h-2 bg-slate-50 border border-black absolute"
          style={{ left: "-10px", top: "-10px" }}
        ></button>
        <button
          className="card-rt w-2 h-2 bg-slate-50 border border-black absolute"
          style={{ right: "-10px", top: "-10px" }}
        ></button>
        <button
          className="card-lb w-2 h-2 bg-slate-50 border border-black absolute"
          style={{ left: "-10px", bottom: "-10px" }}
        ></button>
        <button
          className="card-rb w-2 h-2 bg-slate-50 border border-black absolute"
          style={{ right: "-10px", bottom: "-10px" }}
        ></button>
      </div>
    </div>
  );
}
