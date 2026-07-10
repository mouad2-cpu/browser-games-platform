/** Fixed homepage blocks (always shown when they have content) */
export const HOME_FIXED_BLOCKS = [
  { id: "continue", label: "Continue playing" },
  { id: "top_picks", label: "Top picks" },
  { id: "featured", label: "Featured games" },
  { id: "latest", label: "Latest games" },
] as const;

export const HOME_PLACEMENTS = [
  { value: "first", label: "First on page (very top)" },
  {
    value: "between_continue_top_picks",
    label: "Between Continue playing → Top picks",
  },
  {
    value: "between_top_picks_featured",
    label: "Between Top picks → Featured games",
  },
  {
    value: "between_featured_latest",
    label: "Between Featured games → Latest games",
  },
  { value: "last", label: "Last on page (very bottom)" },
] as const;

export type HomePlacement = (typeof HOME_PLACEMENTS)[number]["value"];

export const DEFAULT_GAME_SECTION_PLACEMENT: HomePlacement = "between_top_picks_featured";
export const DEFAULT_CATEGORY_TILE_PLACEMENT: HomePlacement = "between_featured_latest";

const LEGACY_PLACEMENT_MAP: Record<string, HomePlacement> = {
  first: "first",
  last: "last",
  between_continue_top_picks: "between_continue_top_picks",
  between_top_picks_featured: "between_top_picks_featured",
  between_featured_latest: "between_featured_latest",
  after_continue: "between_continue_top_picks",
  after_top_picks: "between_top_picks_featured",
  after_featured: "between_featured_latest",
  before_latest: "between_featured_latest",
};

export function normalizeHomePlacement(value: string | null | undefined): HomePlacement {
  if (value && value in LEGACY_PLACEMENT_MAP) {
    return LEGACY_PLACEMENT_MAP[value];
  }
  return DEFAULT_GAME_SECTION_PLACEMENT;
}

export function normalizeCategoryTilePlacement(value: string | null | undefined): HomePlacement {
  if (value && value in LEGACY_PLACEMENT_MAP) {
    return LEGACY_PLACEMENT_MAP[value];
  }
  return DEFAULT_CATEGORY_TILE_PLACEMENT;
}

export function getPlacementLabel(value: string): string {
  const normalized = normalizeHomePlacement(value);
  return HOME_PLACEMENTS.find((p) => p.value === normalized)?.label ?? normalized;
}
