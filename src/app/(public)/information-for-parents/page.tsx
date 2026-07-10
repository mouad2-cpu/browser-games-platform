import type { Metadata } from "next";
import { ParentsPageContent } from "@/components/parents/parents-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/information-for-parents",
  title: "Information for Parents",
  description:
    "Learn how ZenFun Games keeps online gaming safe, fun, and family-friendly for children and parents.",
});

export default function InformationForParentsPage() {
  return <ParentsPageContent />;
}
