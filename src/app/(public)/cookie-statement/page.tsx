import type { Metadata } from "next";
import { CookieStatementPageContent } from "@/components/legal/cookie-statement-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/cookie-statement",
  title: "Cookie Statement",
  description: "How ZenFun Games uses cookies and how you can manage your preferences.",
});

export default function CookieStatementPage() {
  return <CookieStatementPageContent />;
}
