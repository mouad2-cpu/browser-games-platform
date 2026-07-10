import Link from "next/link";
import { CategoryForm } from "@/components/admin/category-form";

export default function NewCategoryPage() {
  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/categories" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
          ← Back to categories
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Add category</h1>
        <p className="text-sm text-[var(--color-muted)]">Create a new browseable category with an icon.</p>
      </div>
      <CategoryForm />
    </div>
  );
}
