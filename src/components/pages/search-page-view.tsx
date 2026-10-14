"use client";

import { useEffect } from "react";
import type { GameCard } from "@/lib/games";
import { useLanguage } from "@/components/layout/language-provider";
import { GameGrid } from "@/components/game/game-grid";
import { trackAnalyticsEvent } from "@/lib/analytics/client";

type Props = {
  games: GameCard[];
  query: string;
  totalResults: number;
};

export function SearchPageView({ games, query, totalResults }: Props) {
  const { t, messages } = useLanguage();
  const total = totalResults;
  const unit = total === 1 ? messages.common.game : messages.common.games;

  useEffect(() => {
    if (!query) return;
    trackAnalyticsEvent({
      name: "search",
      metadata: {
        query: query.slice(0, 120),
        resultCount: totalResults,
        zeroResults: totalResults === 0,
      },
    });
  }, [query, totalResults]);

  return (
    <div className="px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold sm:text-3xl">
        {query ? t("pages.search.titleFor", { query }) : t("pages.search.title")}
      </h1>
      {!query ? (
        <p className="mb-6 text-[var(--color-muted)]">{t("pages.search.hint")}</p>
      ) : (
        <p className="mb-6 text-[var(--color-muted)]">
          {t("pages.search.results", { count: total, unit })}
        </p>
      )}

      <form action="/search" method="GET" className="mb-8 max-w-md">
        <input
          type="search"
          name="s"
          defaultValue={query}
          placeholder={t("shell.searchPlaceholder")}
          className="form-input w-full"
          aria-label={t("shell.searchAria")}
        />
      </form>

      {query ? (
        <GameGrid games={games} dense emptyMessage={t("pages.search.empty")} />
      ) : null}
    </div>
  );
}
