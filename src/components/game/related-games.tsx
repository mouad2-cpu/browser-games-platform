import { getRelatedGames } from "@/lib/games";
import { GameGrid } from "./game-grid";

type Props = {
  gameId: number;
};

export async function RelatedGames({ gameId }: Props) {
  const games = await getRelatedGames(gameId);

  if (games.length === 0) return null;

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold">Related Games</h2>
      <GameGrid games={games} />
    </section>
  );
}
