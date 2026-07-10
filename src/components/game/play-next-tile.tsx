"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GameCard } from "@/lib/games";
import { getGameImageAlt } from "@/lib/game-image-alt";

type Props = {
  game: GameCard;
};

export function PlayNextTile({ game }: Props) {
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = !!game.previewVideo;

  const handleEnter = useCallback(() => {
    setHovering(true);
    const video = videoRef.current;
    if (video && game.previewVideo) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    }
  }, [game.previewVideo]);

  const handleLeave = useCallback(() => {
    setHovering(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }, []);

  return (
    <Link
      href={`/game/${game.slug}`}
      aria-label={game.title}
      title={game.title}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      className="group flex gap-3 rounded-xl p-2 transition hover:bg-[var(--color-surface-hover)]"
    >
      <div className="relative size-[72px] shrink-0 overflow-hidden rounded-xl bg-[var(--color-bg)]">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={getGameImageAlt(game.title)}
            fill
            className={`object-cover transition duration-300 ${
              hovering && hasVideo ? "opacity-0" : "opacity-100"
            }`}
            sizes="72px"
          />
        ) : (
          !hasVideo && (
            <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
              ?
            </div>
          )
        )}

        {game.previewVideo && (
          <video
            ref={videoRef}
            src={game.previewVideo}
            muted
            loop
            playsInline
            preload="none"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>
      <p className="line-clamp-2 min-w-0 flex-1 pt-1 text-sm font-medium leading-snug text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
        {game.title}
      </p>
    </Link>
  );
}
