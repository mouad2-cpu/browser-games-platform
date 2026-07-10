import { prisma } from "@/lib/db";

export async function linkGameToCategory(gameId: number, categoryId: number) {
  const [game, category] = await Promise.all([
    prisma.game.findUnique({
      where: { id: gameId },
      select: { id: true, slug: true, primaryCategoryId: true },
    }),
    prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } }),
  ]);

  if (!game) return { error: "Game not found." } as const;
  if (!category) return { error: "Category not found." } as const;

  const existing = await prisma.gameCategory.findUnique({
    where: { gameId_categoryId: { gameId, categoryId } },
  });
  if (existing) return { ok: true as const, slug: game.slug };

  await prisma.$transaction([
    prisma.gameCategory.create({ data: { gameId, categoryId } }),
    ...(game.primaryCategoryId
      ? []
      : [prisma.game.update({ where: { id: gameId }, data: { primaryCategoryId: categoryId } })]),
  ]);

  return { ok: true as const, slug: game.slug };
}

export async function unlinkGameFromCategory(gameId: number, categoryId: number) {
  const link = await prisma.gameCategory.findUnique({
    where: { gameId_categoryId: { gameId, categoryId } },
    include: {
      game: {
        select: {
          slug: true,
          primaryCategoryId: true,
          categories: { select: { categoryId: true } },
        },
      },
    },
  });

  if (!link) return { error: "Game is not in this category." } as const;
  if (link.game.categories.length <= 1) {
    return { error: "A game must belong to at least one category." } as const;
  }

  const remaining = link.game.categories
    .map((c) => c.categoryId)
    .filter((id) => id !== categoryId);
  const nextPrimary =
    link.game.primaryCategoryId === categoryId ? remaining[0] ?? null : link.game.primaryCategoryId;

  await prisma.$transaction([
    prisma.gameCategory.delete({ where: { gameId_categoryId: { gameId, categoryId } } }),
    prisma.game.update({
      where: { id: gameId },
      data: { primaryCategoryId: nextPrimary },
    }),
  ]);

  return { ok: true as const, slug: link.game.slug };
}
