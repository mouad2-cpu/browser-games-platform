"use client";

import { useLanguage } from "@/components/layout/language-provider";
import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";
import { LegalPageTitleSync } from "@/components/legal/legal-page-title-sync";
import { getDmcaPageContent } from "@/lib/i18n/pages/dmca";

export function DmcaPageContent() {
  const { locale, t } = useLanguage();
  const content = getDmcaPageContent(locale);

  return (
    <>
      <LegalPageTitleSync titleKey="footer.legalDmca" />
      <LegalDocumentLayout title={t("footer.legalDmca")}>{content}</LegalDocumentLayout>
    </>
  );
}
