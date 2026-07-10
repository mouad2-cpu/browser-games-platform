"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import type { TopPickGame } from "@/lib/games";
import { getGameImageAlt } from "@/lib/game-image-alt";

type Props = {
  game: TopPickGame;
  variant?: "scroll" | "fill" | "side";
  size?: "default" | "sm";
};

const scrollWidthClass = {
  default: "w-[148px] shrink-0 sm:w-[168px] md:w-[188px]",
  sm: "w-[104px] shrink-0 sm:w-[112px] md:w-[120px]",
} as const;

export function TopPickGameTile({ game, variant = "scroll", size = "default" }: Props) {
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = !!game.previewVideo;
  const isSide = variant === "side";
  const isFill = variant === "fill";

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
      className={`group relative block overflow-hidden bg-[var(--color-surface)] transition duration-200 hover:scale-[1.02] hover:ring-2 hover:ring-[var(--color-accent)] ${
        isSide
          ? "absolute inset-0 h-full w-full"
          : isFill
            ? "h-full w-full min-w-0"
            : `${scrollWidthClass[size]} ${size === "sm" ? "rounded-2xl" : "rounded-3xl"}`
      }`}
    >
      <div
        className={`relative w-full overflow-hidden bg-[var(--color-bg)] ${
          isSide ? "h-full min-h-0" : "aspect-video"
        }`}
      >
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={getGameImageAlt(game.title)}
            fill
            className={`object-cover transition duration-300 group-hover:scale-105 ${
              hovering && hasVideo ? "opacity-0" : "opacity-100"
            }`}
            sizes={isFill || isSide ? "(max-width: 768px) 35vw, 320px" : size === "sm" ? "120px" : "188px"}
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

        {game.featured && (
          <span className="pointer-events-none absolute left-2 top-2 z-10 inline-flex items-center gap-1 rounded-md bg-[#f5c518] px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
            <Star className="size-3 fill-black" aria-hidden />
            Top
          </span>
        )}

        <div
          className={`pointer-events-none absolute inset-0 transition duration-200 ${
            hovering ? "bg-black/30" : "bg-transparent"
          }`}
        />
      </div>
    </Link>
  );
}
