import { useState } from "react";
import { Square } from "../types/square";

export interface CardProps {
  card: Square;
  isSelected: boolean;
  isSelectedOnly: boolean;
}

export function Card({ card, isSelected, isSelectedOnly }: CardProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState(`Card #${card.id}`);

  function handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    setText(e.target.value);
  }

  function handleBlur() {
    setIsTyping(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Escape") {
      setIsTyping(false);
    }
  }

  return (
    <div
      className={`card border container ${
        isSelected ? "ring-8" : ""
      } rounded-lg py-1 px-2`}
      style={{
        position: "absolute",
        width: card.size.width,
        height: card.size.height,
        left: card.position.x,
        top: card.position.y,
        backgroundColor: card.color,
        zIndex: card.zIndex,
      }}
      data-card-id={card.id}
    >
      {isTyping ? (
        <textarea
          className="w-full h-full"
          autoFocus
          defaultValue={text}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyUp={handleKeyDown}
        />
      ) : (
        <p className="w-full h-full">{text}</p>
      )}
      <div className={`${isSelectedOnly ? "" : "hidden"}`}>
        <button className="card-lt w-2 h-2 bg-slate-50 absolute left-[-4px] top-[-4px]"></button>
        <button className="card-rt w-2 h-2 bg-slate-50 absolute right-[-4px] top-[-4px]"></button>
        <button className="card-lb w-2 h-2 bg-slate-50 absolute left-[-4px] bot-[4px]"></button>
        <button className="card-rb w-2 h-2 bg-slate-50 absolute right-[-4px] bot-[4px]"></button>
      </div>
    </div>
  );
}
