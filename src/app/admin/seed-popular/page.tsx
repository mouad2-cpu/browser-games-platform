import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { SeedPopularButton } from "./seed-popular-button";

export default async function SeedPopularPage() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, PERMISSIONS.GAMES_EDIT)) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Seed popular games (draft)</h1>
      <p className="text-sm text-[var(--color-muted)]">
        Adds Slope Run, Crazy Tunnel, Geometry Dash, Helix Jump, Stickman Hook, Rail Runner,
        Moto X3M, Drift Boss, Basketball Stars 2026, Football Legends, Fireboy and Watergirl, and
        2048 as <strong>draft</strong> only — not published. Includes SEO meta titles,
        meta descriptions, long descriptions, embeds, and cover thumbnails.
      </p>
      <SeedPopularButton />
    </div>
  );
}
