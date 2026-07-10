"use client";

import Link from "next/link";
import type { TopPickGame } from "@/lib/games";
import { useLanguage } from "@/components/layout/language-provider";
import { TopPickGameTile } from "./top-pick-game-tile";
import { TopPicksBentoPanel } from "./top-picks-bento-panel";
import { chunkGamesBySix } from "./home-bento-panel";
import { HomeSectionTitle } from "./home-section-title";

type Props = {
  games: TopPickGame[];
};

export function TopPicksSection({ games }: Props) {
  const { t } = useLanguage();
  if (games.length === 0) return null;

  const panels = chunkGamesBySix(games);

  return (
    <section className="w-full px-0 pt-2 pb-0">
      <div className="mb-1.5 flex items-center gap-3 px-2 sm:px-3">
        <HomeSectionTitle>{t("home.topPicks")}</HomeSectionTitle>
        <Link
          href="/top-picks"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          {t("common.viewMore")}
        </Link>
      </div>

      {panels.length > 0 ? (
        <div className="hide-scrollbar flex snap-x snap-mandatory gap-2 overflow-x-auto px-2 pb-1 sm:gap-3 sm:px-3">
          {panels.map((panel, index) => (
            <div key={index} className="min-w-[calc(100%-1rem)] shrink-0 snap-start sm:min-w-[calc(100%-1.5rem)]">
              <TopPicksBentoPanel games={panel} />
            </div>
          ))}
        </div>
      ) : (
        <div className="hide-scrollbar flex gap-2 overflow-x-auto px-2 pb-1 sm:gap-3 sm:px-3">
          {games.map((game) => (
            <TopPickGameTile key={game.id} game={game} />
          ))}
        </div>
      )}
    </section>
  );
}
