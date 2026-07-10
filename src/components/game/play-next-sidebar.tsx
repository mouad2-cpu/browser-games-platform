import type { GameCard } from "@/lib/games";
import { PlayNextTile } from "./play-next-tile";

type Props = {
  games: GameCard[];
  className?: string;
};

export function PlayNextSidebar({ games, className = "" }: Props) {
  if (games.length === 0) return null;

  return (
    <aside className={className}>
      <div className="sticky top-[calc(var(--header-h)+1rem)] rounded-2xl bg-[var(--color-surface)] p-3">
        <h2 className="mb-3 px-2 text-sm font-semibold text-[var(--color-text)]">Play next</h2>
        <div className="hide-scrollbar max-h-[calc(100vh-var(--header-h)-4rem)] space-y-1 overflow-y-auto">
          {games.map((game) => (
            <PlayNextTile key={game.id} game={game} />
          ))}
        </div>
      </div>
    </aside>
  );
}
