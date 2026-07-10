import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategoryWithGames } from "@/lib/categories";
import { CategoryIcon } from "@/components/category/category-icon";
import { CategoryForm } from "@/components/admin/category-form";
import { CategoryGamesList } from "@/components/admin/category-games-list";
import { CategoryAddGame } from "@/components/admin/category-add-game";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function CategoryDetailPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (!id) notFound();

  const category = await getCategoryWithGames(id);
  if (!category) notFound();

  const games = category.games.map((g) => g.game);
  const memberIds = new Set(games.map((g) => g.id));

  const availableGames = await prisma.game.findMany({
    where: { id: { notIn: [...memberIds] } },
    orderBy: { title: "asc" },
    select: { id: true, title: true, slug: true, thumbnail: true, status: true },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/categories" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
            ← Back to categories
          </Link>
          <div className="mt-2 flex items-center gap-3">
            <CategoryIcon icon={category.icon} name={category.name} slug={category.slug} size="lg" />
            <div>
              <h1 className="text-2xl font-bold">{category.name}</h1>
              <p className="text-sm text-[var(--color-muted)]">
                /c/{category.slug} · {category._count.games} game{category._count.games !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href={`/c/${category.slug}`} target="_blank" className="btn-secondary text-sm">
            View public page
          </a>
          <CategoryDeleteButton
            categoryId={category.id}
            categoryName={category.name}
            gameCount={category._count.games}
          />
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <section>
          <h2 className="mb-4 text-lg font-semibold">Edit category</h2>
          <CategoryForm
            category={{
              id: category.id,
              name: category.name,
              slug: category.slug,
              icon: category.icon,
              sortOrder: category.sortOrder,
              description: category.description,
            }}
          />
        </section>

        <section>
          <h2 className="mb-4 text-lg font-semibold">Games in this category</h2>
          <CategoryAddGame categoryId={category.id} availableGames={availableGames} />
          <p className="mb-4 text-sm text-[var(--color-muted)]">
            Remove a game with the button below (5s undo). The game itself is not deleted.
          </p>
          <CategoryGamesList categoryId={category.id} games={games} />
        </section>
      </div>
    </div>
  );
}
