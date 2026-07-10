"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { TopPickGame } from "@/lib/games";
import { getGameImageAlt } from "@/lib/game-image-alt";

type Props = {
  game: TopPickGame;
  size?: "large" | "medium";
  className?: string;
};

export function BentoGameTile({ game, size = "medium", className = "" }: Props) {
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
      onFocus={handleEnter}
      onBlur={handleLeave}
      className={`group relative block h-full min-h-0 overflow-hidden rounded-xl bg-[var(--color-surface)] transition duration-200 hover:ring-2 hover:ring-[var(--color-accent)] ${className}`}
    >
      <div className="absolute inset-0">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={getGameImageAlt(game.title)}
            fill
            className={`object-cover object-center transition duration-300 group-hover:scale-[1.03] ${
              hovering && hasVideo ? "opacity-0" : "opacity-100"
            }`}
            sizes={size === "large" ? "320px" : "220px"}
          />
        ) : (
          !hasVideo && (
            <div className="flex h-full items-center justify-center text-[var(--color-muted)]">
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
            className={`absolute inset-0 h-full w-full object-cover object-center transition-opacity duration-300 ${
              hovering ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
      </div>

      <div
        className={`pointer-events-none absolute inset-0 transition duration-300 ${
          hovering ? "bg-black/30" : "bg-black/0"
        }`}
      />

      {game.featured && (
        <span className="pointer-events-none absolute left-1.5 top-1.5 z-10 inline-flex items-center gap-0.5 rounded-md bg-[#f5c518] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black sm:left-2 sm:top-2">
          <Star className="size-3 fill-black" aria-hidden />
          Top
        </span>
      )}
    </Link>
  );
}
