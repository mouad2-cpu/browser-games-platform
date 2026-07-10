"use client";

import { useRouter } from "next/navigation";

export function ModerationActions({ flagId }: { flagId: string }) {
  const router = useRouter();

  async function resolve(status: "APPROVED" | "REJECTED") {
    await fetch("/api/admin/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ flagId, status }),
    });
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button type="button" onClick={() => resolve("APPROVED")} className="btn-primary text-sm">
        Approve
      </button>
      <button
        type="button"
        onClick={() => resolve("REJECTED")}
        className="rounded-lg border border-red-500/50 px-3 py-1.5 text-sm text-red-400"
      >
        Reject
      </button>
    </div>
  );
}
