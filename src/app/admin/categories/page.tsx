import Link from "next/link";
import { prisma } from "@/lib/db";
import { CategoryIcon } from "@/components/category/category-icon";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: {
      _count: { select: { games: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="mb-2 text-2xl font-bold">Categories</h1>
          <p className="text-sm text-[var(--color-muted)]">
            Add, edit, and organize game categories with icons.
          </p>
        </div>
        <Link href="/admin/categories/new" className="btn-primary">
          Add category
        </Link>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
            <tr>
              <th className="px-4 py-3">Icon</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Sort</th>
              <th className="px-4 py-3">Games</th>
              <th className="px-4 py-3">Public</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-border)]">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-[var(--color-muted)]">
                  No categories yet.{" "}
                  <Link href="/admin/categories/new" className="text-[var(--color-accent)] hover:underline">
                    Create one
                  </Link>
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="bg-[var(--color-bg)]">
                  <td className="px-4 py-3">
                    <CategoryIcon icon={cat.icon} name={cat.name} slug={cat.slug} size="sm" />
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/categories/${cat.id}`} className="font-medium hover:text-[var(--color-accent)]">
                      {cat.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-[var(--color-muted)]">{cat.slug}</td>
                  <td className="px-4 py-3">{cat.sortOrder}</td>
                  <td className="px-4 py-3">{cat._count.games}</td>
                  <td className="px-4 py-3">
                    <a href={`/c/${cat.slug}`} className="text-[var(--color-accent)] hover:underline" target="_blank">
                      View
                    </a>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/categories/${cat.id}`} className="text-xs text-[var(--color-accent)] hover:underline">
                        Edit
                      </Link>
                      <CategoryDeleteButton
                        categoryId={cat.id}
                        categoryName={cat.name}
                        gameCount={cat._count.games}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
