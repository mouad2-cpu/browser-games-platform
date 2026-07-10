"use client";

import Link from "next/link";
import type { GameCard } from "@/lib/games";
import type { SeoContent } from "@/lib/category-seo-content";
import { useLanguage } from "@/components/layout/language-provider";
import { GameGrid } from "@/components/game/game-grid";
import { CategorySeoSection } from "@/components/category/category-seo-section";

type Props = {
  games: GameCard[];
  total: number;
  seoContent: SeoContent;
};

export function ContinuePlayingPageView({ games, total, seoContent }: Props) {
  const { t, messages } = useLanguage();
  const unit = total === 1 ? messages.common.game : messages.common.games;

  return (
    <div className="px-4 py-8">
      <Link href="/" className="mb-4 inline-block text-sm text-[var(--color-accent)] hover:underline">
        {t("pages.continuePlaying.backHome")}
      </Link>
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{t("pages.continuePlaying.title")}</h1>
      <p className="mb-6 text-[var(--color-muted)]">
        {t("pages.continuePlaying.subtitle", { count: total, unit })}
      </p>
      <GameGrid games={games} dense emptyMessage={t("pages.continuePlaying.empty")} />
      <CategorySeoSection content={seoContent} firstPublished={null} latestAdded={null} />
    </div>
  );
}
