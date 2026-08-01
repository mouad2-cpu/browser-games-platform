"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { GamePlayer } from "@/components/game/game-player";
import { GameToolbar } from "@/components/game/game-toolbar";
import { GameBreadcrumb } from "@/components/game/game-breadcrumb";
import { GameInfoPanel } from "@/components/game/game-info-panel";
import { GameSeoSection } from "@/components/game/game-seo-section";
import { PlayNextSidebar } from "@/components/game/play-next-sidebar";
import { PlayNextMobileStrip } from "@/components/game/play-next-mobile-strip";
import { ReportPanel } from "@/components/game/report-panel";
import type { GameCard, GameDetail } from "@/lib/games";
import type { GameVoteStats } from "@/lib/game-votes-shared";
import type { GameSeoContent } from "@/lib/game-seo-content";
import {
  appendRecentGameSlug,
  parseRecentGameSlugs,
  RECENT_GAMES_COOKIE,
  serializeRecentGameSlugs,
} from "@/lib/recent-games";

type Props = {
  game: GameDetail;
  relatedGames: GameCard[];
  siteUrl: string;
  showPlayCount?: boolean;
  initialVoteStats: GameVoteStats;
  seoContent: GameSeoContent;
};

export function GameClient({
  game,
  relatedGames,
  siteUrl,
  showPlayCount = false,
  initialVoteStats,
  seoContent,
}: Props) {
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [voteStats, setVoteStats] = useState(initialVoteStats);
  const playRecorded = useRef(false);

  function rememberRecentGame() {
    const match = document.cookie.match(new RegExp(`${RECENT_GAMES_COOKIE}=([^;]+)`));
    const current = parseRecentGameSlugs(match?.[1]);
    const next = appendRecentGameSlug(current, game.slug);
    document.cookie = `${RECENT_GAMES_COOKIE}=${serializeRecentGameSlugs(next)}; path=/; max-age=${60 * 60 * 24 * 90}; SameSite=Lax`;

    void fetch("/api/progress/recent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId: game.id }),
    }).catch(() => {});
  }

  useEffect(() => {
    rememberRecentGame();
  }, [game.slug]);

  async function handlePlay() {
    if (playRecorded.current) return;
    playRecorded.current = true;
    rememberRecentGame();

    try {
      await fetch(`/api/play/${game.id}`, { method: "POST" });
    } catch {
      /* non-critical */
    }
  }

  const gameUrl = `${siteUrl}/game/${game.slug}`;
  const embedPath = game.embedPath ?? "";

  return (
    <div className="mx-auto w-full max-w-[1400px] px-3 py-4 sm:px-4 sm:py-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:gap-6">
        <div className="min-w-0 flex-1">
          {embedPath ? (
            <>
              <GamePlayer
                embedPath={embedPath}
                title={game.title}
                onPlay={handlePlay}
              />

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <GameBreadcrumb categories={game.categories} title={game.title} />
                <GameToolbar
                  gameId={game.id}
                  title={game.title}
                  gameUrl={gameUrl}
                  voteStats={voteStats}
                  onVoteChange={setVoteStats}
                  onReport={() => setIsReportOpen(true)}
                />
              </div>
            </>
          ) : (
            <p className="rounded-2xl bg-[var(--color-surface)] p-8 text-center text-[var(--color-muted)]">
              This game is not available to play yet.
            </p>
          )}

          <GameInfoPanel
            likes={voteStats.likes}
            dislikes={voteStats.dislikes}
            playCount={game.playCount}
            releasedAt={game.releasedAt}
            showPlayCount={showPlayCount}
            categories={game.categories}
          />

          <GameSeoSection content={seoContent} />

          <div className="mt-8">
            <PlayNextMobileStrip games={relatedGames} />
          </div>
        </div>

        <PlayNextSidebar games={relatedGames} className="hidden w-[300px] shrink-0 lg:block" />
      </div>

      <ReportPanel
        gameId={game.id}
        gameTitle={game.title}
        open={isReportOpen}
        onClose={() => setIsReportOpen(false)}
      />
    </div>
  );
}
