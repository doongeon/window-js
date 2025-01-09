import { useState } from "react";
import { findAncestor, getAbsPosition } from "./utils";
import SelectSquare from "./select-suqare";
import { Card } from "./card";
import { ColorResult } from "react-color";
import useCardMap from "./model/use-card-map";
import { LB, LT, RB, RT, Position, WALL_WIDTH, WALL_HEIGHT } from "./types";
import Nav from "./components/nav";

type MouseType = "select" | "hand";

function App() {
  const {
    cardMap,
    addNewCard,
    deleteCard,
    updateColor: updateCardColor,
    updatePosition: updateCardPosition,
    resize,
  } = useCardMap();
  const [mouseType, setMouseType] = useState<MouseType>("hand");
  const [isMovingCard, setIsMovingCard] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [pageOffset, setPageOffset] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [isDragBg, setIsDragBg] = useState(false);
  const [resizeType, setResizeType] = useState<LT | RT | LB | RB | undefined>();
  const [selectSquare, setSelectSquare] = useState<{
    start: Position;
    end: Position;
  }>({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [selection, setSelection] = useState<number[]>([]);
  const [mouseStartPosition, setMouseStartPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [startPositionMap, setStartPositionMap] = useState<{
    [key: number]: Position;
  }>({});

  function handleCardAdd() {
    addNewCard({
      position: getAbsPosition({ pageX: 100, pageY: 100, pageOffset }),
    });
  }

  function handleDeleteCard() {
    setSelection([]);
    deleteCard(selection);
  }

  function convertToSelect() {
    setSelection([]);
    setMouseType("select");
  }

  function handleMouseDown(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const cardElement = findAncestor({
      start: e.target as HTMLElement,
      selector: ".card",
    });
    const cardId =
      cardElement?.dataset.cardId && parseInt(cardElement.dataset.cardId, 10);

    setMouseStartPosition({ x: e.pageX, y: e.pageY });

    if (mouseType === "hand") {
      if (target.tagName === "BUTTON") {
        if (target.matches(".card-lt")) {
          setResizeType("lt");
        }
        if (target.matches(".card-rt")) {
          setResizeType("rt");
        }
        if (target.matches(".card-lb")) {
          setResizeType("lb");
        }
        if (target.matches(".card-rb")) {
          setResizeType("rb");
        }
        setIsResizing(true);
        return;
      }

      if (cardId) {
        // when user select card
        if (selection.length === 0 || !selection.includes(cardId)) {
          setSelection([cardId]);
        }
        setIsMovingCard(true);
        return;
      }

      if (!cardId) {
        setIsDragBg(true);
      }

      // when click background
      // make selection empty
      setSelection([]);
    }

    if (mouseType === "select") {
      if (!cardId) {
        // when user select background
        setIsSelecting(true);
        setSelection([]);
        return;
      }
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (mouseType === "hand") {
      if (isMovingCard) {
        if (Object.keys(startPositionMap).length === 0) {
          setStartPositionMap(() => {
            const newStartPositionMap: { [key: number]: Position } = {};
            selection.forEach((cardId) => {
              newStartPositionMap[cardId] = { ...cardMap[cardId].position };
            });
            return newStartPositionMap;
          });
        }

        updateCardPosition({
          selection,
          startPositionMap,
          mouseStartPosition: mouseStartPosition,
          mousePosition: { x: e.pageX, y: e.pageY },
        });

        return;
      }

      if (isDragBg) {
        const dx = e.pageX - mouseStartPosition.x;
        const dy = e.pageY - mouseStartPosition.y;
        setDragOffset({ x: dx, y: dy });
      }

      if (isResizing) {
        resize({
          cardId: selection[0],
          type: resizeType,
          position: getAbsPosition({
            pageX: e.pageX,
            pageY: e.pageY,
            pageOffset,
          }),
        });
        return;
      }
    }

    if (mouseType === "select") {
      if (isSelecting) {
        setSelectSquare({
          start: mouseStartPosition,
          end: {
            x: e.pageX,
            y: e.pageY,
          },
        });

        const mouseStart = getAbsPosition({
          pageX: mouseStartPosition.x,
          pageY: mouseStartPosition.y,
          pageOffset,
        });

        const mouseEnd = getAbsPosition({
          pageX: e.pageX,
          pageY: e.pageY,
          pageOffset,
        });

        const p1 = {
          x: Math.min(mouseStart.x, mouseEnd.x),
          y: Math.min(mouseStart.y, mouseEnd.y),
        };
        const p2 = {
          x: Math.max(mouseStart.x, mouseEnd.x),
          y: Math.max(mouseStart.y, mouseEnd.y),
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

    return;
  }

  function handleMouseUp() {
    if (mouseType === "hand") {
      if (isDragBg) {
        setPageOffset((prev) => {
          const newPageOffset = { ...prev };
          newPageOffset.x += dragOffset.x;
          newPageOffset.y += dragOffset.y;
          return newPageOffset;
        });
      }
    }
    setIsResizing(false);
    setIsMovingCard(false);
    setIsSelecting(false);
    setIsDragBg(false);
    setDragOffset({ x: 0, y: 0 });
    setStartPositionMap({});
    setMouseType("hand");
    setMouseStartPosition({ x: 0, y: 0 });
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
      <Nav
        handleCardAdd={handleCardAdd}
        handleDeleteCard={handleDeleteCard}
        handleColorChange={handleColorChange}
        convertToSelect={convertToSelect}
        isCardSelected={selection.length > 0}
      />
      <div
        className={`cards relative bg-slate-800 text-white`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          transform: `translate(${pageOffset.x + dragOffset.x}px, ${
            pageOffset.y + dragOffset.y
          }px)`,
          width: WALL_WIDTH + "px",
          height: WALL_HEIGHT + "px",
          left: -WALL_WIDTH / 2,
          top: -WALL_HEIGHT / 2,
        }}
      >
        {Object.values(cardMap).map((card) => (
          <Card
            key={card.id}
            id={card.id}
            position={card.position}
            size={card.size}
            isSelected={selection.includes(card.id)}
            isSelectedOnly={
              selection.length === 1 && selection.includes(card.id)
            }
            color={card.color}
          />
        ))}
        <SelectSquare
          start={selectSquare.start}
          end={selectSquare.end}
          pageOffset={pageOffset}
        />
      </div>
    </>
  );
}

export default App;
