import Link from "next/link";
import { MenuPageForm } from "@/components/admin/menu-page-form";

export default function NewMenuPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/menu" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
          ← Back to menu
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Add menu page</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Create a page that appears as a link at the bottom of the sidebar.
        </p>
      </div>
      <MenuPageForm />
    </div>
  );
}
