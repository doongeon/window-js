import { useState } from 'react';
import { findAncestor, getAbsPosition } from './utils';
import SelectSquare from './components/select-suqare';

import {
  Position,
  WALL_WIDTH,
  WALL_HEIGHT,
  ResizeBtn,
  MouseTarget,
  MouseType,
} from './types';
import Nav from './components/nav';
import useSelection from './hooks/use-selection';
import useViewState from './model/use-view-state';
import { AssetAdjuster } from './components/asset-adjuster';
import useAssetMap from './model/use-asset-map';
import OptionBar from './components/option-bar';

import { GuelView } from './components/geul-view';
import { Square } from './types/square';
import { SquareView } from './components/square-view';
import { Geul } from './types/guel';
import useSlate from './hooks/use-slate';

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
    setSlate,
    setGeulSize,
    resetPivot,
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
  const [mouseType, setMouseType] = useState<MouseType>('hand');
  const { selection, clearSelection, updateSelection } = useSelection();

  // 텍스트 에디터 스테이트
  const { addNewSlate, getEditor, renderElement, renderLeaf } = useSlate();

  // 마우스 관련 뷰 스테이트
  const [mousePosition, setMousePosition] = useState<{
    start?: Position;
    end?: Position;
  }>({});
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
    updateSelection({ newSelection: [assetId] });
  }

  function handleAddGeul() {
    const assetId = addNewGeul({
      position: getAbsPosition({ pageX: 100, pageY: 100, pageOffset }),
    });
    addNewSlate({ geulId: assetId });

    addOnZStack({ assetId });
    updateSelection({ newSelection: [assetId] });
    setMouseType('text');
  }

  function handleDeleteAsset() {
    clearSelection();
    deleteAsset(selection);
  }

  function convertToSelect() {
    clearSelection();
    setMouseType('select');
  }

  function handleDoubleClick(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const geulElement = findAncestor({
      start: target,
      selector: '.geul',
    });
    const slateEditorElement = findAncestor({
      start: target,
      selector: '.slate-editor',
    });
    const geulId =
      geulElement?.dataset.assetId && parseInt(geulElement.dataset.assetId, 10);

    if (geulId && slateEditorElement) {
      updateSelection({ newSelection: [geulId] });
      setMouseType('text');
    }
  }

  function handleMouseDown(e: React.MouseEvent) {
    const target = e.target as HTMLElement;
    const assetElement = findAncestor({
      start: target,
      selector: '.asset',
    });
    const assetId =
      assetElement?.dataset.assetId &&
      parseInt(assetElement.dataset.assetId, 10);

    setMousePosition({ start: { x: e.pageX, y: e.pageY } });

    //
    // 마우스 타입에 맞는 행동을 if문 아래에 작성
    //

    if (target.tagName === 'BUTTON') {
      if (target.matches('.asset-lt')) {
        setResizeType('TL');
      }
      if (target.matches('.asset-rt')) {
        setResizeType('TR');
      }
      if (target.matches('.asset-lb')) {
        setResizeType('BL');
      }
      if (target.matches('.asset-rb')) {
        setResizeType('BR');
      }
      setMouseTarget('resizeBtn');
      return;
    }

    // 마우스 타입이 hand일때
    // hand는 기본 타입입니다.
    if (mouseType === 'hand') {
      // when user select card
      if (assetId) {
        if (!selection.includes(assetId)) {
          updateSelection({ newSelection: [assetId] });
        }
        setMouseTarget('asset');
        return;
      }

      if (!assetId) {
        setMouseTarget('bg');
      }

      // 백그라운드를 클릭했을때는 selection을 비운다
      clearSelection();
    }

    // 마우스 타입이 select일때
    // 네비게이션에서 select를 클릭하면 마우스 타입이 select입니다
    // select 타입은 드래그 해서 여러 카드를 선택할 수 있도록 합니다.
    if (mouseType === 'select') {
      setMouseTarget('bg');
      clearSelection();
      return;
    }

    // 마우스 타입이 text일때
    // 선택된 글 자산을 한번더 클릭하면 마우스 타입이 'text'입니다.
    // text타입일때는 글 수정이 가능합니다.
    if (mouseType === 'text') {
      if (assetId && !selection.includes(assetId)) {
        setMouseType('hand');
        clearSelection();
        updateSelection({ newSelection: [assetId] });
        return;
      }

      if (!assetId) {
        setMouseType('hand');
        clearSelection();
        return;
      }
    }
  }

  function handleMouseMove(e: React.MouseEvent) {
    if (!mousePosition.start) return;

    setMousePosition((prev) => {
      return { ...prev, end: { x: e.pageX, y: e.pageY } };
    });

    if (mouseTarget === 'resizeBtn') {
      if (selection.length === 1) {
        resize({
          assetId: selection[0],
          type: resizeType,
          mousePos: getAbsPosition({
            pageX: e.pageX,
            pageY: e.pageY,
            pageOffset,
          }),
        });
        return;
      } else {
        /**
         * TO DO
         * 1. 여러 에셋이 선택되었을때는 리사이즈 버튼을 통해 전체 비율에 맞추어 스케일만 조정
         */
      }
    }

    if (mouseType === 'hand') {
      if (mouseTarget === 'asset') {
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
          mouseStartPosition: mousePosition.start,
          mousePosition: { x: e.pageX, y: e.pageY },
        });

        return;
      }

      if (mouseTarget === 'bg') {
        const dx = e.pageX - mousePosition.start.x;
        const dy = e.pageY - mousePosition.start.y;
        setDragOffset({ x: dx, y: dy });
        return;
      }
    }

    if (mouseType === 'select') {
      if (mouseTarget === 'bg') {
        setSelectSquare({
          start: mousePosition.start,
          end: {
            x: e.pageX,
            y: e.pageY,
          },
        });

        const mouseStart = getAbsPosition({
          pageX: mousePosition.start.x,
          pageY: mousePosition.start.y,
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
    if (mouseType === 'hand') {
      if (mouseTarget === 'bg') {
        updatePageOffset(dragOffset);
      }
    }

    // 마우스 관련 값 초기화
    setDragOffset({ x: 0, y: 0 });
    setStartPositionMap({});
    if (mouseType !== 'text') {
      setMouseType('hand');
    }
    resetPivot(); // 리사이즈시 사용된 피벗 초기화
    setMouseTarget(undefined);
    setSelectSquare(undefined);
    setMousePosition({});
  }

  return (
    <>
      <Nav
        assets={assets}
        selection={selection}
        handleAddSquare={handleAddSquare}
        handleAddGeul={handleAddGeul}
        handleDeleteAsset={handleDeleteAsset}
        updateCardColor={updateCardColor}
        convertToSelect={convertToSelect}
        moveToTopOfZStack={moveToTopOfZStack}
        moveToBottomOfZStack={moveToBottomOfZStack}
      />
      <div
        className={`assets relative bg-white`}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        style={{
          transform: `translate(${pageOffset.x + dragOffset.x}px, ${
            pageOffset.y + dragOffset.y
          }px)`,
          width: WALL_WIDTH + 'px',
          height: WALL_HEIGHT + 'px',
          left: -WALL_WIDTH / 2,
          top: -WALL_HEIGHT / 2,
        }}
      >
        {Object.values(assets).map((asset) => {
          if (asset instanceof Square) {
            return (
              <SquareView
                key={asset.id}
                square={asset}
                zIndex={zStack.indexOf(asset.id)}
              />
            );
          } else if (asset instanceof Geul) {
            return (
              <GuelView
                key={asset.id}
                editor={getEditor({ geulId: asset.id })}
                renderElement={renderElement}
                renderLeaf={renderLeaf}
                geul={asset}
                setSlate={setSlate}
                setGeulSize={setGeulSize}
                zIndex={zStack.indexOf(asset.id)}
                isSelected={selection.includes(asset.id)}
                editable={
                  mouseType === 'text' &&
                  selection.length === 1 &&
                  selection.includes(asset.id)
                }
              />
            );
          }
        })}
        <SelectSquare
          start={selectSquare?.start}
          end={selectSquare?.end}
          pageOffset={pageOffset}
        />
        {selection.length > 0 && (
          <AssetAdjuster assets={assets} selection={selection} />
        )}
      </div>
      <OptionBar
        mouseType={mouseType}
        selection={selection}
        editor={getEditor({ geulId: selection[0] })}
      />
    </>
  );
}

export default App;
