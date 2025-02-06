import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from 'slate-react';
import { Square } from '../types/square';
import { Descendant, Editor, Transforms } from 'slate';
import { useEffect } from 'react';

export interface SquareProps {
  square: Square;
  zIndex: number;
  editable: boolean;
  editor?: Editor;

  setSlate: ({
    assetId,
    slate,
  }: {
    assetId: number;
    slate: Descendant[];
  }) => void;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
}

export function SquareView({
  square,
  zIndex,
  editable,
  editor,
  setSlate,
  renderElement,
  renderLeaf,
}: SquareProps) {
  useEffect(() => {
    if (editable && editor) {
      const endPoint = Editor.end(editor, []);
      ReactEditor.focus(editor);
      Transforms.select(editor, endPoint);
    }
  }, [editable]);

  return (
    <div
      className={`asset square border-4 border-gray-600 container rounded-lg text-black outline-none flex
      `}
      style={{
        position: 'absolute',
        width: square.size.width,
        height: square.size.height,
        left: square.position.x,
        top: square.position.y,
        backgroundColor: square.color,
        zIndex: zIndex,
      }}
      data-asset-id={square.id}
    >
      {square.slate && editor && (
        <Slate
          editor={editor}
          initialValue={square.slate}
          onChange={(slate) => {
            const isAstChange = editor.operations.some(
              (op) => 'set_selection' !== op.type
            );
            if (isAstChange) {
              // save slate into geul object
              setSlate({
                assetId: square.id,
                slate,
              });
            }
          }}
        >
          <Editable
            readOnly={!editable}
            className="slate-editor outline-none w-full my-auto"
            renderElement={renderElement}
            renderLeaf={renderLeaf}
          />
        </Slate>
      )}
    </div>
  );
}
