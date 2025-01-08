import { useState } from "react";
import { Square } from "../types/square";
import { Position } from "../App";

export default function useCardMap() {
  const [cardMap, setCardMap] = useState<{ [key: number]: Square }>({});

  function addNewCard() {
    setCardMap((prev) => {
      const id = Object.keys(cardMap).length + 1;
      const newSquare = new Square({ id });
      const newCardMap = { ...prev };
      newCardMap[id] = newSquare;
      return newCardMap;
    });
  }

  function updateColor(colorMap: { [key: number]: string }) {
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      Object.keys(colorMap).forEach((key) => {
        const cardId = parseInt(key, 10);
        newCardMap[cardId].color = colorMap[cardId];
      });
      return newCardMap;
    });
  }

  function updatePosition({
    selection,
    oldPositionMap,
    mouseStartPosition,
    mousePosition,
  }: {
    selection: number[];
    oldPositionMap: { [key: number]: Position };
    mouseStartPosition: Position;
    mousePosition: Position;
  }) {
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      selection.forEach((cardId) => {
        if (!oldPositionMap[cardId]) return;
        newCardMap[cardId].position.x =
          oldPositionMap[cardId].x + mousePosition.x - mouseStartPosition.x;
        newCardMap[cardId].position.y =
          oldPositionMap[cardId].y + mousePosition.y - mouseStartPosition.y;
      });
      return newCardMap;
    });
  }

  return { cardMap, addNewCard, updateColor, updatePosition };
}
