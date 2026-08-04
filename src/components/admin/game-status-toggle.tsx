"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setGameStatusAction } from "@/app/actions/admin/games";

type Status = "draft" | "published";

type Props = {
  gameId: number;
  status: Status;
  compact?: boolean;
};

export function GameStatusToggle({
  gameId,
  status: initialStatus,
  compact = false,
}: Props) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setStatus(initialStatus);
  }, [gameId, initialStatus]);

  async function handleChange(next: Status) {
    if (next === status || loading) return;

    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.set("gameId", String(gameId));
    formData.set("status", next);

    const result = await setGameStatusAction(formData);
    setLoading(false);

    if (result?.error) {
      setError(result.error);
      return;
    }

    setStatus((result?.status as Status) ?? next);
    router.refresh();
  }

  const selectClass = compact
    ? "rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-xs font-semibold capitalize text-[var(--color-text)] disabled:opacity-50"
    : "form-input w-auto capitalize";

  return (
    <div className={compact ? "" : "w-full"}>
      <select
        value={status}
        disabled={loading}
        onChange={(e) => void handleChange(e.target.value as Status)}
        className={selectClass}
        aria-label="Game status"
      >
        <option value="published">Published</option>
        <option value="draft">Draft</option>
      </select>
      {loading && (
        <p className={`mt-1 text-[var(--color-muted)] ${compact ? "text-xs" : "text-sm"}`}>
          Saving…
        </p>
      )}
      {error && (
        <p className={`mt-1 text-red-400 ${compact ? "text-xs" : "text-sm"}`}>{error}</p>
      )}
    </div>
  );
}
