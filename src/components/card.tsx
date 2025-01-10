import { Square } from "../types/square";

export interface CardProps {
  card: Square;
  zIndex: number;
  isSelected: boolean;
  isSelectedOnly: boolean;
}

export function Card({ card, zIndex, isSelected }: CardProps) {
  return (
    <div
      className={`card border border-slate-900 dark:border-white container text-black dark:text-white outline-none
        ${isSelected ? "ring-4" : ""} 
      rounded-lg`}
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
    ></div>
  );
}

export function CardAdjuster({ card }: { card: Square }) {
  return (
    <div
      className={`card-adjuster ring-4`}
      style={{
        position: "absolute",
        width: card.size.width,
        height: card.size.height,
        left: card.position.x,
        top: card.position.y,
        zIndex: 9999,
      }}
    >
      <div className="resize-btns">
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
