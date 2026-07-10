"use client";

import Link from "next/link";
import type { GameCard } from "@/lib/games";
import { useLanguage } from "@/components/layout/language-provider";
import { HomeSectionTitle } from "./home-section-title";
import { TopPickGameTile } from "./top-pick-game-tile";

type Props = {
  games: GameCard[];
};

export function ContinuePlayingSection({ games }: Props) {
  const { t } = useLanguage();
  if (games.length === 0) return null;

  return (
    <section className="w-full px-0 pt-2 pb-0">
      <div className="mb-1.5 flex items-center gap-3 px-2 sm:px-3">
        <HomeSectionTitle>{t("home.continuePlaying")}</HomeSectionTitle>
        <Link
          href="/continue-playing"
          className="text-sm font-medium text-[var(--color-accent)] hover:underline"
        >
          {t("common.viewMore")}
        </Link>
      </div>

      <div className="hide-scrollbar flex gap-1.5 overflow-x-auto px-2 pb-1 sm:gap-2 sm:px-3">
        {games.map((game) => (
          <TopPickGameTile
            key={game.id}
            game={{ ...game, featured: false }}
            variant="scroll"
            size="sm"
          />
        ))}
      </div>
    </section>
  );
}
