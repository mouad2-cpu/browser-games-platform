import type { ReactNode } from "react";

/** Equal 3 columns: each side tile is 2× wide and 2× tall vs one middle cell (4× area). */
export const HOME_BENTO_GRID_CLASS =
  "grid grid-cols-3 items-stretch gap-1.5 sm:gap-2";

/** Shared corner radius for bento side tiles and middle grid cells. */
const BENTO_TILE_ROUNDED = "overflow-hidden rounded-3xl";

type Props = {
  left: ReactNode;
  middle: ReactNode[];
  right: ReactNode;
};

export function HomeBentoPanel({ left, middle, right }: Props) {
  if (middle.length < 4) return null;

  return (
    <div className={HOME_BENTO_GRID_CLASS}>
      <div className={`relative min-h-0 ${BENTO_TILE_ROUNDED}`}>{left}</div>
      <div className="grid min-w-0 grid-cols-2 grid-rows-2 gap-1.5 sm:gap-2">
        {middle.slice(0, 4).map((tile, index) => (
          <div key={index} className={`min-h-0 ${BENTO_TILE_ROUNDED}`}>
            {tile}
          </div>
        ))}
      </div>
      <div className={`relative min-h-0 ${BENTO_TILE_ROUNDED}`}>{right}</div>
    </div>
  );
}

export function chunkGamesBySix<T>(games: T[]): T[][] {
  const panels: T[][] = [];
  for (let i = 0; i + 6 <= games.length; i += 6) {
    panels.push(games.slice(i, i + 6));
  }
  return panels;
}
