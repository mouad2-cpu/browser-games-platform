import { getSession } from "@/lib/auth";
import { getAllCategories } from "@/lib/categories";
import { getMenuPagesForNav } from "@/lib/menu-pages";
import { PublicShell } from "@/components/layout/public-shell";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, categories, menuPages] = await Promise.all([
    getSession(),
    getAllCategories(),
    getMenuPagesForNav(),
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <PublicShell
        session={session}
        categories={categories.map((c) => ({
          slug: c.slug,
          name: c.name,
          icon: c.icon,
        }))}
        menuPages={menuPages.map((p) => ({
          slug: p.slug,
          title: p.title,
          icon: p.icon,
        }))}
      >
        {children}
      </PublicShell>
    </div>
  );
}
