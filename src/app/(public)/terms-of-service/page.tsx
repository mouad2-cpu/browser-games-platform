import type { Metadata } from "next";
import { TermsOfServicePageContent } from "@/components/legal/terms-of-service-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/terms-of-service",
  title: "Terms of Service",
  description: "Terms of Service for using ZenFun Games and our free browser games.",
});

export default function TermsOfServicePage() {
  return <TermsOfServicePageContent />;
}
