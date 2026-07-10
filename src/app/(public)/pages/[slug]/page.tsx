import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenuPageBySlug } from "@/lib/menu-pages";
import { LegalPage } from "@/components/layout/legal-page";
import { getMenuPageHref } from "@/lib/menu-page-routes";
import { buildPageMetadata } from "@/lib/seo-metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getMenuPageBySlug(slug);
  if (!page) return { title: "Page not found" };
  return buildPageMetadata({
    path: getMenuPageHref(slug),
    title: page.title,
    description: page.content?.slice(0, 160) ?? page.title,
  });
}

function renderParagraph(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export default async function MenuPageRoute({ params }: Props) {
  const { slug } = await params;
  const page = await getMenuPageBySlug(slug);
  if (!page) notFound();

  const paragraphs = (page.content ?? "")
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <LegalPage title={page.title}>
      {paragraphs.length === 0 ? (
        <p>This page has no content yet.</p>
      ) : (
        paragraphs.map((paragraph, i) => (
          <p key={i}>{renderParagraph(paragraph)}</p>
        ))
      )}
    </LegalPage>
  );
}
