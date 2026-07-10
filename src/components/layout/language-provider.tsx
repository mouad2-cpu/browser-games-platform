"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { MESSAGES, translate } from "@/lib/i18n";
import type { Messages } from "@/lib/i18n/types";
import {
  LOCALES,
  persistLocale,
  readClientLocale,
  type LocaleCode,
} from "@/lib/locale";

type LanguageContextValue = {
  locale: LocaleCode;
  setLocale: (locale: LocaleCode) => void;
  messages: Messages;
  t: (key: string, vars?: Record<string, string | number>) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type ProviderProps = {
  children: ReactNode;
  initialLocale?: LocaleCode;
};

export function LanguageProvider({ children, initialLocale = "en" }: ProviderProps) {
  const [locale, setLocaleState] = useState<LocaleCode>(initialLocale);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = readClientLocale();
    if (stored !== initialLocale) {
      setLocaleState(stored);
    }
    document.documentElement.lang = stored;
    setReady(true);
  }, [initialLocale]);

  const setLocale = useCallback((next: LocaleCode) => {
    setLocaleState(next);
    persistLocale(next);
  }, []);

  const value = useMemo(() => {
    const messages = MESSAGES[locale];
    return {
      locale,
      setLocale,
      messages,
      t: (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    };
  }, [locale, setLocale]);

  if (!ready) {
    return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export function useLocaleMeta(locale: LocaleCode) {
  return LOCALES[locale];
}
