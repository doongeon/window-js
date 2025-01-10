import { useState } from "react";
import { Square } from "../types/square";
import { Position, ResizeBtn } from "../types";

export default function useCardMap() {
  const [cardMap, setCardMap] = useState<{ [key: number]: Square }>({});
  const [id, setId] = useState(0);

  function addNewCard({ position }: { position: Position }) {
    const newId = id + 1;
    setId(newId);
    setCardMap((prev) => {
      const newSquare = new Square({ id: newId, position });
      const newCardMap = { ...prev };
      newCardMap[newId] = newSquare;
      return newCardMap;
    });
    return newId;
  }

  function deleteCard(cardIds: number[]) {
    if (cardIds.length < 1) return;
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      cardIds.forEach((cardId) => {
        delete newCardMap[cardId];
      });
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
    type?: ResizeBtn;
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

  return {
    cardMap,
    addNewCard,
    deleteCard,
    updateColor,
    updatePosition,
    resize,
  };
}
