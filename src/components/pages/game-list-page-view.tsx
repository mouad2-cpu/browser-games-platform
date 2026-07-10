"use client";

import type { GameCard } from "@/lib/games";
import type { SeoContent } from "@/lib/category-seo-content";
import { useLanguage } from "@/components/layout/language-provider";
import { GameGrid } from "@/components/game/game-grid";
import { GameListPagination } from "@/components/game/game-list-pagination";
import { CategorySeoSection } from "@/components/category/category-seo-section";

const PAGE_PATHS = {
  new: "/new",
  popular: "/popular",
  topPicks: "/top-picks",
  allGames: "/all-games",
} as const;

type DateRange = {
  firstPublished: Date | null;
  latestAdded: Date | null;
};

type Props = {
  pageKey: keyof typeof PAGE_PATHS;
  games: GameCard[];
  total: number;
  page: number;
  totalPages: number;
  /** Same structure as category SEO: { aboutTitle, paragraphs, faqs }. */
  seoContent: SeoContent;
  /** Same date footer fields as category pages. */
  dateRange?: DateRange;
};

export function GameListPageView({
  pageKey,
  games,
  total,
  page,
  totalPages,
  seoContent,
  dateRange,
}: Props) {
  const { t, messages } = useLanguage();
  const unit = total === 1 ? messages.common.game : messages.common.games;
  const pageCopy = messages.pages[pageKey];

  return (
    <div className="px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">{pageCopy.title}</h1>
      <p className="mb-6 text-[var(--color-muted)]">
        {t(`pages.${pageKey}.subtitle`, { count: total, unit })}
        {pageKey === "new" && totalPages > 1
          ? t("pages.new.pageSlice", { count: games.length, page })
          : null}
      </p>

      <GameGrid games={games} dense emptyMessage={pageCopy.empty} />
      <GameListPagination page={page} totalPages={totalPages} path={PAGE_PATHS[pageKey]} />

      <CategorySeoSection
        content={seoContent}
        firstPublished={dateRange?.firstPublished ?? null}
        latestAdded={dateRange?.latestAdded ?? null}
      />
    </div>
  );
}
