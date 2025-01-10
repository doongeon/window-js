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

  function moveToTopOfZStack({ cardId }: { cardId: number }) {
    setZStack((prev) => {
      const idx = prev.indexOf(cardId);
      const head = prev.slice(0, idx);
      const tail = prev.slice(idx + 1);
      const newZStack = [...head, ...tail, prev[idx]];
      return newZStack;
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
    updatePageOffset,
  };
}
