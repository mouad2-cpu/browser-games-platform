"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { isAllowedEmbedUrl, normalizeEmbedUrl } from "@/lib/embed-url";

type Props = {
  embedPath: string;
  title: string;
  pageUrl: string;
  onPlay: () => void;
};

export function GamePlayer({ embedPath, title, pageUrl, onPlay }: Props) {
  const playRecorded = useRef(false);
  const [started, setStarted] = useState(false);
  const src = useMemo(
    () => normalizeEmbedUrl(embedPath, pageUrl),
    [embedPath, pageUrl]
  );
  const canPlay = Boolean(
    src && (src.startsWith("/") || isAllowedEmbedUrl(src))
  );

  useEffect(() => {
    setStarted(false);
    playRecorded.current = false;
  }, [embedPath]);

  function startGame() {
    if (!canPlay) return;
    setStarted(true);
    if (playRecorded.current) return;
    playRecorded.current = true;
    onPlay();
  }

  return (
    <div
      id="game-player-container"
      className="relative w-full overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-2xl shadow-black/50"
      style={{ minHeight: "min(70vh, 640px)" }}
    >
      {!started ? (
        <button
          type="button"
          onClick={startGame}
          disabled={!canPlay}
          className="flex h-full min-h-[inherit] w-full flex-col items-center justify-center gap-4 bg-gradient-to-b from-[#1a2030] to-[#0f131a] px-6 text-center disabled:cursor-not-allowed disabled:opacity-60"
          style={{ minHeight: "min(70vh, 640px)" }}
        >
          <span className="text-lg font-semibold text-white sm:text-xl">{title}</span>
          <span className="rounded-xl bg-[var(--color-accent)] px-8 py-3 text-base font-bold text-white shadow-lg transition hover:brightness-110">
            Play Game
          </span>
          <span className="max-w-sm text-sm text-[var(--color-muted)]">
            {canPlay
              ? "Plays on ZenFun Games — stays in this page"
              : "This game embed is unavailable"}
          </span>
        </button>
      ) : (
        <iframe
          src={src}
          title={title}
          allowFullScreen
          // No allow-top-navigation*: blocks replacing zenfungames.com.
          // No allow-popups: blocks "open on provider site" escapes.
          sandbox="allow-scripts allow-same-origin allow-forms allow-pointer-lock allow-fullscreen"
          referrerPolicy="strict-origin-when-cross-origin"
          className="h-full min-h-[inherit] w-full border-0"
          style={{ minHeight: "min(70vh, 640px)" }}
        />
      )}
    </div>
  );
}
