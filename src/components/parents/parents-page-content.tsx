"use client";

import { useLanguage } from "@/components/layout/language-provider";
import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";
import { LegalPageTitleSync } from "@/components/legal/legal-page-title-sync";
import { getParentsPageContent } from "@/lib/i18n/pages/parents";

export function ParentsPageContent() {
  const { locale, t } = useLanguage();
  const content = getParentsPageContent(locale);

  return (
    <>
      <LegalPageTitleSync titleKey="footer.exploreParents" />
      <LegalDocumentLayout title={t("footer.exploreParents")}>{content}</LegalDocumentLayout>
    </>
  );
}
