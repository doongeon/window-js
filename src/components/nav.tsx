import { ColorResult } from "react-color";
import ColorBtn from "./color-btn";

export default function Nav({
  selection,
  handleCardAdd,
  handleDeleteCard,
  convertToSelect,
  updateCardColor,
  moveToTopOfZStack,
  moveToBottomOfZStack,
  isCardSelected,
}: {
  selection: number[];
  handleCardAdd: () => void;
  handleDeleteCard: () => void;
  convertToSelect: () => void;
  updateCardColor: (colorMap: { [key: number]: string }) => void;
  moveToTopOfZStack: ({ cardIds }: { cardIds: number[] }) => void;
  moveToBottomOfZStack: ({ cardIds }: { cardIds: number[] }) => void;
  isCardSelected: boolean;
}) {
  function handleColorChange(color: ColorResult) {
    updateCardColor(
      selection.reduce<{ [key: number]: string }>((result, cardId) => {
        result[cardId] = color.hex;
        return result;
      }, {})
    );
  }

  return (
    <nav className="py-2 px-4 fixed top-0 left-0 z-10 w-full flex items-end justify-start gap-4 text-white border-b bg-gradient-to-r from-cyan-400 to-pink-400 border-transparent">
      <h1 className="text-3xl bg-clip-text font-bold">Window.js</h1>
      <button
        onClick={() => {
          convertToSelect();
        }}
      >
        선택
      </button>
      <button onClick={handleCardAdd}>카드 추가</button>
      <button
        className={`${isCardSelected ? "opacity-100" : "opacity-40"}`}
        onClick={handleDeleteCard}
      >
        삭제
      </button>

      <ColorBtn
        isCardSelected={isCardSelected}
        handleColorChange={handleColorChange}
      />

      <button
        onClick={() => {
          moveToTopOfZStack({ cardIds: selection });
        }}
      >
        맨 위로
      </button>
      <button
        onClick={() => {
          moveToBottomOfZStack({ cardIds: selection });
        }}
      >
        맨 뒤로
      </button>
    </nav>
  );
}
