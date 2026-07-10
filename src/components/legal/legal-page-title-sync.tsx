"use client";

import { useEffect } from "react";
import { useLanguage } from "@/components/layout/language-provider";

type Props = {
  titleKey: string;
};

export function LegalPageTitleSync({ titleKey }: Props) {
  const { t, messages } = useLanguage();

  useEffect(() => {
    const pageTitle = t(titleKey);
    document.title = messages.meta.siteTitleTemplate.replace("%s", pageTitle);
  }, [t, titleKey, messages.meta.siteTitleTemplate]);

  return null;
}
