import type { Metadata } from "next";
import { AboutPageContent } from "@/components/about/about-page-content";
import { buildPageMetadata } from "@/lib/seo-metadata";

export const metadata: Metadata = buildPageMetadata({
  path: "/about",
  title: "About Us",
  description:
    "Learn about ZenFun Games — free online browser games with no downloads, instant play, and new titles added regularly.",
});

export default function AboutPage() {
  return <AboutPageContent />;
}
