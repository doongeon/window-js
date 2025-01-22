import { BaseEditor } from "slate";
import { HistoryEditor } from "slate-history";
import { ReactEditor } from "slate-react";

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor;

export type FontSize =
  | "text-base"
  | "text-sm"
  | "text-xs"
  | "text-lg"
  | "text-xl";

export type ParagraphElement = {
  type: "paragraph";
  textAlign?: "start" | "center" | "end";
  children: CustomText[];
};

export type HeadingElement = {
  type: "heading";
  level: number;
  children: CustomText[];
};

export type CodeElement = {
  type: "code";
  children: CustomText[];
};

export type CustomElement = ParagraphElement | HeadingElement | CodeElement;

export type FormattedText = {
  text: string;
  bold?: true;
  underLine?: true;
  fontSize?: FontSize;
  color?: string;
  italic?: true;
};

export type CustomText = FormattedText;

declare module "slate" {
  interface CustomTypes {
    Editor: CustomEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}
