"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteMenuPageAction } from "@/app/actions/admin/menu-pages";

export function MenuPageDeleteButton({
  pageId,
  pageTitle,
}: {
  pageId: number;
  pageTitle: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm(`Delete "${pageTitle}"? This cannot be undone.`)) return;

    setLoading(true);
    const formData = new FormData();
    formData.set("id", String(pageId));
    await deleteMenuPageAction(formData);
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
