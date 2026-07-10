export const LOCALES = {
  en: { code: "en", short: "EN", label: "English" },
  es: { code: "es", short: "ES", label: "Español" },
  fr: { code: "fr", short: "FR", label: "Français" },
  nl: { code: "nl", short: "NL", label: "Nederlands" },
} as const;

export type LocaleCode = keyof typeof LOCALES;

export const LOCALE_STORAGE_KEY = "zenfun-locale";
export const LOCALE_COOKIE = "zenfun-locale";

export const LOCALE_CODES = Object.keys(LOCALES) as LocaleCode[];

export function isLocaleCode(value: string): value is LocaleCode {
  return value in LOCALES;
}

export function persistLocale(locale: LocaleCode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  document.cookie = `${LOCALE_COOKIE}=${locale}; path=/; max-age=31536000; SameSite=Lax`;
  document.documentElement.lang = locale;
}

export function readClientLocale(): LocaleCode {
  if (typeof window === "undefined") return "en";

  const fromStorage = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (fromStorage && isLocaleCode(fromStorage)) return fromStorage;

  const cookieMatch = document.cookie.match(new RegExp(`(?:^|; )${LOCALE_COOKIE}=([^;]+)`));
  if (cookieMatch?.[1] && isLocaleCode(cookieMatch[1])) return cookieMatch[1];

  return "en";
}
