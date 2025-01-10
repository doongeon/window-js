import { ColorResult } from "react-color";
import ColorBtn from "./color-btn";

export default function Nav({
  handleCardAdd,
  handleDeleteCard,
  handleColorChange,
  convertToSelect,
  isCardSelected,
}: {
  handleCardAdd: () => void;
  handleDeleteCard: () => void;
  handleColorChange: (color: ColorResult) => void;
  convertToSelect: () => void;
  isCardSelected: boolean;
}) {
  return (
    <nav className="py-2 px-4 fixed top-0 left-0 z-10 w-full flex items-end justify-start gap-4 text-white border-b bg-gradient-to-r from-cyan-400 to-pink-400 border-transparent">
      <h1 className="text-3xl bg-clip-text font-bold">Window.js</h1>
      <button onClick={handleCardAdd}>Add card</button>
      <button
        className={`${isCardSelected ? "opacity-100" : "opacity-40"}`}
        onClick={handleDeleteCard}
      >
        Delete
      </button>
      <button
        onClick={() => {
          convertToSelect();
        }}
      >
        Select
      </button>
      <ColorBtn
        isCardSelected={isCardSelected}
        handleColorChange={handleColorChange}
      />
    </nav>
  );
}
