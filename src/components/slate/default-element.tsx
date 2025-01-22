import { RenderElementProps } from "slate-react";

export default function DefaultElement(props: RenderElementProps) {
  if (props.element.type !== "paragraph") return "error";

  return (
    <p
      {...props.attributes}
      style={{ textAlign: props.element.textAlign || "start" }}
    >
      {props.children}
    </p>
  );
}
