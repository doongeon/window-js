import { MouseType } from "../types";
import { Geul } from "../types/guel";
import { Square } from "../types/square";
import { GuelView } from "./geul-view";
import { SquareView } from "./square-view";

interface AssetsProps {
  assets: { [key: number]: Square | Geul };
  selection: number[];
  zStack: number[];
  mouseType: MouseType;
}

export default function Assets({
  assets,
  selection,
  zStack,
  mouseType,
}: AssetsProps) {
  return (
    <>
      {Object.values(assets).map((asset) => {
        if (asset instanceof Square) {
          return (
            <SquareView
              key={asset.id}
              square={asset}
              zIndex={zStack.indexOf(asset.id)}
              isSelected={selection.includes(asset.id)}
              isSelectedOnly={
                selection.length === 1 && selection.includes(asset.id)
              }
            />
          );
        } else if (asset instanceof Geul) {
          return (
            <GuelView
              key={asset.id}
              geul={asset}
              zIndex={zStack.indexOf(asset.id)}
              editable={mouseType === "text"}
              isSelected={selection.includes(asset.id)}
            />
          );
        }
      })}
    </>
  );
}
