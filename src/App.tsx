import { useState } from "react";
import { findAncestor, getAbsPosition } from "./utils";
import SelectSquare from "./components/select-suqare";

import {
  Position,
  WALL_WIDTH,
  WALL_HEIGHT,
  ResizeBtn,
  MouseType,
  MouseTarget,
} from "./types";
import Nav from "./components/nav";
import useSelection from "./hooks/use-selection";
import useViewState from "./model/use-view-state";
import { AssetAdjuster } from "./components/asset-adjuster";
import Assets from "./components/assets";
import useAssetMap from "./model/use-asset-map";

function App() {
  // 모델 변수
  const {
    assets,
    addNewSquare,
    addNewGeul,
    deleteAsset,
    updateColor: updateCardColor,
    updatePosition: updateCardPosition,
    resize,
  } = useAssetMap();
  const {
    zStack,
    pageOffset,
    addOnZStack,
    moveToTopOfZStack,
    moveToBottomOfZStack,
    updatePageOffset,
  } = useViewState();

  // 애플리케이션 상태 스테이트
  const [mouseType, setMouseType] = useState<MouseType>("hand");
  const { selection, clearSelection, updateSelection } = useSelection();

  // 마우스 관련 뷰 스테이트
  const [mouseStartPosition, setMouseStartPosition] = useState<Position>({
    x: 0,
    y: 0,
  });
  const [mouseTarget, setMouseTarget] = useState<MouseTarget | undefined>();
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [resizeType, setResizeType] = useState<ResizeBtn | undefined>();
  const [selectSquare, setSelectSquare] = useState<
    | {
        start: Position;
        end: Position;
      }
    | undefined
  >();
  const [startPositionMap, setStartPositionMap] = useState<{
    [key: number]: Position;
  }>({}); // 카드 드레그시 카드 시작 포지션 저장

  function handleAddSquare() {
    const assetId = addNewSquare({
      position: getAbsPosition({ pageX: 100, pageY: 100, pageOffset }),
    });

    addOnZStack({ assetId });
  }

  function handleAddGeul() {
    const assetId = addNewGeul({
      position: getAbsPosition({ pageX: 100, pageY: 100, pageOffset }),
    });

    addOnZStack({ assetId });
  }

  function handleDeleteAsset() {
    clearSelection();
    deleteAsset(selection);
  }

  function convertToSelect() {
    clearSelection();
    setMouseType("select");
  }

  function handleDoubleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const geulElement = findAncestor({
      start: target,
      selector: ".geul",
    });
  }

  function handleMouseDown(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const cardElement = findAncestor({
      start: target,
      selector: ".asset",
    });
    const cardId =
      cardElement?.dataset.assetId && parseInt(cardElement.dataset.assetId, 10);

    setMouseStartPosition({ x: e.pageX, y: e.pageY });

    //
    // 마우스 타입에 맞는 행동을 if문 아래에 작성
    //

    // 마우스 타입이 hand일때
    // hand는 기본 타입입니다.
    if (mouseType === "hand") {
      if (target.tagName === "BUTTON") {
        if (target.matches(".asset-lt")) {
          setResizeType("lt");
        }
        if (target.matches(".asset-rt")) {
          setResizeType("rt");
        }
        if (target.matches(".asset-lb")) {
          setResizeType("lb");
        }
        if (target.matches(".asset-rb")) {
          setResizeType("rb");
        }
        setMouseTarget("resizeBtn");
        return;
      }

      // when user select card
      if (cardId) {
        if (!selection.includes(cardId)) {
          updateSelection({ newSelection: [cardId] });
        }
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
      // if (cardId) {
      //   updateSelection({ newSelection: [cardId] });
      // }

      // if (!cardId) {
      //   // when user select background
      setMouseTarget("bg");
      clearSelection();
      return;
      // }
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (mouseType === "hand") {
      if (mouseTarget === "card") {
        if (Object.keys(startPositionMap).length === 0) {
          setStartPositionMap(() => {
            const newStartPositionMap: { [key: number]: Position } = {};
            selection.forEach((cardId) => {
              newStartPositionMap[cardId] = { ...assets[cardId].position };
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

        updateSelection({
          newSelection: Object.keys(assets).reduce<number[]>((result, key) => {
            const cardId = parseInt(key, 10);
            if (
              assets[cardId].checkIsIn({
                absPosition1: mouseStart,
                absPosition2: mouseEnd,
              })
            ) {
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
    // console.log("mouse type: " + mouseType, " mouse target: " + mouseTarget);
    // 사용자가 드래그 한 만큼 화면 오프셋 조정
    if (mouseType === "hand") {
      if (mouseTarget === "bg") {
        updatePageOffset(dragOffset);
      }
    }

    // 마우스 관련 값 초기화
    setDragOffset({ x: 0, y: 0 });
    setStartPositionMap({});
    setMouseType("hand");
    setMouseTarget(undefined);
    setMouseStartPosition({ x: 0, y: 0 });
    setSelectSquare(undefined);
  }

  return (
    <>
      <Nav
        selection={selection}
        handleAddSquare={handleAddSquare}
        handleAddGeul={handleAddGeul}
        handleDeleteAsset={handleDeleteAsset}
        updateCardColor={updateCardColor}
        convertToSelect={convertToSelect}
        moveToTopOfZStack={moveToTopOfZStack}
        moveToBottomOfZStack={moveToBottomOfZStack}
        isCardSelected={selection.length > 0}
      />
      <div
        className={`assets relative bg-white dark:bg-zinc-600`}
        onDoubleClick={handleDoubleClick}
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
        <Assets assets={assets} selection={selection} zStack={zStack} />
        <SelectSquare
          start={selectSquare?.start}
          end={selectSquare?.end}
          pageOffset={pageOffset}
        />
        {selection.length === 1 && (
          <AssetAdjuster asset={assets[selection[0]]} />
        )}
      </div>
    </>
  );
}

export default App;
