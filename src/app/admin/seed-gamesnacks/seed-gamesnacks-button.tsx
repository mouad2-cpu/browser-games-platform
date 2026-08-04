"use client";

import { useState } from "react";

export function SeedGamesnacksButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function run() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/seed-gamesnacks-drafts", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as {
        error?: string;
        created?: number;
        updated?: number;
        total?: number;
      };
      if (!res.ok) {
        setMessage(data.error ?? "Seed failed");
        return;
      }
      setMessage(
        `Done — created ${data.created ?? 0}, updated ${data.updated ?? 0} (total ${data.total ?? 0}). Still draft.`
      );
    } catch {
      setMessage("Seed failed — network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={run}
        disabled={loading}
        className="rounded-xl bg-[var(--color-accent)] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? "Seeding…" : "Add games as draft"}
      </button>
      {message ? <p className="text-sm text-[var(--color-muted)]">{message}</p> : null}
    </div>
  );
}
