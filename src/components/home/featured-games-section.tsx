"use client";

import Link from "next/link";
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
      <div className="mb-1.5 flex items-center gap-3 px-2 sm:px-3">
        <HomeSectionTitle>{t("home.featuredGames")}</HomeSectionTitle>
        <Link
          href="/all-games"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          {t("common.viewMore")}
        </Link>
      </div>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto px-2 pb-1 sm:gap-3 sm:px-3">
        {games.map((game) => (
          <FeaturedGameTile key={game.id} game={game} />
        ))}
      </div>
    </section>
  );
}
