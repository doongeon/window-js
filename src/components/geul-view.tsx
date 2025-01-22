import { Geul } from "../types/guel";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from "slate-react";
import { Editor } from "slate";

export interface GeulProps {
  editor: Editor;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  geul: Geul;
  zIndex: number;
  isSelected: boolean;
  editable: boolean;
}

export function GuelView({
  editor,
  renderElement,
  renderLeaf,
  geul,
  zIndex,
  isSelected,
  editable,
}: GeulProps) {
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
        <Slate
          editor={editor}
          initialValue={geul.slate}
          onChange={(slate) => {
            const isAstChange = editor.operations.some(
              (op) => "set_selection" !== op.type
            );
            if (isAstChange) {
              // save slate into geul object
              geul.updateSlate({ slate });
            }
          }}
        >
          <Editable
            className="w-full h-full"
            readOnly={!editable}
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Slate>
      </div>
    </>
  );
}
