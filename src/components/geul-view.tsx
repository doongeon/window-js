import { Geul } from "../types/guel";

export interface GeulProps {
  geul: Geul;
  zIndex: number;
  editable: boolean;
  isSelected: boolean;
}

export function GuelView({ geul, zIndex, editable, isSelected }: GeulProps) {
  return (
    <div
      className={`asset geul text-black dark:text-white outline-none break-words overflow-y-scroll
          ${isSelected ? "ring-4" : ""}`}
      style={{
        position: "absolute",
        width: geul.size.width,
        height: geul.size.height,
        left: geul.position.x,
        top: geul.position.y,
        backgroundColor: "transparent",
        zIndex: zIndex,
      }}
      data-asset-id={geul.id}
      contentEditable={editable}
    >
      글 #{geul.id}
    </div>
  );
}
