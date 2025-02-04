import { Geul } from './guel';
import { Square } from './square';

export type MouseType = 'select' | 'hand' | 'text';
export type MouseTarget = 'bg' | 'asset' | 'resizeBtn';
export type ResizeBtn = 'TL' | 'TR' | 'BL' | 'BR';

export type AssetMap = { [key: number]: Square | Geul };
export type Selection = number[];

export type Size = { width: number; height: number };

export const WALL_WIDTH = 100000;
export const WALL_HEIGHT = 100000;

export interface Position {
  x: number;
  y: number;
}
