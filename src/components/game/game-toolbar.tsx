"use client";

import { useState } from "react";
import { useLanguage } from "@/components/layout/language-provider";
import type { GameVoteStats } from "@/lib/game-votes-shared";

type Props = {
  gameId: number;
  title: string;
  gameUrl: string;
  voteStats: GameVoteStats;
  onVoteChange: (stats: GameVoteStats) => void;
  onReport: () => void;
};

export function GameToolbar({
  gameId,
  title,
  gameUrl,
  voteStats,
  onVoteChange,
  onReport,
}: Props) {
  const { t } = useLanguage();
  const [busy, setBusy] = useState<"like" | "dislike" | null>(null);

  async function handleVote(vote: "like" | "dislike") {
    if (busy) return;
    setBusy(vote);
    try {
      const res = await fetch(`/api/games/${gameId}/votes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote }),
      });
      if (res.ok) {
        const stats = (await res.json()) as GameVoteStats;
        onVoteChange(stats);
      }
    } finally {
      setBusy(null);
    }
  }

  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: gameUrl });
      } catch {
        /* user cancelled */
      }
    } else {
      await navigator.clipboard.writeText(gameUrl);
    }
  }

  function handleFullscreen() {
    const el = document.getElementById("game-player-container");
    if (el?.requestFullscreen) {
      el.requestFullscreen();
    }
  }

  const voteButtonClass = (active: boolean) =>
    `inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium transition disabled:opacity-50 ${
      active
        ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
        : "bg-[var(--color-surface)] text-[var(--color-muted)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
    }`;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="inline-flex items-center gap-1 rounded-full bg-[var(--color-surface)] p-1">
        <button
          type="button"
          onClick={() => handleVote("like")}
          disabled={busy !== null}
          className={voteButtonClass(voteStats.userVote === "like")}
          title={t("game.like")}
          aria-label={t("game.like")}
          aria-pressed={voteStats.userVote === "like"}
        >
          <ThumbUpIcon filled={voteStats.userVote === "like"} />
          <span>{voteStats.likes}</span>
        </button>
        <button
          type="button"
          onClick={() => handleVote("dislike")}
          disabled={busy !== null}
          className={voteButtonClass(voteStats.userVote === "dislike")}
          title={t("game.dislike")}
          aria-label={t("game.dislike")}
          aria-pressed={voteStats.userVote === "dislike"}
        >
          <ThumbDownIcon filled={voteStats.userVote === "dislike"} />
          <span>{voteStats.dislikes}</span>
        </button>
      </div>

      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]"
      >
        <ShareIcon />
        {t("game.share")}
      </button>
      <button
        type="button"
        onClick={handleFullscreen}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-text)] transition hover:bg-[var(--color-surface-hover)]"
        title={t("game.fullscreen")}
      >
        <FullscreenIcon />
        <span className="hidden sm:inline">{t("game.fullscreen")}</span>
      </button>
      <button
        type="button"
        onClick={onReport}
        className="inline-flex items-center gap-2 rounded-full bg-[var(--color-surface)] px-4 py-2 text-sm font-medium text-[var(--color-muted)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]"
        title={t("game.reportTitle")}
      >
        <FlagIcon />
        <span className="hidden sm:inline">{t("game.report")}</span>
      </button>
    </div>
  );
}

function ThumbUpIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M14 9V5a3 3 0 00-3-3l-4 9v11h11.28a2 2 0 002-1.7l1.38-9a2 2 0 00-2-2.3H14zM7 22H4a2 2 0 01-2-2v-7a2 2 0 012-2h3"
      />
    </svg>
  );
}

function ThumbDownIcon({ filled }: { filled: boolean }) {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M10 15v4a3 3 0 003 3l4-9V2H5.72a2 2 0 00-2 1.7l-1.38 9a2 2 0 002 2.3H10zM17 2h3a2 2 0 012 2v7a2 2 0 01-2 2h-3"
      />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

function FlagIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 7H21l-3 9H3z" />
    </svg>
  );
}

function FullscreenIcon() {
  return (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
    </svg>
  );
}
