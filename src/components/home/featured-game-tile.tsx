"use client";

import { useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Flame, RefreshCw, Star } from "lucide-react";
import type { FeaturedBadge, FeaturedHomeGame } from "@/lib/games";
import { useLanguage } from "@/components/layout/language-provider";
import { getGameImageAlt } from "@/lib/game-image-alt";

type Props = {
  game: FeaturedHomeGame;
};

const badgeLabelKeys: Record<FeaturedBadge, string> = {
  top: "home.badgeTop",
  hot: "home.badgeHot",
  updated: "home.badgeUpdated",
};

const badgeStyles: Record<FeaturedBadge, { className: string; icon: typeof Star }> = {
  top: { className: "bg-[#f5c518] text-black", icon: Star },
  hot: { className: "bg-[#e85d04] text-white", icon: Flame },
  updated: { className: "bg-[#48cae4] text-black", icon: RefreshCw },
};

export function FeaturedGameTile({ game }: Props) {
  const { t } = useLanguage();
  const [hovering, setHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const hasVideo = !!game.previewVideo;
  const badge = badgeStyles[game.badge];
  const BadgeIcon = badge.icon;

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
      className="group relative block w-[140px] shrink-0 overflow-hidden rounded-3xl bg-[var(--color-surface)] transition duration-200 hover:scale-[1.02] hover:ring-2 hover:ring-[var(--color-accent)] sm:w-[160px] md:w-[180px]"
    >
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[var(--color-bg)]">
        {game.thumbnail ? (
          <Image
            src={game.thumbnail}
            alt={getGameImageAlt(game.title)}
            fill
            className={`object-cover transition duration-300 group-hover:scale-105 ${
              hovering && hasVideo ? "opacity-0" : "opacity-100"
            }`}
            sizes="180px"
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

        <span
          className={`pointer-events-none absolute left-2 top-2 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide ${badge.className}`}
        >
          <BadgeIcon className="size-3" aria-hidden />
          {t(badgeLabelKeys[game.badge])}
        </span>

        <div
          className={`pointer-events-none absolute inset-0 transition duration-200 ${
            hovering ? "bg-black/30" : "bg-transparent"
          }`}
        />
      </div>
    </Link>
  );
}
