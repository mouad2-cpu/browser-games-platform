import type { GameCard as GameCardType } from "@/lib/games";
import { GameCard } from "./game-card";

type Props = {
  games: GameCardType[];
  emptyMessage?: string;
  /** 7-column dense grid for list pages (49 games per page) */
  dense?: boolean;
};

export function GameGrid({ games, emptyMessage = "No games found.", dense = false }: Props) {
  if (games.length === 0) {
    return (
      <p className="py-12 text-center text-[var(--color-muted)]">{emptyMessage}</p>
    );
  }

  return (
    <div
      className={
        dense
          ? "grid grid-cols-3 gap-2 sm:grid-cols-4 sm:gap-2.5 md:grid-cols-5 lg:grid-cols-6 lg:gap-3 xl:grid-cols-7"
          : "grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-3 sm:grid-cols-[repeat(auto-fill,minmax(160px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(180px,1fr))] lg:gap-4"
      }
    >
      {games.map((game) => (
        <GameCard key={game.id} game={game} compact={dense} />
      ))}
    </div>
  );
}
