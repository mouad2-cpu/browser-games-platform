import { descriptionToMetaDescription } from "@/lib/meta-description";

export function getCategoryPageDescription(name: string, custom?: string | null): string {
  if (custom?.trim()) return custom.trim();

  const lower = name.toLowerCase();
  return `Play free ${lower} games online in your browser. Browse ${name} titles on ZenFun Games — no download or install required.`;
}

/** Meta-safe category description (≤160 chars). */
export function getCategoryMetaDescription(name: string, custom?: string | null): string {
  return descriptionToMetaDescription(getCategoryPageDescription(name, custom));
}

export function getCategoryPageTitle(name: string): string {
  const trimmed = name.trim();
  if (/games$/i.test(trimmed)) return trimmed;
  return `${trimmed} Games`;
}
