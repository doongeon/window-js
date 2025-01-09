import { useState } from "react";
import { Square } from "../types/square";
import { LB, LT, RB, RT, Position } from "../App";

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

  function resize({
    cardId,
    type,
    position,
  }: {
    cardId: number;
    type?: LT | RT | LB | RB;
    position: Position;
  }) {
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      switch (type) {
        case "lt":
          newCardMap[cardId].setLT(position);
          break;
        case "rt":
          newCardMap[cardId].setRT(position);
          break;
        case "lb":
          newCardMap[cardId].setLB(position);
          break;
        case "rb":
          newCardMap[cardId].setRB(position);
          break;
        default:
      }
      return newCardMap;
    });
  }

  function updatePosition({
    selection,
    startPositionMap,
    mouseStartPosition,
    mousePosition,
  }: {
    selection: number[];
    startPositionMap: { [key: number]: Position };
    mouseStartPosition: Position;
    mousePosition: Position;
  }) {
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      selection.forEach((cardId) => {
        if (!startPositionMap[cardId]) return;
        newCardMap[cardId].position.x =
          startPositionMap[cardId].x + mousePosition.x - mouseStartPosition.x;
        newCardMap[cardId].position.y =
          startPositionMap[cardId].y + mousePosition.y - mouseStartPosition.y;
      });
      return newCardMap;
    });
  }

  return { cardMap, addNewCard, updateColor, updatePosition, resize };
}
