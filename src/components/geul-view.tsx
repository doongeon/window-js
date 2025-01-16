import { Geul } from "../types/guel";

export interface GeulProps {
  geul: Geul;
  zIndex: number;
  isSelected: boolean;
  isSelectedOnly: boolean;
}

export function GuelView({
  geul,
  zIndex,
  isSelected,
  isSelectedOnly,
}: GeulProps) {
  return (
    <div
      className={`asset geul text-black dark:text-white outline-none break-words
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
      contentEditable={isSelectedOnly}
    >
      글 #{geul.id}
    </div>
  );
}
