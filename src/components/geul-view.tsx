import { Geul } from '../types/guel';
import {
  Editable,
  RenderElementProps,
  RenderLeafProps,
  Slate,
} from 'slate-react';
import { Descendant, Editor } from 'slate';
import { useEffect, useRef } from 'react';
import { Size } from '../types';

export interface GuelViewProps {
  editor: Editor;
  renderElement: (props: RenderElementProps) => JSX.Element;
  renderLeaf: (props: RenderLeafProps) => JSX.Element;
  geul: Geul;
  zIndex: number;
  isSelected: boolean;
  editable: boolean;
  setSlate: ({
    geulId,
    slate,
  }: {
    geulId: number;
    slate: Descendant[];
  }) => void;
  setGeulSize: ({
    geulId,
    viewSize,
  }: {
    geulId: number;
    viewSize: Size;
  }) => void;
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
        width: `${geul.getViewWidth()}px`,
        height: `${geul.getViewHeight()}px`,
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
              geulId: geul.id,
              slate,
            });
          }
        }}
      >
        <Editable
          ref={editableRef}
          className="slate-editor px-2 outline-none w-max"
          style={{
            transform: `scale(${geul.getScale()})`,
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
