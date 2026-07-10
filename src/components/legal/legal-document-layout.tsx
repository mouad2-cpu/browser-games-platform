import type { ReactNode } from "react";
import "../parents/parents-page.css";

type Props = {
  title: string;
  children: ReactNode;
};

export function LegalDocumentLayout({ title, children }: Props) {
  return (
    <article className="parents-page">
      <div className="parents-page-inner">
        <header className="parents-page-head">
          <h1 className="parents-page-title">{title}</h1>
        </header>
        <div className="parents-page-body">{children}</div>
      </div>
    </article>
  );
}
