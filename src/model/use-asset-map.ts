import { useState } from 'react';
import { Square } from '../types/square';
import { Position, ResizeBtn, Size } from '../types';
import { Geul } from '../types/guel';
import { Descendant } from 'slate';

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

  function setGeulSize({
    geulId,
    viewSize,
  }: {
    geulId: number;
    viewSize: Size;
  }) {
    if (!assets[geulId]) return;
    if (!(assets[geulId] instanceof Geul)) return;

    setAssetMap((prev) => {
      const newAssetMap = { ...prev };
      if (newAssetMap[geulId] instanceof Geul) {
        newAssetMap[geulId] = new Geul({
          id: geulId,
          position: newAssetMap[geulId].position,
          size: newAssetMap[geulId].calcSize(viewSize),
          scale: newAssetMap[geulId].getScale(),
          slate: newAssetMap[geulId].slate,
        });
      }
      return newAssetMap;
    });
  }

  function setSlate({
    geulId,
    slate,
  }: {
    geulId: number;
    slate: Descendant[];
  }) {
    if (!assets[geulId]) return;
    if (!(assets[geulId] instanceof Geul)) return;

    setAssetMap((prev) => {
      const newAssetMap = { ...prev };
      newAssetMap[geulId] = new Geul({
        id: geulId,
        position: newAssetMap[geulId].position,
        size: newAssetMap[geulId].size,
        scale: newAssetMap[geulId].getScale(),
        slate,
      });
      return newAssetMap;
    });
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
    assetId,
    type,
    mousePos,
  }: {
    assetId: number;
    type?: ResizeBtn;
    mousePos: Position;
  }) {
    if (!assets[assetId]) return;

    setAssetMap((prev) => {
      const newAssets = { ...prev };
      if (newAssets[assetId] instanceof Geul) {
        newAssets[assetId] = newAssets[assetId].rescale({ type, mousePos });
      } else {
        newAssets[assetId] = newAssets[assetId].resize({ type, mousePos });
      }
      return newAssets;
    });
  }

  function resetPivot() {
    setAssetMap((prev) => {
      const newAssetMap = { ...prev };
      Object.keys(newAssetMap).forEach((assetId) => {
        newAssetMap[parseInt(assetId)] =
          newAssetMap[parseInt(assetId)].resetPivot();
      });
      return newAssetMap;
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
    setSlate,
    setGeulSize,
    updatePosition,
    resize,
    resetPivot,
  };
}
