"use client";

import Link from "next/link";
import type { GameCard } from "@/lib/games";
import type { HomeSectionLayout } from "@/lib/home-sections";
import { GameCard as GameCardTile } from "@/components/game/game-card";
import { BentoGameGrid } from "@/components/home/bento-game-grid";
import { GameGrid } from "@/components/game/game-grid";
import { useLanguage } from "@/components/layout/language-provider";
import { HomeSectionTitle } from "./home-section-title";

type Props = {
  title: string;
  categorySlug: string;
  layout: HomeSectionLayout;
  games: GameCard[];
};

export function CategoryGamesSection({ title, categorySlug, layout, games }: Props) {
  const { t } = useLanguage();
  if (games.length === 0) return null;

  return (
    <section className="w-full px-0 pt-2 pb-0">
      <div className="mb-1.5 flex items-center gap-3 px-2 sm:px-3">
        <HomeSectionTitle>{title}</HomeSectionTitle>
        <Link
          href={`/c/${categorySlug}`}
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          {t("common.viewMore")}
        </Link>
      </div>

      {layout === "bento" ? (
        <div className="px-2 sm:px-3">
          <BentoGameGrid games={games.map((g) => ({ ...g, featured: false }))} />
        </div>
      ) : layout === "grid" ? (
        <div className="px-2 sm:px-3">
          <GameGrid games={games} dense />
        </div>
      ) : (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto px-2 pb-1 sm:gap-3 sm:px-3">
          {games.map((game) => (
            <div key={game.id} className="w-[160px] shrink-0 sm:w-[180px]">
              <GameCardTile game={game} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
