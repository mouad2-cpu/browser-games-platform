"use client";

import Link from "next/link";
import type { GameCard } from "@/lib/games";
import { useLanguage } from "@/components/layout/language-provider";
import { GameGrid } from "@/components/game/game-grid";
import { HomeSectionTitle } from "./home-section-title";

type Props = {
  games: GameCard[];
};

export function LatestSection({ games }: Props) {
  const { t } = useLanguage();
  if (games.length === 0) return null;

  return (
    <section className="w-full px-0 pt-2 pb-4">
      <div className="mb-1.5 flex items-center gap-3 px-2 sm:px-3">
        <HomeSectionTitle>{t("home.latestGames")}</HomeSectionTitle>
        <Link
          href="/new"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          {t("common.viewMore")}
        </Link>
      </div>
      <div className="px-2 sm:px-3">
        <GameGrid games={games} />
      </div>
    </section>
  );
}
