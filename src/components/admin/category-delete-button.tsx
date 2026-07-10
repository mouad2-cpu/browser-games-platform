"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteCategoryAction } from "@/app/actions/admin/categories";

export function CategoryDeleteButton({
  categoryId,
  categoryName,
  gameCount,
}: {
  categoryId: number;
  categoryName: string;
  gameCount: number;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    const message =
      gameCount > 0
        ? `Delete "${categoryName}"? ${gameCount} game(s) will be unlinked from this category (games are not deleted).`
        : `Delete "${categoryName}"? This cannot be undone.`;

    if (!confirm(message)) return;

    setLoading(true);
    const formData = new FormData();
    formData.set("categoryId", String(categoryId));
    await deleteCategoryAction(formData);
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="text-xs text-red-400 hover:underline disabled:opacity-50"
    >
      {loading ? "..." : "Delete"}
    </button>
  );
}
