"use client";

import { useLanguage } from "@/components/layout/language-provider";
import { getCookieStatementContent } from "@/lib/i18n/legal/cookie-statement";
import { LegalDocumentLayout } from "./legal-document-layout";
import { LegalPageTitleSync } from "./legal-page-title-sync";

export function CookieStatementPageContent() {
  const { locale, t } = useLanguage();
  const content = getCookieStatementContent(locale);

  return (
    <>
      <LegalPageTitleSync titleKey="footer.legalCookies" />
      <LegalDocumentLayout title={t("footer.legalCookies")}>{content}</LegalDocumentLayout>
    </>
  );
}
