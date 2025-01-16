import { useState } from "react";
import { Position } from "../types";

export default function useViewState() {
  const [zStack, setZStack] = useState<number[]>([]);
  const [pageOffset, setPageOffset] = useState<Position>({ x: 0, y: 0 });

  function addOnZStack({ assetId }: { assetId: number }) {
    setZStack((prev) => {
      const newZStack = [...prev];
      newZStack.push(assetId);
      return newZStack;
    });
  }

  function moveToTopOfZStack({ assetIds }: { assetIds: number[] }) {
    setZStack((prev) => {
      const targetIds: number[] = [];
      const newZStack: number[] = [];
      prev.forEach((assetId) => {
        if (assetIds.includes(assetId)) {
          targetIds.push(assetId);
        } else {
          newZStack.push(assetId);
        }
      });

      return [...newZStack, ...targetIds];
    });
  }

  function moveToBottomOfZStack({ assetIds }: { assetIds: number[] }) {
    setZStack((prev) => {
      const targetIds: number[] = [];
      const newZStack: number[] = [];
      prev.forEach((assetId) => {
        if (assetIds.includes(assetId)) {
          targetIds.push(assetId);
        } else {
          newZStack.push(assetId);
        }
      });

      return [...targetIds, ...newZStack];
    });
  }

  function updatePageOffset(dragOffset: Position) {
    setPageOffset((prev) => {
      const newPageOffset = { ...prev };
      newPageOffset.x += dragOffset.x;
      newPageOffset.y += dragOffset.y;
      return newPageOffset;
    });
  }

  return {
    pageOffset,
    zStack,
    addOnZStack,
    moveToTopOfZStack,
    moveToBottomOfZStack,
    updatePageOffset,
  };
}
