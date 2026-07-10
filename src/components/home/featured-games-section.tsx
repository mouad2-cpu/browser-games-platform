"use client";

import type { FeaturedHomeGame } from "@/lib/games";
import { useLanguage } from "@/components/layout/language-provider";
import { FeaturedGameTile } from "./featured-game-tile";
import { HomeSectionTitle } from "./home-section-title";

type Props = {
  games: FeaturedHomeGame[];
};

export function FeaturedGamesSection({ games }: Props) {
  const { t } = useLanguage();
  if (games.length === 0) return null;

  return (
    <section className="w-full px-0 pt-2 pb-0">
      <HomeSectionTitle className="mb-1.5 px-2 sm:px-3">{t("home.featuredGames")}</HomeSectionTitle>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-2 pb-1 sm:gap-3 sm:px-3">
        {games.map((game) => (
          <FeaturedGameTile key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
