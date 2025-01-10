import { useState } from "react";

export default function useSelection() {
  const [selection, setSelection] = useState<number[]>([]);

  function clearSelection() {
    setSelection([]);
  }

  function updateSelection({ newSelection }: { newSelection: number[] }) {
    setSelection(newSelection);
  }

  return { selection, clearSelection, updateSelection };
}
