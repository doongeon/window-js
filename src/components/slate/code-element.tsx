import { RenderElementProps } from "slate-react";

// Define a React component renderer for our code blocks.
export default function CodeElement(props: RenderElementProps) {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
}
