import type { HomeCategory } from "@/lib/categories";
import type { HomePageSectionWithGames } from "@/lib/home-sections";
import type { HomePlacement } from "@/lib/home-placements";
import { CategoryGamesSection } from "@/components/home/category-games-section";
import { CategoriesSection } from "@/components/home/categories-section";

type Props = {
  placement: HomePlacement;
  sections: HomePageSectionWithGames[];
  categories: HomeCategory[];
};

export function HomePlacementSlot({ placement, sections, categories }: Props) {
  const slotSections = sections
    .filter((s) => s.placement === placement)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const slotCategories = categories
    .filter((c) => c.homePlacement === placement)
    .sort((a, b) => a.homeSortOrder - b.homeSortOrder);

  if (slotSections.length === 0 && slotCategories.length === 0) return null;

  return (
    <>
      {slotSections.map((section) => (
        <CategoryGamesSection
          key={section.id}
          title={section.title}
          categorySlug={section.categorySlug}
          layout={section.layout}
          games={section.games}
        />
      ))}
      {slotCategories.length > 0 && <CategoriesSection categories={slotCategories} />}
    </>
  );
}
