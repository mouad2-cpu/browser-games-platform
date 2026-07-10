import type { SeoContentBlock, SeoDateRange } from "@/lib/seo-content";
import "@/components/category/category-seo-section.css";

type Props = {
  content: SeoContentBlock;
  firstPublished?: Date | null;
  latestAdded?: Date | null;
};

function formatSeoDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

/**
 * Shared About + FAQ block for category pages and collection pages
 * (New / Popular / All Games / Top Picks / Continue Playing).
 */
export function SeoContentSection({
  content,
  firstPublished = null,
  latestAdded = null,
}: Props) {
  return (
    <div className="category-seo">
      <section className="category-seo-about" aria-labelledby="seo-about-title">
        <h2 id="seo-about-title" className="category-seo-heading">
          {content.aboutTitle}
        </h2>

        <div className="category-seo-prose">
          {content.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
        </div>

        {(firstPublished || latestAdded) && (
          <dl className="category-seo-meta">
            {firstPublished && (
              <div>
                <dt>First published</dt>
                <dd>{formatSeoDate(firstPublished)}</dd>
              </div>
            )}
            {latestAdded && (
              <div>
                <dt>Latest game added</dt>
                <dd>{formatSeoDate(latestAdded)}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      {content.faqs.length > 0 && (
        <section className="category-seo-faqs" aria-labelledby="seo-faq-title">
          <h2 id="seo-faq-title" className="category-seo-heading">
            FAQs
          </h2>

          <div className="category-seo-faq-list">
            {content.faqs.map((faq) => (
              <div key={faq.question} className="category-seo-faq-item">
                <h3 className="category-seo-faq-question">{faq.question}</h3>
                <p className="category-seo-faq-answer">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

/** @deprecated Prefer SeoContentSection — same component, old name. */
export function CategorySeoSection(props: Props) {
  return <SeoContentSection {...props} />;
}

export type { SeoContentBlock, SeoDateRange };
