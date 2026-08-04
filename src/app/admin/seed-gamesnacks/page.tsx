import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/rbac";
import { SeedGamesnacksButton } from "./seed-gamesnacks-button";

export default async function SeedGamesnacksPage() {
  const session = await getSession();
  if (!session || !hasPermission(session.role, PERMISSIONS.GAMES_EDIT)) {
    redirect("/admin");
  }

  return (
    <div className="mx-auto max-w-xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">Seed GameSnacks games (draft)</h1>
      <p className="text-sm text-[var(--color-muted)]">
        Adds ~52 GameSnacks games as <strong>draft</strong> with SEO titles,
        meta descriptions, long descriptions, categories, real iframe embeds, and
        local covers. Nothing is published until you publish in Admin → Games.
      </p>
      <SeedGamesnacksButton />
    </div>
  );
}
