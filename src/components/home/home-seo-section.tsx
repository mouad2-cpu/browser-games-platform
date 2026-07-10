import Link from "next/link";
import type { ReactNode } from "react";
import { HOME_SEO_CONTENT } from "@/lib/home-seo-content";
import "./home-seo-section.css";

export function HomeSeoSection() {
  return (
    <section className="home-seo" aria-labelledby="home-seo-title">
      <div className="home-seo-inner">
        <p className="home-seo-eyebrow">{HOME_SEO_CONTENT.eyebrow}</p>

        {HOME_SEO_CONTENT.sections.map((section, index) => (
          <div key={section.id} className="home-seo-block">
            {index === 0 ? (
              <h2 id="home-seo-title" className="home-seo-title">
                {section.title}
              </h2>
            ) : (
              <h3 className="home-seo-heading">{section.title}</h3>
            )}

            {section.paragraphs.map((paragraph) => (
              <p key={paragraph} className="home-seo-text">
                {"links" in section && section.links
                  ? renderParagraphWithLinks(paragraph, section.links)
                  : paragraph}
              </p>
            ))}

            {"closing" in section && section.closing && (
              <p className="home-seo-text">{section.closing}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function renderParagraphWithLinks(
  paragraph: string,
  links: readonly { label: string; href: string }[]
) {
  const parts: ReactNode[] = [];
  let remaining = paragraph;

  for (const link of links) {
    const index = remaining.indexOf(link.label);
    if (index === -1) continue;

    if (index > 0) {
      parts.push(remaining.slice(0, index));
    }

    parts.push(
      <Link key={link.href} href={link.href} className="home-seo-link">
        {link.label}
      </Link>
    );

    remaining = remaining.slice(index + link.label.length);
  }

  if (remaining) parts.push(remaining);
  return parts.length > 0 ? parts : paragraph;
}
