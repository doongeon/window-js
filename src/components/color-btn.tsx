import { useEffect, useState } from "react";
import { ColorResult, CompactPicker } from "react-color";

interface ColorBtnProps {
  label?: string;
  active: boolean;
  handleColorChange: (color: ColorResult) => void;
}

export default function ColorBtn({
  label,
  active,
  handleColorChange,
}: ColorBtnProps) {
  const [isActive, setIsActive] = useState(false);

  function handleClick() {
    setIsActive((prev) => !prev);
  }

  useEffect(() => {
    if (!active) setIsActive(false);
  }, [active]);

  return (
    <div className="relative flex justify-center">
      <button
        className={`${active ? "opacity-100" : "opacity-40"}`}
        disabled={!active}
        onClick={handleClick}
      >
        {label ?? "색갈"}
      </button>
      {isActive && (
        <div className="absolute top-full right-1/2">
          <CompactPicker
            onChange={(color) => {
              handleColorChange(color);
            }}
          />
        </div>
      )}
    </div>
  );
}
