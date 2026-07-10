"use client";

import { useLanguage } from "@/components/layout/language-provider";
import { getCommunityGuidelinesContent } from "@/lib/i18n/legal/community-guidelines";
import { LegalDocumentLayout } from "./legal-document-layout";
import { LegalPageTitleSync } from "./legal-page-title-sync";

export function CommunityGuidelinesPageContent() {
  const { locale, t } = useLanguage();
  const content = getCommunityGuidelinesContent(locale);

  return (
    <>
      <LegalPageTitleSync titleKey="footer.legalCommunity" />
      <LegalDocumentLayout title={t("footer.legalCommunity")}>{content}</LegalDocumentLayout>
    </>
  );
}
