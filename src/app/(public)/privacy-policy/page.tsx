import type { Metadata } from "next";
import { PrivacyPolicyPageContent } from "@/components/legal/privacy-policy-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/privacy-policy",
  title: "Privacy Policy",
  description: "How ZenFun Games collects, uses, and protects your information.",
});

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyPageContent />;
}
