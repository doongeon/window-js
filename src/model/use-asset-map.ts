import { useState } from "react";
import { Square } from "../types/square";
import { Position, ResizeBtn } from "../types";
import { Geul } from "../types/guel";

export default function useAssetMap() {
  const [assets, setAssetMap] = useState<{ [key: number]: Square | Geul }>({});
  const [id, setId] = useState(0);

  function addNewSquare({ position }: { position: Position }) {
    const newId = id + 1;
    setId(newId);
    setAssetMap((prev) => {
      const newSquare = new Square({ id: newId, position });
      const newCardMap = { ...prev };
      newCardMap[newId] = newSquare;
      return newCardMap;
    });
    return newId;
  }

  function addNewGeul({ position }: { position: Position }) {
    const newId = id + 1;
    setId(newId);
    setAssetMap((prev) => {
      const newSquare = new Geul({ id: newId, position });
      const newCardMap = { ...prev };
      newCardMap[newId] = newSquare;
      return newCardMap;
    });
    return newId;
  }

  function deleteAsset(assetIds: number[]) {
    if (assetIds.length < 1) return;
    setAssetMap((prev) => {
      const newAssetMap = { ...prev };
      assetIds.forEach((cardId) => {
        delete newAssetMap[cardId];
      });
      return newAssetMap;
    });
  }

  function updateColor(colorMap: { [key: number]: string }) {
    setAssetMap((prev) => {
      const newCardMap = { ...prev };
      Object.keys(colorMap).forEach((key) => {
        const cardId = parseInt(key, 10);
        if (newCardMap[cardId] instanceof Square) {
          newCardMap[cardId].color = colorMap[cardId];
        }
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
    setAssetMap((prev) => {
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
    setAssetMap((prev) => {
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
    assets,
    addNewSquare,
    addNewGeul,
    deleteAsset,
    updateColor,
    updatePosition,
    resize,
  };
}
