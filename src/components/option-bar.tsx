import { MouseType } from "../types";
import { Editor, Element, Transforms } from "slate";
import { CustomEditor } from "./slate";

interface OptionBarProps {
  mouseType: MouseType;
  selection: number[];
  editor: Editor;
}

export default function OptionBar({
  mouseType,
  selection,
  editor,
}: OptionBarProps) {
  /**
   * TO DO
   * 텍스트 편집 옵션 추가하기
   * 제목, 글자 크기, 가운데 정렬, 글자 색깔, 언더라인 등등...
   */

  const customEditor = {
    isBoldMarkActive(editor: CustomEditor) {
      const marks = Editor.marks(editor);
      return marks ? marks.bold === true : false;
    },

    isCodeBlockActive(editor: CustomEditor) {
      const [match] = Editor.nodes(editor, {
        match: (n) => Element.isElement(n) && n.type === "code",
      });

      return !!match;
    },

    toggleBoldMark(editor: CustomEditor) {
      const isActive = customEditor.isBoldMarkActive(editor);
      if (isActive) {
        Editor.removeMark(editor, "bold");
      } else {
        Editor.addMark(editor, "bold", true);
      }
    },

    toggleCodeBlock(editor: CustomEditor) {
      const isActive = customEditor.isCodeBlockActive(editor);
      Transforms.setNodes(
        editor,
        { type: isActive ? "paragraph" : "code" },
        { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
      );
    },
  };

  return (
    <>
      {mouseType === "text" && selection.length === 1 && (
        <div
          className={`options absolute right-0 top-0 mt-[60px] px-2 py-4 h-full bg-slate-300 flex flex-col`}
        >
          {mouseType === "text" && (
            <>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  customEditor.toggleBoldMark(editor);
                }}
              >
                bold
              </button>
              {/* <button>italic</button>
          <button>underline</button> */}
            </>
          )}
        </div>
      )}
    </>
  );
}
