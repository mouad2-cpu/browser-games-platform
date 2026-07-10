import type { GameSeoContent } from "@/lib/game-seo-content";
import "./game-seo-section.css";

type Props = {
  content: GameSeoContent;
};

export function GameSeoSection({ content }: Props) {
  return (
    <div className="game-seo">
      <section className="game-seo-block" aria-labelledby="game-overview-title">
        <h2 id="game-overview-title" className="game-seo-heading">
          {content.overviewTitle}
        </h2>
        <div className="game-seo-prose">
          {content.overview.map((paragraph) => (
            <p key={paragraph.slice(0, 56)}>{paragraph}</p>
          ))}
        </div>

        <div className="game-seo-specs-wrap">
          <table className="game-seo-specs">
            <tbody>
              {content.specs.map((spec) => (
                <tr key={spec.label}>
                  <th scope="row">{spec.label}</th>
                  <td>{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="game-howto-title">
        <h2 id="game-howto-title" className="game-seo-heading">
          {content.howToTitle}
        </h2>
        <ol className="game-seo-steps">
          {content.howToSteps.map((step, index) => (
            <li key={step.slice(0, 48)}>
              <span className="game-seo-step-index">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      <section className="game-seo-block" aria-labelledby="game-tips-title">
        <h2 id="game-tips-title" className="game-seo-heading">
          {content.tipsTitle}
        </h2>
        <div className="game-seo-callouts">
          <div className="game-seo-callout game-seo-callout-tip">
            <p className="game-seo-callout-label">Pro Tip</p>
            <p>{content.proTip}</p>
          </div>
          <div className="game-seo-callout game-seo-callout-mistake">
            <p className="game-seo-callout-label">Common Mistake</p>
            <p>{content.commonMistake}</p>
          </div>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="game-unblocked-title">
        <h2 id="game-unblocked-title" className="game-seo-heading">
          {content.unblockedTitle}
        </h2>
        <div className="game-seo-prose">
          <p>{content.unblocked}</p>
        </div>
      </section>

      <section className="game-seo-block" aria-labelledby="game-faq-title">
        <h2 id="game-faq-title" className="game-seo-heading">
          FAQs
        </h2>
        <div className="game-seo-faq-list">
          {content.faqs.map((faq) => (
            <div key={faq.question} className="game-seo-faq-item">
              <h3 className="game-seo-faq-question">{faq.question}</h3>
              <p className="game-seo-faq-answer">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
