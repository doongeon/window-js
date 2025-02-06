import { useEffect, useState } from 'react';
import { AssetMap, Position, Selection } from '../types';

interface AssetAdjusterProps {
  assets: AssetMap;
  selection: Selection;
}

export function AssetAdjuster({ assets, selection }: AssetAdjusterProps) {
  const [pos, setPos] = useState<Position>();
  const [size, setSize] = useState<{ width: number; height: number }>();

  useEffect(() => {
    let [minX, minY, maxX, maxY] = [99999, 99999, 0, 0];
    for (const assetId of selection) {
      const p1 = assets[assetId].position;
      const p2 = {
        x: p1.x + assets[assetId].viewSize.width,
        y: p1.y + assets[assetId].viewSize.height,
      };
      minX = Math.min(minX, p1.x, p2.x);
      minY = Math.min(minY, p1.y, p2.y);
      maxX = Math.max(maxX, p1.x, p2.x);
      maxY = Math.max(maxY, p1.y, p2.y);
    }

    setPos({ x: minX, y: minY });
    setSize({ width: maxX - minX, height: maxY - minY });
  }, [assets, selection]);

  return (
    <>
      {pos && size && (
        <div
          className={`asset-adjuster`}
          style={{
            position: 'absolute',
            left: pos.x,
            top: pos.y,
            zIndex: 9999,
          }}
        >
          <div className="resize-btns">
            {/* Top Line */}
            <div
              className="absolute bg-blue-400"
              style={{
                left: '0px',
                top: '-6px',
                width: `${size.width}px`,
                height: '1px',
              }}
            ></div>

            {/* Left Line */}
            <div
              className="absolute bg-blue-400"
              style={{
                left: '-6px',
                top: '0px',
                width: '1px',
                height: `${size.height}px`,
              }}
            ></div>

            {/* Right Line */}
            <div
              className="absolute bg-blue-400"
              style={{
                left: `${size.width + 4}px`,
                top: '0px',
                width: '1px',
                height: `${size.height}px`,
              }}
            ></div>

            {/* Bottom Line */}
            <div
              className="absolute bg-blue-400"
              style={{
                left: '0px',
                top: `${size.height + 4}px`,
                width: `${size.width}px`,
                height: '1px',
              }}
            ></div>

            {/* Top Left Button */}
            <button
              className="asset-lt w-2 h-2 bg-blue-400 border-blue-400 absolute"
              style={{ left: '-8px', top: '-8px' }}
            ></button>

            {/* Top Right Button */}
            <button
              className="asset-rt w-2 h-2 bg-blue-400 border-blue-400 absolute"
              style={{ left: `${size.width}px`, top: '-8px' }}
            ></button>

            {/* Bottom Left Button */}
            <button
              className="asset-lb w-2 h-2 bg-blue-400 border-blue-400 absolute"
              style={{ left: '-8px', top: `${size.height}px` }}
            ></button>

            {/* Bottom Right Button */}
            <button
              className="asset-rb w-2 h-2 bg-blue-400 border-blue-400 absolute"
              style={{
                left: `${size.width}px`,
                top: `${size.height}px`,
              }}
            ></button>
          </div>
        </div>
      )}
    </>
  );
}
