import Link from "next/link";
import { notFound } from "next/navigation";
import { getMenuPageById } from "@/lib/menu-pages";
import { MenuPageForm } from "@/components/admin/menu-page-form";
import { MenuPageDeleteButton } from "@/components/admin/menu-page-delete-button";

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const pageId = parseInt(id, 10);
  if (!pageId) notFound();

  const page = await getMenuPageById(pageId);
  if (!page) notFound();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/admin/menu" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
            ← Back to menu
          </Link>
          <h1 className="mt-2 text-2xl font-bold">Edit menu page</h1>
          <p className="text-sm text-[var(--color-muted)]">{page.title}</p>
        </div>
        <MenuPageDeleteButton pageId={page.id} pageTitle={page.title} />
      </div>
      <MenuPageForm page={page} />
    </div>
  );
}
