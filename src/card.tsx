import { useState } from "react";
import { Position } from "./App";

export interface CardProps {
  id: number;
  position: Position;
  size: { width: number; height: number };
  isSelected: boolean;
  color: string;
}

export function Card({
  id: cardId,
  position,
  size,
  isSelected,
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
      className={`card absolute border container ${isSelected && "ring-8"}`}
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
    </div>
  );
}
