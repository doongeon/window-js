import { MouseType } from "../types";
import { Editor, Element, Transforms } from "slate";
import { FontSize } from "../types/slate";
import ColorBtn from "./color-btn";
import { ColorResult } from "react-color";

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
    toggleBoldMark() {
      const marks = Editor.marks(editor);
      if (marks && marks.bold) {
        Editor.removeMark(editor, "bold");
      } else {
        Editor.addMark(editor, "bold", true);
      }
    },

    toggleItalic() {
      const marks = Editor.marks(editor);
      if (marks && marks.italic) {
        Editor.removeMark(editor, "italic");
      } else {
        Editor.addMark(editor, "italic", true);
      }
    },

    toggleUnderline() {
      const marks = Editor.marks(editor);
      if (marks && marks.underLine) {
        Editor.removeMark(editor, "underLine");
      } else {
        Editor.addMark(editor, "underLine", true);
      }
    },

    setFontSize(fontSize: FontSize) {
      Editor.addMark(editor, "fontSize", fontSize);
    },

    setColor(color: ColorResult) {
      Editor.addMark(editor, "color", color.hex);
    },

    setBgColor(color: ColorResult) {
      const currentBgColor = Editor.marks(editor)?.bgColor;
      const newColor = currentBgColor === color.hex ? "transparent" : color.hex;
      Editor.addMark(editor, "bgColor", newColor);
    },

    setTextAlign(textAlign: "start" | "center" | "end") {
      Transforms.setNodes(
        editor,
        { type: "paragraph", textAlign },
        { match: (n) => Element.isElement(n) && Editor.isBlock(editor, n) }
      );
    },
  };

  return (
    <>
      {mouseType === "text" && selection.length === 1 && (
        <div
          className={`options absolute right-0 top-0 mt-[60px] px-2 py-4 h-full bg-slate-300 flex flex-col gap-2`}
        >
          {mouseType === "text" && (
            <>
              <button
                className="bg-slate-200"
                onClick={customEditor.toggleBoldMark}
              >
                bold
              </button>
              <button
                className="bg-slate-200"
                onClick={customEditor.toggleItalic}
              >
                italic
              </button>
              <button
                className="bg-slate-200"
                onClick={customEditor.toggleUnderline}
              >
                underline
              </button>
              <button onClick={() => customEditor.setTextAlign("start")}>
                왼쪽 정렬
              </button>
              <button onClick={() => customEditor.setTextAlign("center")}>
                가운데 정렬
              </button>
              <button onClick={() => customEditor.setTextAlign("end")}>
                오른쪽 정렬
              </button>
              <ColorBtn
                active={true}
                handleColorChange={customEditor.setColor}
              />
              <ColorBtn
                label="배경색"
                active={true}
                handleColorChange={customEditor.setBgColor}
              />
              <div className="border border-black flex flex-col py-1">
                <p className="mx-auto">글자 크기</p>
                <button onClick={() => customEditor.setFontSize("text-xl")}>
                  제목
                </button>
                <button onClick={() => customEditor.setFontSize("text-base")}>
                  본문
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
