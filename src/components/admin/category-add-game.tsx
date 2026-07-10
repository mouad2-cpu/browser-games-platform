"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addGameToCategoryAction } from "@/app/actions/admin/games";
import { GameThumbnail } from "@/components/admin/game-thumbnail";

type GameOption = {
  id: number;
  title: string;
  slug: string;
  thumbnail: string | null;
  status: string;
};

export function CategoryAddGame({
  categoryId,
  availableGames,
}: {
  categoryId: number;
  availableGames: GameOption[];
}) {
  const router = useRouter();
  const [gameId, setGameId] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const filtered = availableGames.filter((g) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return g.title.toLowerCase().includes(q) || g.slug.toLowerCase().includes(q);
  });

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const id = parseInt(gameId, 10);
    if (!id) {
      setError("Pick a game to add.");
      return;
    }

    setAdding(true);
    setError("");

    const formData = new FormData();
    formData.set("gameId", String(id));
    formData.set("categoryId", String(categoryId));

    const result = await addGameToCategoryAction(formData);
    setAdding(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setGameId("");
    setSearch("");
    router.refresh();
  }

  if (availableGames.length === 0) {
    return (
      <p className="mb-4 rounded-lg bg-[var(--color-surface)] px-3 py-2 text-sm text-[var(--color-muted)]">
        Every game is already in this category.
      </p>
    );
  }

  return (
    <form onSubmit={handleAdd} className="mb-4 space-y-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
      <div>
        <h3 className="text-sm font-semibold">Add game to category</h3>
        <p className="text-xs text-[var(--color-muted)]">Search and pick a game — no need to open the game editor.</p>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by title or slug…"
        className="form-input"
      />

      <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-1">
        {filtered.length === 0 ? (
          <p className="px-2 py-3 text-center text-xs text-[var(--color-muted)]">No matching games</p>
        ) : (
          filtered.map((game) => (
            <label
              key={game.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 text-sm transition hover:bg-[var(--color-surface)] ${
                gameId === String(game.id) ? "bg-[var(--color-accent)]/10 ring-1 ring-[var(--color-accent)]" : ""
              }`}
            >
              <input
                type="radio"
                name="addGameId"
                value={game.id}
                checked={gameId === String(game.id)}
                onChange={() => setGameId(String(game.id))}
                className="sr-only"
              />
              <GameThumbnail src={game.thumbnail} title={game.title} size="sm" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{game.title}</span>
                <span className="text-xs capitalize text-[var(--color-muted)]">{game.status}</span>
              </span>
            </label>
          ))
        )}
      </div>

      {error && <p className="text-sm text-red-400">{error}</p>}

      <button type="submit" disabled={adding || !gameId} className="btn-primary text-sm disabled:opacity-50">
        {adding ? "Adding…" : "Add to category"}
      </button>
    </form>
  );
}
