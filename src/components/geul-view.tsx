import { Geul } from "../types/guel";
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from "slate-react";
import { Editor } from "slate";
import { useEffect, useRef } from "react";

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
  const editableRef = useRef<HTMLDivElement>(null); // Ref 생성

  useEffect(() => {
    if (editable && editableRef.current) {
      editableRef.current.focus(); // Editable 엘리먼트에 포커스 지정
    }
  }, [editable]); // editable 상태가 변경될 때 포커스 실행

  return (
    <div
      className={`asset geul text-black dark:text-white outline-none break-words
          ${isSelected ? "ring-4 scroll-bar" : "overflow-y-hidden"} `}
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
          ref={editableRef}
          className="slate-editor w-full h-[99%]"
          readOnly={!editable}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
    </div>
  );
}
