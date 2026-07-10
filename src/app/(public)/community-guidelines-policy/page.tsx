import type { Metadata } from "next";
import { CommunityGuidelinesPageContent } from "@/components/legal/community-guidelines-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/community-guidelines-policy",
  title: "Community Guidelines & Policy",
  description:
    "Community rules for ZenFun Games — keep chat and interactive spaces fun, fair, and safe for everyone.",
});

export default function CommunityGuidelinesPolicyPage() {
  return <CommunityGuidelinesPageContent />;
}
