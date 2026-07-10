import type { TopPickGame } from "@/lib/games";
import { BentoGameTile } from "./bento-game-tile";

type Props = {
  games: TopPickGame[];
};

export function BentoGameGrid({ games }: Props) {
  if (games.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 sm:gap-2">
      {games.map((game) => (
        <div key={game.id} className="aspect-[2/1] w-full overflow-hidden rounded-xl">
          <BentoGameTile game={game} size="medium" className="h-full w-full" />
        </div>
      ))}
    </div>
  );
}
