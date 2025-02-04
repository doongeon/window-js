import { Position } from '../types';
import { Square } from '../types/square';

export interface SquareProps {
  square: Square;
  zIndex: number;
  dragOffset?: Position;
}

export function SquareView({ square, zIndex }: SquareProps) {
  return (
    <div
      className={`asset square border-4 border-gray-600 container rounded-lg text-black outline-none
      `}
      style={{
        position: 'absolute',
        width: square.size.width,
        height: square.size.height,
        left: square.position.x,
        top: square.position.y,
        backgroundColor: square.color,
        zIndex: zIndex,
      }}
      data-asset-id={square.id}
    ></div>
  );
}
