import { useEffect, useState } from "react";
import { ColorResult, TwitterPicker } from "react-color";

export default function ColorBtn({
  isSelectedItems,
  handleColorChange,
}: {
  isSelectedItems: boolean;
  handleColorChange: (color: ColorResult) => void;
}) {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setIsActive((prev) => !prev);
  }

  useEffect(() => {
    if (!isSelectedItems) setIsActive(false);
  }, [isSelectedItems]);

  return (
    <div className="relative">
      <button
        className={`${isSelectedItems ? "opacity-100" : "opacity-40"}`}
        onClick={handleClick}
      >
        Set color
      </button>
      <TwitterPicker
        className={`${isActive ? "" : "hidden"} absolute`}
        onChange={(color) => {
          handleColorChange(color);
        }}
      />
    </div>
  );
}
