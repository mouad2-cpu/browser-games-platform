"use client";

import Image from "next/image";
import Link from "next/link";
import type { GameCard } from "@/lib/games";
import { getGameImageAlt } from "@/lib/game-image-alt";

type Props = {
  games: GameCard[];
};

export function PlayNextMobileStrip({ games }: Props) {
  if (games.length === 0) return null;

  return (
    <section className="lg:hidden">
      <h2 className="mb-3 text-sm font-semibold text-[var(--color-text)]">Play next</h2>
      <div className="hide-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
        {games.slice(0, 12).map((game) => (
          <Link
            key={game.id}
            href={`/game/${game.slug}`}
            className="group w-[120px] shrink-0"
            title={game.title}
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-[var(--color-surface)]">
              {game.thumbnail ? (
                <Image
                  src={game.thumbnail}
                  alt={getGameImageAlt(game.title)}
                  fill
                  className="object-cover transition group-hover:scale-105"
                  sizes="120px"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-xs text-[var(--color-muted)]">
                  ?
                </div>
              )}
            </div>
            <p className="mt-1.5 line-clamp-2 text-xs font-medium text-[var(--color-text)] group-hover:text-[var(--color-accent)]">
              {game.title}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
