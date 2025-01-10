import { useState } from "react";
import { Position } from "../types";

export default function useViewState() {
  const [zStack, setZStack] = useState<number[]>([]);
  const [pageOffset, setPageOffset] = useState<Position>({ x: 0, y: 0 });

  function addOnZStack({ cardId }: { cardId: number }) {
    setZStack((prev) => {
      const newZStack = [...prev];
      newZStack.push(cardId);
      return newZStack;
    });
  }

  function moveToTopOfZStack({ cardIds }: { cardIds: number[] }) {
    setZStack((prev) => {
      const targetIds: number[] = [];
      const newZStack: number[] = [];
      prev.forEach((cardId) => {
        if (cardIds.includes(cardId)) {
          targetIds.push(cardId);
        } else {
          newZStack.push(cardId);
        }
      });

      return [...newZStack, ...targetIds];
    });
  }

  function moveToBottomOfZStack({ cardIds }: { cardIds: number[] }) {
    setZStack((prev) => {
      const targetIds: number[] = [];
      const newZStack: number[] = [];
      prev.forEach((cardId) => {
        if (cardIds.includes(cardId)) {
          targetIds.push(cardId);
        } else {
          newZStack.push(cardId);
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
