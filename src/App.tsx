import { useState } from "react";
import { findAncestor } from "./utils";
import SelectSquare from "./select-suqare";
import { Card, CardProps } from "./card";
import ColorBtn from "./color-btn";
import { ColorResult } from "react-color";

export interface Position {
  x: number;
  y: number;
}

function App() {
  const [cardMap, setCardMap] = useState<{ [key: number]: CardProps }>({});
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
      const newCard = {
        id,
        position: { x: 100, y: 100 },
        size: { width: 100, height: 40 },
        isSelected: false,
        color: "transparent",
      };
      const newCardMap = { ...prev };
      newCardMap[id] = newCard;
      return newCardMap;
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    const currentElement = e.target as HTMLElement;
    const cardElement = findAncestor({
      start: currentElement,
      selector: ".card",
    });
    const cardId =
      cardElement?.dataset.cardId && parseInt(cardElement.dataset.cardId, 10);

    setMousePosition({ x: e.pageX, y: e.pageY });
    setSelection([]); // make selection empty

    // when user select card
    if (cardId) {
      setSelection([cardId]);
      setOldPositionMap((prev) => {
        const newMap = { ...prev };
        newMap[cardId] = { ...cardMap[cardId].position };
        return newMap;
      });
      setIsMovingCard(true);
    }

    // when user start drag
    if (!cardId) {
      setIsSelecting(true);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isMovingCard) {
      setCardMap((prev) => {
        const newCardMap = { ...prev };
        selection.forEach((cardId) => {
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
    }
  }

  function handleMouseUp() {
    if (isMovingCard) {
      setIsMovingCard(false);
      setMousePosition({ x: 0, y: 0 });
      setOldPositionMap({});
    }

    if (isSelecting) {
      setIsSelecting(false);
      setSelectSquare({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
    }
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
      <nav className="py-2 px-4 bg-slate-200 fixed top-0 left-0 z-10 w-full flex items-end justify-start gap-4">
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
        className="cards relative bg-green-300 w-full h-[100vh]"
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
