import type { Metadata } from "next";
import { DmcaPageContent } from "@/components/dmca/dmca-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/dmca-notice",
  title: "DMCA Notice",
  description:
    "How to submit a DMCA takedown notice or counter-notification to ZenFun Games.",
});

export default function DmcaNoticePage() {
  return <DmcaPageContent />;
}
