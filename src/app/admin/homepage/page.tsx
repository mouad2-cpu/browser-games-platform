import Link from "next/link";
import { getCategoriesForHomeAdmin } from "@/lib/categories";
import { getHomePageSectionsAdmin, getCategoriesWithoutHomeSection } from "@/lib/home-sections";
import { homePageSectionDelegate, PRISMA_REGEN_HINT } from "@/lib/prisma-delegates";
import { HomeCategoriesManager } from "@/components/admin/home-categories-manager";
import { HomePageSectionsManager } from "@/components/admin/home-page-sections-manager";

export default async function AdminHomepagePage() {
  const sectionsReady = homePageSectionDelegate() !== null;

  const [categories, sections, availableCategories] = await Promise.all([
    getCategoriesForHomeAdmin(),
    getHomePageSectionsAdmin(),
    getCategoriesWithoutHomeSection(),
  ]);

  return (
    <div className="space-y-12">
      <div>
        <Link href="/admin/menu" className="text-sm text-[var(--color-muted)] hover:text-[var(--color-accent)]">
          ← Back to menu
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Homepage</h1>
        <p className="text-sm text-[var(--color-muted)]">
          Add category game rows (like Continue playing / Top picks) and category tiles on the home page.
          Use <strong className="font-medium text-white">Where on homepage</strong> to pick first, last, or between two sections.
        </p>
      </div>

      {!sectionsReady && (
        <p className="rounded-lg bg-amber-500/10 px-4 py-3 text-sm text-amber-300">
          {PRISMA_REGEN_HINT}
        </p>
      )}

      <section>
        <h2 className="mb-4 text-lg font-semibold">Game sections</h2>
        <HomePageSectionsManager
          sections={sections}
          availableCategories={availableCategories}
          disabled={!sectionsReady}
        />
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Category tiles</h2>
        <HomeCategoriesManager categories={categories} />
      </section>
    </div>
  );
}
