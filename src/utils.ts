import { Position, WALL_HEIGHT, WALL_WIDTH } from "./types";

export function findAncestor({
  start,
  selector,
}: {
  start: HTMLElement | null;
  selector: string;
}) {
  let currentElement: HTMLElement | null = start;
  while (currentElement) {
    if (currentElement.matches(selector)) {
      return currentElement;
    }
    currentElement = currentElement.parentElement;
  }

  return null;
}

export function getAbsPosition({
  pageX,
  pageY,
  pageOffset,
}: {
  pageX: number;
  pageY: number;
  pageOffset: Position;
}): Position {
  return {
    x: WALL_WIDTH / 2 - pageOffset.x + pageX,
    y: WALL_HEIGHT / 2 - pageOffset.y + pageY,
  };
}
