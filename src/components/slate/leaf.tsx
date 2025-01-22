import { RenderLeafProps } from "slate-react";

export default function Leaf(props: RenderLeafProps) {
  return (
    <span
      {...props.attributes}
      className={props.leaf.fontSize ? props.leaf.fontSize : "text-base"}
      style={{
        fontWeight: props.leaf.bold ? "bold" : "normal",
        fontStyle: props.leaf.italic ? "italic" : "",
        color: props.leaf.color ? props.leaf.color : "black",
        textDecoration: props.leaf.underLine ? "underline" : "",
        backgroundColor: props.leaf.bgColor
          ? props.leaf.bgColor
          : "transparent",
      }}
    >
      {props.children}
    </span>
  );
}
