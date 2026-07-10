import type { SeoContent } from "@/lib/category-seo-content";
import "./category-seo-section.css";

type Props = {
  content: SeoContent;
  firstPublished: Date | null;
  latestAdded: Date | null;
};

function formatCategoryDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

export function CategorySeoSection({ content, firstPublished, latestAdded }: Props) {
  return (
    <div className="category-seo">
      <section className="category-seo-about" aria-labelledby="category-about-title">
        <h2 id="category-about-title" className="category-seo-heading">
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
                <dd>{formatCategoryDate(firstPublished)}</dd>
              </div>
            )}
            {latestAdded && (
              <div>
                <dt>Latest game added</dt>
                <dd>{formatCategoryDate(latestAdded)}</dd>
              </div>
            )}
          </dl>
        )}
      </section>

      {content.faqs.length > 0 && (
        <section className="category-seo-faqs" aria-labelledby="category-faq-title">
          <h2 id="category-faq-title" className="category-seo-heading">
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
