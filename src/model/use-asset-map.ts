import { useState } from "react";
import { Square } from "../types/square";
import { Position, ResizeBtn } from "../types";
import { Geul } from "../types/guel";

export default function useAssetMap() {
  /**
   * TO DO
   * 1. 글 편집된 글 Geul 객체에 저장
   * 2. 로컬 스토리지에 저장후 로드
   */
  const [assets, setAssetMap] = useState<{ [key: number]: Square | Geul }>({});
  const [id, setId] = useState(0);

  function addNewSquare({ position }: { position: Position }) {
    const newId = id + 1;
    setId(newId);
    setAssetMap((prev) => {
      const newSquare = new Square({ id: newId, position });
      const newAssets = { ...prev };
      newAssets[newId] = newSquare;
      return newAssets;
    });
    return newId;
  }

  function addNewGeul({ position }: { position: Position }) {
    const newId = id + 1;
    setId(newId);
    setAssetMap((prev) => {
      const newSquare = new Geul({ id: newId, position });
      const newAssets = { ...prev };
      newAssets[newId] = newSquare;
      return newAssets;
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
      const newAssets = { ...prev };
      Object.keys(colorMap).forEach((key) => {
        const cardId = parseInt(key, 10);
        if (newAssets[cardId] instanceof Square) {
          newAssets[cardId].color = colorMap[cardId];
        }
      });
      return newAssets;
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
      const newAssets = { ...prev };
      switch (type) {
        case "lt":
          newAssets[cardId].setLT(position);
          break;
        case "rt":
          newAssets[cardId].setRT(position);
          break;
        case "lb":
          newAssets[cardId].setLB(position);
          break;
        case "rb":
          newAssets[cardId].setRB(position);
          break;
        default:
      }
      return newAssets;
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
      const newAssets = { ...prev };
      selection.forEach((cardId) => {
        if (!startPositionMap[cardId]) return;
        newAssets[cardId].position.x =
          startPositionMap[cardId].x + mousePosition.x - mouseStartPosition.x;
        newAssets[cardId].position.y =
          startPositionMap[cardId].y + mousePosition.y - mouseStartPosition.y;
      });
      return newAssets;
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
