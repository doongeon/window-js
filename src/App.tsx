import { useState } from "react";
import { findAncestor, getAbsPosition } from "./utils";
import SelectSquare from "./components/select-suqare";
import { Card } from "./components/card";
import { ColorResult } from "react-color";
import useCardMap from "./model/use-card-map";
import {
  Position,
  WALL_WIDTH,
  WALL_HEIGHT,
  ResizeBtn,
  MouseType,
} from "./types";
import Nav from "./components/nav";
import useSelection from "./hooks/use-selection";

type MouseTarget = "bg" | "card" | "resizeBtn";

function App() {
  const {
    cardMap,
    addNewCard,
    deleteCard,
    updateColor: updateCardColor,
    updatePosition: updateCardPosition,
    resize,
  } = useCardMap();
  const [zStack, setZStack] = useState<number[]>([]);
  const { selection, clearSelection, updateSelection } = useSelection();
  const [mouseType, setMouseType] = useState<MouseType>("hand");
  const [mouseTarget, setMouseTarget] = useState<MouseTarget | null>(null);
  const [pageOffset, setPageOffset] = useState<Position>({ x: 0, y: 0 });
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [resizeType, setResizeType] = useState<ResizeBtn | undefined>();
  const [selectSquare, setSelectSquare] = useState<{
    start: Position;
    end: Position;
  }>({ start: { x: 0, y: 0 }, end: { x: 0, y: 0 } });
  const [mouseStartPosition, setMouseStartPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [startPositionMap, setStartPositionMap] = useState<{
    [key: number]: Position;
  }>({});

  function handleCardAdd() {
    const cardId = addNewCard({
      position: getAbsPosition({ pageX: 100, pageY: 100, pageOffset }),
    });

    setZStack((prev) => {
      const newZStack = [...prev];
      newZStack.push(cardId);
      return newZStack;
    });
  }

  function handleDeleteCard() {
    clearSelection();
    deleteCard(selection);
  }

  function convertToSelect() {
    clearSelection();
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

    //
    // 마우스 타입에 맞는 행동을 if문 아래에 작성
    //

    // 마우스 타입이 hand일때
    // hand는 기본 타입입니다.
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
        setMouseTarget("resizeBtn");
        return;
      }

      // when user select card
      if (cardId) {
        if (selection.length === 0 || !selection.includes(cardId)) {
          updateSelection({ newSelection: [cardId] });
        }

        setZStack((prev) => {
          const idx = prev.indexOf(cardId);
          const head = prev.slice(0, idx);
          const tail = prev.slice(idx + 1);
          const newZStack = [...head, ...tail, prev[idx]];
          return newZStack;
        });
        setMouseTarget("card");
        return;
      }

      if (!cardId) {
        setMouseTarget("bg");
      }

      // 백그라운드를 클릭했을때는 selection을 비운다
      clearSelection();
    }

    // 마우스 타입이 select일때
    // 네비게이션에서 select를 클릭하면 마우스 타입이 select입니다
    // select 타입은 드래그 해서 여러 카드를 선택할 수 있도록 합니다.
    if (mouseType === "select") {
      if (cardId) {
        updateSelection({ newSelection: [cardId] });
      }

      if (!cardId) {
        // when user select background
        setMouseTarget("bg");
        clearSelection();
        return;
      }
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (mouseType === "hand") {
      if (mouseTarget === "card") {
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
          selection: selection,
          startPositionMap,
          mouseStartPosition: mouseStartPosition,
          mousePosition: { x: e.pageX, y: e.pageY },
        });

        return;
      }

      if (mouseTarget === "bg") {
        const dx = e.pageX - mouseStartPosition.x;
        const dy = e.pageY - mouseStartPosition.y;
        setDragOffset({ x: dx, y: dy });
        return;
      }

      if (mouseTarget === "resizeBtn") {
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
      if (mouseTarget === "bg") {
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

        updateSelection({
          newSelection: Object.keys(cardMap).reduce<number[]>((result, key) => {
            const cardId = parseInt(key, 10);
            if (cardMap[cardId].checkCenterIsIn({ p1, p2 })) {
              result.push(cardId);
            }
            return result;
          }, []),
        });
      }
    }

    return;
  }

  function handleMouseUp() {
    // 사용자가 드래그 한 만큼 화면 오프셋 조정
    if (mouseType === "hand") {
      if (mouseTarget === "bg") {
        setPageOffset((prev) => {
          const newPageOffset = { ...prev };
          newPageOffset.x += dragOffset.x;
          newPageOffset.y += dragOffset.y;
          return newPageOffset;
        });
      }
    }

    // 마우스 관련 값 초기화
    console.log(zStack);
    setDragOffset({ x: 0, y: 0 });
    setStartPositionMap({});
    setMouseType("hand");
    setMouseTarget(null);
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
            card={card}
            zIndex={zStack.indexOf(card.id)}
            isSelected={selection.includes(card.id)}
            isSelectedOnly={
              selection.length === 1 && selection.includes(card.id)
            }
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
