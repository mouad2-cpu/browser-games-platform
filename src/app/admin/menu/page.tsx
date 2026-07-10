import Link from "next/link";
import { getSession } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { prisma } from "@/lib/db";
import { getAllMenuPagesAdmin } from "@/lib/menu-pages";
import { getMenuPageHref } from "@/lib/menu-page-routes";
import { CategoryIcon } from "@/components/category/category-icon";
import { CategoryDeleteButton } from "@/components/admin/category-delete-button";
import { MenuPageDeleteButton } from "@/components/admin/menu-page-delete-button";
import { getMenuPageIcon } from "@/lib/menu-page-icons";

export default async function AdminMenuPage() {
  const session = await getSession();
  const canCategories = session && hasPermission(session.role, PERMISSIONS.CATEGORIES_MANAGE);
  const canPages = session && hasPermission(session.role, PERMISSIONS.MENU_MANAGE);

  const [categories, menuPages] = await Promise.all([
    canCategories
      ? prisma.category.findMany({
          orderBy: { sortOrder: "asc" },
          include: { _count: { select: { games: true } } },
        })
      : Promise.resolve([]),
    canPages ? getAllMenuPagesAdmin() : Promise.resolve([]),
  ]);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="mb-2 text-2xl font-bold">Menu</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Manage what appears in the sidebar: game categories and footer links (Contact, Terms, etc.).{" "}
          <Link href="/admin/homepage" className="text-[var(--color-accent)] hover:underline">
            Homepage categories →
          </Link>
        </p>
      </div>

      {canCategories && (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Categories</h2>
              <p className="text-sm text-[var(--color-muted)]">
                Shown in the middle section of the sidebar menu.
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
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted)]">
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
                        <Link
                          href={`/admin/categories/${cat.id}`}
                          className="font-medium hover:text-[var(--color-accent)]"
                        >
                          {cat.name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-[var(--color-muted)]">{cat.slug}</td>
                      <td className="px-4 py-3">{cat.sortOrder}</td>
                      <td className="px-4 py-3">{cat._count.games}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/categories/${cat.id}`}
                            className="text-xs text-[var(--color-accent)] hover:underline"
                          >
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
        </section>
      )}

      {canPages && (
        <section>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold">Menu pages</h2>
              <p className="text-sm text-[var(--color-muted)]">
                Footer links in the sidebar (Contact, Terms, Privacy, etc.).
              </p>
            </div>
            <Link href="/admin/menu/pages/new" className="btn-primary">
              Add page
            </Link>
          </div>

          <div className="overflow-x-auto rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-left text-sm">
              <thead className="bg-[var(--color-surface)] text-[var(--color-muted)]">
                <tr>
                  <th className="px-4 py-3">Icon</th>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Slug</th>
                  <th className="px-4 py-3">Sort</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {menuPages.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center text-[var(--color-muted)]">
                      No menu pages yet.{" "}
                      <Link href="/admin/menu/pages/new" className="text-[var(--color-accent)] hover:underline">
                        Create one
                      </Link>
                    </td>
                  </tr>
                ) : (
                  menuPages.map((item) => {
                    const Icon = getMenuPageIcon(item.icon);
                    return (
                      <tr key={item.id} className="bg-[var(--color-bg)]">
                        <td className="px-4 py-3">
                          <Icon className="size-5 text-[var(--color-nav-icon)]" strokeWidth={2} />
                        </td>
                        <td className="px-4 py-3">
                          <Link
                            href={`/admin/menu/pages/${item.id}`}
                            className="font-medium hover:text-[var(--color-accent)]"
                          >
                            {item.title}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-[var(--color-muted)]">{item.slug}</td>
                        <td className="px-4 py-3">{item.sortOrder}</td>
                        <td className="px-4 py-3">
                          {item.published ? (
                            <span className="text-green-400">Published</span>
                          ) : (
                            <span className="text-[var(--color-muted)]">Draft</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Link
                              href={`/admin/menu/pages/${item.id}`}
                              className="text-xs text-[var(--color-accent)] hover:underline"
                            >
                              Edit
                            </Link>
                            {item.published && (
                              <a
                                href={getMenuPageHref(item.slug)}
                                className="text-xs text-[var(--color-accent)] hover:underline"
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                View
                              </a>
                            )}
                            <MenuPageDeleteButton pageId={item.id} pageTitle={item.title} />
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
