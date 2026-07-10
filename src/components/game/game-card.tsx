"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import type { GameCard } from "@/lib/games";
import { getGameImageAlt } from "@/lib/game-image-alt";

type Props = {
  game: GameCard;
  compact?: boolean;
};

export function GameCard({ game, compact = false }: Props) {
  const [hovering, setHovering] = useState(false);
  const [flash, setFlash] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = !!game.previewVideo;

  const handleEnter = useCallback(() => {
    setHovering(true);
    if (compact) setFlash(true);
    const video = videoRef.current;
    if (video && game.previewVideo) {
      video.currentTime = 0;
      void video.play().catch(() => {});
    }
  }, [game.previewVideo, compact]);

  const handleLeave = useCallback(() => {
    setHovering(false);
    setFlash(false);
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
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onFocus={handleEnter}
      onBlur={handleLeave}
      className={`group block overflow-hidden bg-[var(--color-surface)] transition hover:ring-2 hover:ring-[var(--color-accent)] ${
        compact ? "rounded-lg" : "rounded-xl"
      }`}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-bg)]">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={getGameImageAlt(game.title)}
            fill
            className={`object-cover transition duration-300 group-hover:scale-105 ${
              hovering && hasVideo ? "opacity-0" : "opacity-100"
            }`}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 200px"
          />
        ) : (
          !hasVideo && (
            <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
              No image
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

        <div
          className={`pointer-events-none absolute inset-0 transition duration-300 ${
            hovering ? "bg-black/40" : "bg-black/0"
          }`}
        />

        {compact && flash && (
          <div
            className="pointer-events-none absolute inset-0 animate-[card-flash_0.35s_ease-out_forwards] bg-white/50"
            onAnimationEnd={() => setFlash(false)}
          />
        )}

        <div
          className={`pointer-events-none absolute inset-x-0 bottom-0 transition duration-300 ${
            compact ? "p-2" : "p-3"
          } ${hovering ? "opacity-100" : "opacity-0"}`}
        >
          <h3
            className={`line-clamp-2 font-bold leading-snug text-white drop-shadow-sm ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {game.title}
          </h3>
        </div>
      </div>
    </Link>
  );
}
