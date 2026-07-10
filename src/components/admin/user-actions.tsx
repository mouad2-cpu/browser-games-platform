"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function UserActions({
  userId,
  isBanned,
}: {
  userId: string;
  isBanned: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function toggleBan() {
    setLoading(true);
    const reason = isBanned ? undefined : prompt("Ban reason (optional)") ?? undefined;
    await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, isBanned: !isBanned, bannedReason: reason }),
    });
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={toggleBan}
      disabled={loading}
      className={`text-xs hover:underline ${isBanned ? "text-green-400" : "text-red-400"}`}
    >
      {loading ? "..." : isBanned ? "Unban" : "Ban"}
    </button>
  );
}
