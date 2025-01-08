import { useState } from "react";
import { findAncestor } from "./utils";
import SelectSquare from "./select-suqare";
import { Card } from "./card";
import ColorBtn from "./color-btn";
import { ColorResult } from "react-color";
import { Square } from "./square";

export interface Position {
  x: number;
  y: number;
}

function useCardMap() {
  const [cardMap, setCardMap] = useState<{ [key: number]: Square }>({});

  function addNewCard() {
    setCardMap((prev) => {
      const id = Object.keys(cardMap).length + 1;
      const newSquare = new Square({ id });
      const newCardMap = { ...prev };
      newCardMap[id] = newSquare;
      return newCardMap;
    });
  }

  function updateColor(colorMap: { [key: number]: string }) {
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      Object.keys(colorMap).forEach((key) => {
        const cardId = parseInt(key, 10);
        newCardMap[cardId].color = colorMap[cardId];
      });
      return newCardMap;
    });
  }

  function updatePosition({
    selection,
    oldPositionMap,
    mouseStartPosition,
    mousePosition,
  }: {
    selection: number[];
    oldPositionMap: { [key: number]: Position };
    mouseStartPosition: Position;
    mousePosition: Position;
  }) {
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      selection.forEach((cardId) => {
        if (!oldPositionMap[cardId]) return;
        newCardMap[cardId].position.x =
          oldPositionMap[cardId].x + mousePosition.x - mouseStartPosition.x;
        newCardMap[cardId].position.y =
          oldPositionMap[cardId].y + mousePosition.y - mouseStartPosition.y;
      });
      return newCardMap;
    });
  }

  return { cardMap, addNewCard, updateColor, updatePosition };
}

function App() {
  const [cardMap, setCardMap] = useState<{ [key: number]: Square }>({});
  const [isMovingCard, setIsMovingCard] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectSquare, setSelectSquare] = useState<{
    start: Position;
    end: Position;
  }>({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [selection, setSelection] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [oldPositionMap, setOldPositionMap] = useState<{
    [key: number]: { x: number; y: number };
  }>({});

  function cardAddHandler() {
    setCardMap((prev) => {
      const id = Object.keys(cardMap).length + 1;
      const newSquare = new Square({ id });
      const newCardMap = { ...prev };
      newCardMap[id] = newSquare;
      return newCardMap;
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    const cardElement = findAncestor({
      start: e.target as HTMLElement,
      selector: ".card",
    });
    const cardId =
      cardElement?.dataset.cardId && parseInt(cardElement.dataset.cardId, 10);

    setMousePosition({ x: e.pageX, y: e.pageY });

    if (cardId) {
      // when user select card
      if (selection.length === 0 || !selection.includes(cardId))
        setSelection([cardId]);
      setIsMovingCard(true);
    } else if (!cardId) {
      // when user select background
      setIsSelecting(true);
      setSelection([]);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isMovingCard) {
      if (Object.keys(oldPositionMap).length === 0) {
        setOldPositionMap(() => {
          const starPositionMap: { [key: number]: Position } = {};
          selection.forEach((cardId) => {
            starPositionMap[cardId] = { ...cardMap[cardId].position };
          });
          return starPositionMap;
        });
      }

      setCardMap((prev) => {
        const newCardMap = { ...prev };
        selection.forEach((cardId) => {
          if (!oldPositionMap[cardId]) return;
          newCardMap[cardId].position.x =
            oldPositionMap[cardId].x + e.pageX - mousePosition.x;
          newCardMap[cardId].position.y =
            oldPositionMap[cardId].y + e.pageY - mousePosition.y;
        });
        return newCardMap;
      });
    }

    if (isSelecting) {
      setSelectSquare({
        start: mousePosition,
        end: {
          x: e.pageX,
          y: e.pageY,
        },
      });

      const p1 = {
        x: Math.min(mousePosition.x, e.pageX),
        y: Math.min(mousePosition.y, e.pageY),
      };
      const p2 = {
        x: Math.max(mousePosition.x, e.pageX),
        y: Math.max(mousePosition.y, e.pageY),
      };
      const selectedId = Object.keys(cardMap).reduce<number[]>(
        (result, key) => {
          const cardId = parseInt(key, 10);
          if (cardMap[cardId].checkCenterIsIn({ p1, p2 })) {
            result.push(cardId);
          }
          return result;
        },
        []
      );
      setSelection(selectedId);
    }
  }

  function handleMouseUp() {
    setIsMovingCard(false);
    setIsSelecting(false);
    setOldPositionMap({});
    setMousePosition({ x: 0, y: 0 });
    setSelectSquare({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  }

  function handleColorChange(color: ColorResult) {
    setCardMap((prev) => {
      const newCardMap = { ...prev };
      selection.forEach((cardId) => {
        newCardMap[cardId].color = color.hex;
      });
      return newCardMap;
    });
  }

  return (
    <>
      <nav className="py-2 px-4 fixed top-0 left-0 z-10 w-full flex items-end justify-start gap-4 text-white border-b border-black">
        <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 font-bold">
          Window.js
        </h1>
        <button onClick={cardAddHandler}>Add card</button>
        <ColorBtn
          isSelectedItems={selection.length > 0}
          handleColorChange={handleColorChange}
        />
      </nav>
      <div
        className="cards relative w-full h-[100vh] bg-slate-800 text-white"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        {Object.values(cardMap).map((card) => (
          <Card
            key={card.id}
            id={card.id}
            position={card.position}
            size={card.size}
            isSelected={selection.includes(card.id)}
            color={card.color}
          />
        ))}
        <SelectSquare start={selectSquare.start} end={selectSquare.end} />
      </div>
    </>
  );
}

export default App;
