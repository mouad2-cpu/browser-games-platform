"use client";

import { useLanguage } from "@/components/layout/language-provider";
import { getTermsOfServiceContent } from "@/lib/i18n/legal/terms-of-service";
import { LegalDocumentLayout } from "./legal-document-layout";
import { LegalPageTitleSync } from "./legal-page-title-sync";

export function TermsOfServicePageContent() {
  const { locale, t } = useLanguage();
  const content = getTermsOfServiceContent(locale);

  return (
    <>
      <LegalPageTitleSync titleKey="footer.legalTerms" />
      <LegalDocumentLayout title={t("footer.legalTerms")}>{content}</LegalDocumentLayout>
    </>
  );
}
