"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/components/layout/language-provider";
import { SITE_NAME } from "@/lib/site-config";

function setMetaContent(selector: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(selector);
  if (!element) {
    element = document.createElement("meta");
    const isOg = selector.startsWith('meta[property="og:');
    if (isOg) {
      element.setAttribute("property", selector.slice(13, -2));
    } else {
      element.setAttribute("name", selector.slice(11, -2));
    }
    document.head.appendChild(element);
  }
  element.setAttribute("content", content);
}

/** Sync homepage title/description when the UI locale changes — never overwrite other pages. */
export function LocaleDocumentTitle() {
  const { locale, messages, t } = useLanguage();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    document.title = messages.meta.siteTitle;
    const description = t("meta.siteDescription", { siteName: SITE_NAME });
    setMetaContent('meta[name="description"]', description);
    setMetaContent('meta[property="og:description"]', description);
  }, [locale, messages, t, pathname]);

  return null;
}
