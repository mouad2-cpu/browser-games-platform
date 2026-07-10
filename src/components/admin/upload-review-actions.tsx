"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UploadReviewActions({ uploadId }: { uploadId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleAction(action: "approve" | "reject") {
    setLoading(true);
    let rejectReason: string | undefined;
    if (action === "reject") {
      rejectReason = prompt("Rejection reason:") ?? "Does not meet guidelines";
    }
    await fetch("/api/admin/uploads", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uploadId, action, rejectReason }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={() => handleAction("approve")}
        disabled={loading}
        className="btn-primary text-sm"
      >
        Approve
      </button>
      <button
        type="button"
        onClick={() => handleAction("reject")}
        disabled={loading}
        className="rounded-lg border border-red-500/50 px-3 py-1.5 text-sm text-red-400 hover:bg-red-500/10"
      >
        Reject
      </button>
    </div>
  );
}
