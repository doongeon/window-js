import { useCallback, useState } from "react";
import { createEditor, Descendant, Editor } from "slate";
import { RenderElementProps, RenderLeafProps, withReact } from "slate-react";
import { CodeElement, DefaultElement, Leaf } from "../components/slate";

export default function useSlate() {
  const [editors, setEditors] = useState<{ [key: number]: Editor }>({});
  const [geuls, setGeuls] = useState<{ [key: number]: Descendant[] }>({});

  const addNewSlate = ({ geulId }: { geulId: number }) => {
    setEditors((prev) => {
      const newEditors = { ...prev };
      newEditors[geulId] = withReact(createEditor());
      return newEditors;
    });
    setGeuls((prev) => {
      const newGeuls = { ...prev };
      newGeuls[geulId] = [
        {
          type: "paragraph",
          children: [{ text: "새로운 글" }],
        },
      ] as Descendant[];
      return newGeuls;
    });
  };

  const getEditor = ({ geulId }: { geulId: number }) => {
    return editors[geulId];
  };

  const getGeul = ({ geulId }: { geulId: number }) => {
    return geuls[geulId];
  };

  const renderElement = useCallback((props: RenderElementProps) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
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
    getGeul,
    renderElement,
    renderLeaf,
  };
}
