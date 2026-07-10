"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { removeGameFromCategoryAction } from "@/app/actions/admin/categories";
import { getGameImageAlt } from "@/lib/game-image-alt";

const UNDO_SECONDS = 5;

type GameRow = {
  id: number;
  slug: string;
  title: string;
  thumbnail: string | null;
  status: string;
  featured: boolean;
};

type PendingRemoval = {
  gameId: number;
  title: string;
  secondsLeft: number;
};

export function CategoryGamesList({
  categoryId,
  games,
}: {
  categoryId: number;
  games: GameRow[];
}) {
  const router = useRouter();
  const [pending, setPending] = useState<PendingRemoval | null>(null);
  const [removing, setRemoving] = useState(false);
  const [error, setError] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const executeRemove = useCallback(
    async (gameId: number) => {
      clearTimer();
      setRemoving(true);
      setError("");

      const formData = new FormData();
      formData.set("categoryId", String(categoryId));
      formData.set("gameId", String(gameId));

      const result = await removeGameFromCategoryAction(formData);
      if (result?.error) {
        setError(result.error);
        setPending(null);
        setRemoving(false);
        return;
      }

      setPending(null);
      setRemoving(false);
      router.refresh();
    },
    [categoryId, clearTimer, router]
  );

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    if (!pending) return;

    clearTimer();

    timerRef.current = setInterval(() => {
      setPending((current) => {
        if (!current) return null;
        if (current.secondsLeft <= 1) {
          clearTimer();
          void executeRemove(current.gameId);
          return { ...current, secondsLeft: 0 };
        }
        return { ...current, secondsLeft: current.secondsLeft - 1 };
      });
    }, 1000);

    return () => clearTimer();
  }, [pending?.gameId, clearTimer, executeRemove]);

  function startRemove(gameId: number, title: string) {
    if (pending?.gameId === gameId) return;
    clearTimer();
    setError("");
    setPending({ gameId, title, secondsLeft: UNDO_SECONDS });
  }

  function undoRemove() {
    clearTimer();
    setPending(null);
  }

  if (games.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--color-border)] px-4 py-8 text-center text-sm text-[var(--color-muted)]">
        No games in this category yet. Assign games from the game editor.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {error && <p className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">{error}</p>}

      {pending && (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm">
          <span>
            Removing <strong>{pending.title}</strong> in{" "}
            <strong>{pending.secondsLeft}s</strong>…
          </span>
          <button
            type="button"
            onClick={undoRemove}
            disabled={removing}
            className="rounded-lg bg-[var(--color-surface)] px-3 py-1.5 font-medium hover:bg-[var(--color-surface-hover)] disabled:opacity-50"
          >
            Undo
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Game</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {games.map((game) => {
              const isPending = pending?.gameId === game.id;
              return (
                <tr
                  key={game.id}
                  className={`bg-[var(--color-bg)] transition ${isPending ? "opacity-50" : ""}`}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {game.thumbnail ? (
                        <img src={game.thumbnail} alt={getGameImageAlt(game.title)} className="h-10 w-16 rounded object-cover" />
                      ) : (
                        <div className="flex h-10 w-16 items-center justify-center rounded bg-[var(--color-surface)] text-xs text-[var(--color-muted)]">
                          —
                        </div>
                      )}
                      <div>
                        <Link href={`/admin/games/${game.id}`} className="font-medium hover:text-[var(--color-accent)]">
                          {game.title}
                        </Link>
                        <p className="text-xs text-[var(--color-muted)]">{game.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{game.status}</td>
                  <td className="px-4 py-3">{game.featured ? "Yes" : "No"}</td>
                  <td className="px-4 py-3">
                    {isPending ? (
                      <span className="text-xs text-amber-400">Pending removal…</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => startRemove(game.id, game.title)}
                        disabled={!!pending || removing}
                        className="text-xs text-red-400 hover:underline disabled:opacity-50"
                      >
                        Remove from category
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
