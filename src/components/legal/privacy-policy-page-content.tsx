"use client";

import { useLanguage } from "@/components/layout/language-provider";
import { getPrivacyPolicyContent } from "@/lib/i18n/legal/privacy-policy";
import { LegalDocumentLayout } from "./legal-document-layout";
import { LegalPageTitleSync } from "./legal-page-title-sync";

export function PrivacyPolicyPageContent() {
  const { locale, t } = useLanguage();
  const content = getPrivacyPolicyContent(locale);

  return (
    <>
      <LegalPageTitleSync titleKey="footer.legalPrivacy" />
      <LegalDocumentLayout title={t("footer.legalPrivacy")}>{content}</LegalDocumentLayout>
    </>
  );
}
