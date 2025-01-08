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
