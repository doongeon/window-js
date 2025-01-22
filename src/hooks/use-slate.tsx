import { useCallback, useState } from "react";
import { createEditor, Editor } from "slate";
import { RenderElementProps, RenderLeafProps, withReact } from "slate-react";
import CodeElement from "../components/slate/code-element";
import DefaultElement from "../components/slate/default-element";
import Leaf from "../components/slate/leaf";

export default function useSlate() {
  const [editors, setEditors] = useState<{ [key: number]: Editor }>({});

  const addNewSlate = ({ geulId }: { geulId: number }) => {
    setEditors((prev) => {
      const newEditors = { ...prev };
      newEditors[geulId] = withReact(createEditor());
      return newEditors;
    });
  };

  const getEditor = ({ geulId }: { geulId: number }) => {
    return editors[geulId];
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      case "paragraph":
        return <DefaultElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

  const renderLeaf = useCallback((props: RenderLeafProps) => {
    return <Leaf {...props} />;
  }, []);

  return {
    addNewSlate,
    getEditor,
    renderElement,
    renderLeaf,
  };
}
