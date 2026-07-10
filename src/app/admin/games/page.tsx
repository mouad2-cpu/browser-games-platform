import Link from "next/link";
import { GameStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { deleteGameAction } from "@/app/actions/admin/games";
import { GameThumbnail } from "@/components/admin/game-thumbnail";
import { GameCategoryQuickEdit } from "@/components/admin/game-category-quick-edit";
import { GameFeaturedToggle } from "@/components/admin/game-featured-toggle";

type Props = {
  searchParams: Promise<{ status?: string; category?: string }>;
};

export default async function AdminGamesPage({ searchParams }: Props) {
  const { status, category } = await searchParams;
  const categories = await prisma.category.findMany({ orderBy: { sortOrder: "asc" } });

  const games = await prisma.game.findMany({
    where: {
      ...(status ? { status: status as GameStatus } : {}),
      ...(category ? { categories: { some: { category: { slug: category } } } } : {}),
    },
    orderBy: { updatedAt: "desc" },
    include: {
      categories: { include: { category: { select: { id: true, name: true, slug: true } } } },
      primaryCategory: { select: { id: true, name: true } },
      _count: { select: { playEvents: true } },
    },
  });

  const categoryOptions = categories.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    icon: c.icon,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Games</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Manage games and categories inline — use + Category or × on each row
          </p>
        </div>
        <Link href="/admin/games/new" className="btn-primary text-sm">
          Add Game
        </Link>
      </div>

      <form method="GET" className="mb-4 flex flex-wrap gap-2">
        <select name="status" defaultValue={status ?? ""} className="form-input w-auto">
          <option value="">All statuses</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
        </select>
        <select name="category" defaultValue={category ?? ""} className="form-input w-auto">
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-primary text-sm">
          Filter
        </button>
      </form>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
            <tr>
              <th className="w-36 px-4 py-3">Photo</th>
              <th className="px-4 py-3">Title</th>
              <th className="min-w-[220px] px-4 py-3">Categories</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Featured</th>
              <th className="px-4 py-3">Plays</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {games.map((game) => (
              <tr key={game.id} className="bg-[var(--color-bg)]">
                <td className="px-4 py-3">
                  <Link href={`/admin/games/${game.id}`} className="block">
                    <GameThumbnail src={game.thumbnail} title={game.title} size="md" />
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/games/${game.id}`}
                    className="font-medium hover:text-[var(--color-accent)]"
                  >
                    {game.title}
                  </Link>
                  <p className="text-xs text-[var(--color-muted)]">{game.slug}</p>
                </td>
                <td className="px-4 py-3">
                  <GameCategoryQuickEdit
                    gameId={game.id}
                    categories={categoryOptions}
                    categoryIds={game.categories.map((c) => c.categoryId)}
                    primaryCategoryId={game.primaryCategoryId}
                  />
                </td>
                <td className="px-4 py-3 capitalize">{game.status}</td>
                <td className="px-4 py-3">
                  <GameFeaturedToggle gameId={game.id} featured={game.featured} compact />
                </td>
                <td className="px-4 py-3">{game._count.playEvents}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-3">
                    <Link href={`/admin/games/${game.id}`} className="text-[var(--color-accent)] hover:underline">
                      Edit
                    </Link>
                    {game.status === "published" && (
                      <Link
                        href={`/game/${game.slug}`}
                        className="text-[var(--color-muted)] hover:underline"
                        target="_blank"
                      >
                        View
                      </Link>
                    )}
                    <form action={deleteGameAction}>
                      <input type="hidden" name="gameId" value={game.id} />
                      <button type="submit" className="text-red-400 hover:underline">
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
