import type { TopPickGame } from "@/lib/games";
import { HomeBentoPanel } from "./home-bento-panel";
import { TopPickGameTile } from "./top-pick-game-tile";

type Props = {
  games: TopPickGame[];
};

export function TopPicksBentoPanel({ games }: Props) {
  const left = games[0];
  const middle = games.slice(1, 5);
  const right = games[5];

  if (!left || middle.length < 4 || !right) return null;

  return (
    <HomeBentoPanel
      left={<TopPickGameTile game={left} variant="side" />}
      middle={middle.map((game) => (
        <TopPickGameTile key={game.id} game={game} variant="fill" />
      ))}
      right={<TopPickGameTile game={right} variant="side" />}
    />
  );
}
