import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { GameForm } from "@/components/admin/game-form";
import { GameThumbnail } from "@/components/admin/game-thumbnail";
import { GameCategoryEditor } from "@/components/admin/game-category-editor";
import { GameFeaturedToggle } from "@/components/admin/game-featured-toggle";

type Props = { params: Promise<{ id: string }> };

export default async function GameDetailAdminPage({ params }: Props) {
  const { id: idParam } = await params;
  const id = parseInt(idParam, 10);
  if (!id) notFound();

  const [game, categories, playCount, openReports] = await Promise.all([
    prisma.game.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        primaryCategory: true,
      },
    }),
    prisma.category.findMany({ orderBy: { sortOrder: "asc" } }),
    prisma.playEvent.count({ where: { gameId: id } }),
    prisma.gameReport.findMany({
      where: { gameId: id, status: "OPEN" },
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  if (!game) notFound();

  const categoryIds = game.categories.map((c) => c.categoryId);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-4">
        <Link href="/admin/games" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-text)]">
          ← Games
        </Link>
        <h1 className="text-2xl font-bold">{game.title}</h1>
        {game.status === "published" && (
          <Link
            href={`/game/${game.slug}`}
            target="_blank"
            className="text-sm text-[var(--color-accent)] hover:underline"
          >
            View on site →
          </Link>
        )}
      </div>

      <div className="mb-8 grid gap-6 lg:grid-cols-[minmax(200px,280px)_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-2">
            <GameThumbnail src={game.thumbnail} title={game.title} size="lg" className="max-w-none rounded-lg" />
          </div>

          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-[var(--color-muted)]">
              Featured
            </p>
            <GameFeaturedToggle gameId={game.id} featured={game.featured} />
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-1">
            <MiniStat label="Play events" value={playCount} />
            <MiniStat label="Open reports" value={openReports.length} />
            <MiniStat label="Status" value={game.status} />
            <MiniStat
              label="Released"
              value={game.releasedAt ? game.releasedAt.toLocaleDateString() : "—"}
            />
          </div>
        </div>

        <GameCategoryEditor
          gameId={game.id}
          categories={categories.map((c) => ({
            id: c.id,
            name: c.name,
            slug: c.slug,
            icon: c.icon,
          }))}
          categoryIds={categoryIds}
          primaryCategoryId={game.primaryCategoryId}
        />
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Manage game</h2>
        <GameForm
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, icon: c.icon }))}
          game={{
            id: game.id,
            title: game.title,
            slug: game.slug,
            description: game.description ?? "",
            metaTitle: game.metaTitle ?? "",
            metaDescription: game.metaDescription ?? "",
            thumbnail: game.thumbnail ?? "",
            previewVideo: game.previewVideo ?? "",
            embedPath: game.embedPath ?? "",
            featured: game.featured,
            status: game.status,
            primaryCategoryId: game.primaryCategoryId,
            categoryIds,
          }}
        />
      </section>

      {openReports.length > 0 && (
        <section className="mt-8">
          <h2 className="mb-3 text-lg font-semibold">Abuse Reports</h2>
          <ul className="space-y-2">
            {openReports.map((r) => (
              <li key={r.id} className="rounded-lg bg-[var(--color-surface)] p-3 text-sm">
                <span className="text-[var(--color-muted)]">{r.issueType}</span>
                <p className="mt-1">{r.message}</p>
                <Link href={`/admin/reports/${r.id}`} className="mt-1 inline-block text-[var(--color-accent)]">
                  View report →
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl bg-[var(--color-surface)] p-3">
      <p className="text-xs text-[var(--color-muted)]">{label}</p>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}
