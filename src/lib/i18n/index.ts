import type { LocaleCode } from "@/lib/locale";
import { en } from "./messages/en";
import { es } from "./messages/es";
import { fr } from "./messages/fr";
import { nl } from "./messages/nl";
import type { Messages } from "./types";

export const MESSAGES: Record<LocaleCode, Messages> = {
  en,
  es,
  fr,
  nl,
};

type InterpolationVars = Record<string, string | number>;

function getNestedValue(messages: Messages, path: string): string | undefined {
  const value = path.split(".").reduce<unknown>((current, key) => {
    if (current && typeof current === "object" && key in current) {
      return (current as Record<string, unknown>)[key];
    }
    return undefined;
  }, messages);

  return typeof value === "string" ? value : undefined;
}

export function translate(
  locale: LocaleCode,
  key: string,
  vars?: InterpolationVars
): string {
  const template = getNestedValue(MESSAGES[locale], key) ?? getNestedValue(MESSAGES.en, key) ?? key;

  if (!vars) return template;

  return Object.entries(vars).reduce(
    (result, [name, value]) => result.replaceAll(`{${name}}`, String(value)),
    template
  );
}

export function gameCountLabel(locale: LocaleCode, count: number): string {
  const unit = count === 1 ? MESSAGES[locale].common.game : MESSAGES[locale].common.games;
  return translate(locale, count === 1 ? "common.game" : "common.games");
}

export function formatGameCount(locale: LocaleCode, count: number): string {
  return `${count} ${gameCountLabel(locale, count)}`;
}
