import { useState } from "react";
import { Position } from "./types";

export interface CardProps {
  id: number;
  position: Position;
  size: { width: number; height: number };
  isSelected: boolean;
  isSelectedOnly: boolean;
  color: string;
}

export function Card({
  id: cardId,
  position,
  size,
  isSelected,
  isSelectedOnly,
  color,
}: CardProps) {
  const [isTyping, setIsTyping] = useState(false);
  const [text, setText] = useState(`Card #${cardId}`);

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
      className={`card absolute border container ${
        isSelected && "ring-8"
      } rounded-lg py-1 px-2`}
      style={{
        width: size.width,
        height: size.height,
        left: position.x,
        top: position.y,
        backgroundColor: color,
      }}
      data-card-id={cardId}
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
