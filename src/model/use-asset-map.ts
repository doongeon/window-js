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

  function addSlate({ assetId }: { assetId: number }) {
    setAssetMap((prev) => {
      const newAssets = { ...prev };
      if (newAssets[assetId] instanceof Square) {
        newAssets[assetId] = new Square({
          ...newAssets[assetId],
          slate: [
            {
              type: 'paragraph',
              textAlign: 'center',
              children: [{ text: '' }],
            },
          ],
        });
      }
      return newAssets;
    });
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
          ...newAssetMap[geulId],
          size: newAssetMap[geulId].calcSize(viewSize),
        });
      }
      return newAssetMap;
    });
  }

  function setSlate({
    assetId,
    slate,
  }: {
    assetId: number;
    slate: Descendant[];
  }) {
    if (!assets[assetId]) return;

    setAssetMap((prev) => {
      const newAssetMap = { ...prev };
      newAssetMap[assetId] = newAssetMap[assetId].setSlate({ slate });
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
        const assetId = parseInt(key);
        if (newAssets[assetId] instanceof Square) {
          newAssets[assetId] = newAssets[assetId].setColor({
            color: colorMap[assetId],
          });
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
      Object.keys(newAssetMap).forEach((key) => {
        const assetId = parseInt(key);
        newAssetMap[assetId] = newAssetMap[assetId].resetPivot();
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
      selection.forEach((assetId) => {
        if (!startPositionMap[assetId]) return;
        newAssets[assetId] = newAssets[assetId].setPosition({
          newPos: {
            x:
              startPositionMap[assetId].x +
              mousePosition.x -
              mouseStartPosition.x,
            y:
              startPositionMap[assetId].y +
              mousePosition.y -
              mouseStartPosition.y,
          },
        });
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
    addSlate,
  };
}
