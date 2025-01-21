import { Geul } from "../types/guel";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from "slate-react";
import { Descendant, Editor } from "slate";
import { MouseType } from "../types";

export interface GeulProps {
  editor: Editor;
  initialValue: Descendant[];
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  geul: Geul;
  zIndex: number;
  isSelected: boolean;
  mouseType: MouseType;
}

export function GuelView({
  editor,
  initialValue,
  renderElement,
  renderLeaf,
  geul,
  zIndex,
  isSelected,
}: GeulProps) {
  /**
   * TO DO
   * 글자 편집 후 geul 객체에 저장하기.
   */
  return (
    <>
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
      >
        <Slate editor={editor} initialValue={initialValue}>
          <Editable
            className="w-full h-full"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Slate>
      </div>
    </>
  );
}
