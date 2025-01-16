import { Asset } from "../types/asset";

export function AssetAdjuster({ asset }: { asset: Asset }) {
  return (
    <div
      className={`asset-adjuster`}
      style={{
        position: "absolute",
        left: asset.position.x,
        top: asset.position.y,
        zIndex: 9999,
      }}
    >
      <div className="resize-btns">
        <button
          className="asset-lt w-2 h-2 bg-slate-50 border border-black absolute"
          style={{ left: "-8px", top: "-8px" }}
        ></button>
        <button
          className="asset-rt w-2 h-2 bg-slate-50 border border-black absolute"
          style={{ left: `${asset.size.width}px`, top: "-8px" }}
        ></button>
        <button
          className="asset-lb w-2 h-2 bg-slate-50 border border-black absolute"
          style={{ left: "-8px", top: `${asset.size.height}px` }}
        ></button>
        <button
          className="asset-rb w-2 h-2 bg-slate-50 border border-black absolute"
          style={{
            left: `${asset.size.width}px`,
            top: `${asset.size.height}px`,
          }}
        ></button>
      </div>
    </div>
  );
}
