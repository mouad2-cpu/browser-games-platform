"use client";

import { useState } from "react";

export function SeedPopularButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  async function run() {
    setLoading(true);
    setResult("");
    try {
      const res = await fetch("/api/admin/seed-popular-drafts", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setResult(data.error ?? "Failed");
        return;
      }
      setResult(JSON.stringify(data, null, 2));
    } catch (e) {
      setResult(e instanceof Error ? e.message : "Failed");
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
        className="rounded-lg bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {loading ? "Seeding…" : "Add games as draft"}
      </button>
      {result ? (
        <pre className="overflow-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] p-3 text-xs">
          {result}
        </pre>
      ) : null}
    </div>
  );
}
