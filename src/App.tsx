import { useState } from "react";
import { findAncestor } from "./utils";
import SelectSquare from "./select-suqare";
import { Card } from "./card";
import ColorBtn from "./color-btn";
import { ColorResult } from "react-color";
import useCardMap from "./model/use-card-map";

export interface Position {
  x: number;
  y: number;
}

function App() {
  const {
    cardMap,
    addNewCard,
    updateColor: updateCardColor,
    updatePosition: updateCardPosition,
  } = useCardMap();
  const [isMovingCard, setIsMovingCard] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectSquare, setSelectSquare] = useState<{
    start: Position;
    end: Position;
  }>({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [selection, setSelection] = useState<number[]>([]);
  const [mousePosition, setMousePosition] = useState<Position>({ x: 0, y: 0 });
  const [startPositionMap, setStartPositionMap] = useState<{
    [key: number]: Position;
  }>({});

  function handleCardAdd() {
    addNewCard();
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
      if (selection.length === 0 || !selection.includes(cardId)) {
        setSelection([cardId]);
      }
      setIsMovingCard(true);
    } else if (!cardId) {
      // when user select background
      setIsSelecting(true);
      setSelection([]);
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (isMovingCard) {
      if (Object.keys(startPositionMap).length === 0) {
        setStartPositionMap(() => {
          const starPositionMap: { [key: number]: Position } = {};
          selection.forEach((cardId) => {
            starPositionMap[cardId] = { ...cardMap[cardId].position };
          });
          return starPositionMap;
        });
      }

      updateCardPosition({
        selection,
        oldPositionMap: startPositionMap,
        mouseStartPosition: mousePosition,
        mousePosition: { x: e.pageX, y: e.pageY },
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
    setStartPositionMap({});
    setMousePosition({ x: 0, y: 0 });
    setSelectSquare({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  }

  function handleColorChange(color: ColorResult) {
    updateCardColor(
      selection.reduce<{ [key: number]: string }>((result, cardId) => {
        result[cardId] = color.hex;
        return result;
      }, {})
    );
  }

  return (
    <>
      <nav className="py-2 px-4 fixed top-0 left-0 z-10 w-full flex items-end justify-start gap-4 text-white border-b border-black">
        <h1 className="text-3xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-pink-400 font-bold">
          Window.js
        </h1>
        <button onClick={handleCardAdd}>Add card</button>
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
