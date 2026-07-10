export function getCategoryPageDescription(name: string, custom?: string | null): string {
  if (custom?.trim()) return custom.trim();

  const lower = name.toLowerCase();
  return `${name} games let you play free ${lower} browser games online in your web browser. Browse our selection of thrilling ${lower} titles, including arcade hits, adventures, and fan favorites—no download or install required.`;
}

export function getCategoryPageTitle(name: string): string {
  const trimmed = name.trim();
  if (/games$/i.test(trimmed)) return trimmed;
  return `${trimmed} Games`;
}
