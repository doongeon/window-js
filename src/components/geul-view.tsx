import { Geul } from '../types/guel';
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from 'slate-react';
import { Descendant, Editor, Transforms } from 'slate';
import { useEffect, useRef } from 'react';
import { Size } from '../types';

export interface GuelViewProps {
  editor: Editor;
  geul: Geul;
  zIndex: number;
  isSelected: boolean;
  editable: boolean;

  setSlate: ({
    assetId,
    slate,
  }: {
    assetId: number;
    slate: Descendant[];
  }) => void;
  setGeulSize: ({
    geulId,
    viewSize,
  }: {
    geulId: number;
    viewSize: Size;
  }) => void;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
}

export function GuelView({
  editor,
  renderElement,
  renderLeaf,
  geul,
  zIndex,
  // isSelected,
  editable,
  setSlate,
  setGeulSize,
}: GuelViewProps) {
  const editableRef = useRef<HTMLDivElement>(null); // Ref 생성

  useEffect(() => {
    if (editable && editor) {
      const endPoint = Editor.end(editor, []);
      ReactEditor.focus(editor);
      Transforms.select(editor, endPoint);
    }
  }, [editable]);

  useEffect(() => {
    setGeulSize({
      geulId: geul.id,
      viewSize: {
        width: editableRef.current!.getBoundingClientRect().width,
        height: editableRef.current!.getBoundingClientRect().height,
      },
    });
  }, []);

  return (
    <div
      className={`asset geul text-black dark:text-white outline-none break-words min-w-max min-h-max`}
      style={{
        position: 'absolute',
        left: geul.position.x,
        top: geul.position.y,
        width: `${geul.viewSize.width}px`,
        height: `${geul.viewSize.height}px`,
        backgroundColor: 'transparent',
        zIndex: zIndex,
        transformOrigin: 'left top',
      }}
      data-asset-id={geul.id}
    >
      <Slate
        editor={editor}
        initialValue={geul.slate}
        onChange={(slate) => {
          const isAstChange = editor.operations.some(
            (op) => 'set_selection' !== op.type
          );

          if (isAstChange) {
            // save slate into geul object
            setSlate({
              assetId: geul.id,
              slate,
            });
          }
        }}
      >
        <Editable
          ref={editableRef}
          className="slate-editor px-2 outline-none w-max"
          style={{
            transform: `scale(${geul.scale})`,
            transformOrigin: 'top left',
          }}
          readOnly={!editable}
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          onKeyUp={() => {
            setGeulSize({
              geulId: geul.id,
              viewSize: {
                width: editableRef.current!.getBoundingClientRect().width,
                height: editableRef.current!.getBoundingClientRect().height,
              },
            });
          }}
          onKeyDown={() => {
            setGeulSize({
              geulId: geul.id,
              viewSize: {
                width: editableRef.current!.getBoundingClientRect().width,
                height: editableRef.current!.getBoundingClientRect().height,
              },
            });
          }}
        />
      </Slate>
    </div>
  );
}
