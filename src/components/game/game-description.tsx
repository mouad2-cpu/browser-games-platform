"use client";

import { useLanguage } from "@/components/layout/language-provider";

type Props = {
  title: string;
  description: string | null;
};

type DescriptionSection = {
  title: string;
  items: string[];
};

function parseDescription(description: string, detailsLabel: string) {
  const blocks = description.split(/\n\n+/).filter(Boolean);
  const intro: string[] = [];
  const sections: DescriptionSection[] = [];

  for (const block of blocks) {
    const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
    if (lines.length === 0) continue;

    const listItems = lines.filter((line) => line.startsWith("- ") || line.startsWith("• "));
    const isListBlock = listItems.length > 0 && listItems.length === lines.length;
    const isHeadingWithList =
      lines.length > 1 &&
      lines.slice(1).every((line) => line.startsWith("- ") || line.startsWith("• "));

    if (isListBlock) {
      sections.push({
        title: detailsLabel,
        items: listItems.map((line) => line.replace(/^[-•]\s*/, "")),
      });
      continue;
    }

    if (isHeadingWithList) {
      sections.push({
        title: lines[0].replace(/:$/, ""),
        items: lines.slice(1).map((line) => line.replace(/^[-•]\s*/, "")),
      });
      continue;
    }

    intro.push(block);
  }

  return { intro, sections };
}

function renderInlineFormatting(text: string) {
  const regex = /(\*\*.+?\*\*|!!.+?!!|\^\^.+?\^\^)/g;
  const parts = text.split(regex);

  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("!!") && part.endsWith("!!")) {
      return (
        <span key={i} className="font-bold uppercase tracking-wide text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    if (part.startsWith("^^") && part.endsWith("^^")) {
      return (
        <span key={i} className="text-base font-bold text-white">
          {part.slice(2, -2)}
        </span>
      );
    }
    return part;
  });
}

function renderDescriptionLine(line: string, key: number) {
  const trimmed = line.trim();
  if (!trimmed) return null;

  if (/^##\s+/.test(trimmed)) {
    return (
      <p key={key} className="pt-2 text-base font-bold uppercase tracking-wide text-white">
        {renderInlineFormatting(trimmed.replace(/^##\s+/, ""))}
      </p>
    );
  }

  if (/^#\s+/.test(trimmed)) {
    return (
      <p key={key} className="pt-2 text-lg font-bold text-white">
        {renderInlineFormatting(trimmed.replace(/^#\s+/, ""))}
      </p>
    );
  }

  const boldLine = trimmed.match(/^\*\*(.+)\*\*$/);
  if (boldLine) {
    return (
      <p key={key} className="pt-1 font-bold text-white">
        {boldLine[1]}
      </p>
    );
  }

  return <p key={key}>{renderInlineFormatting(trimmed)}</p>;
}

function renderIntroBlock(block: string, blockIndex: number) {
  const lines = block.split("\n");
  return lines.map((line, lineIndex) =>
    renderDescriptionLine(line, blockIndex * 1000 + lineIndex)
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-lg font-bold uppercase tracking-wide text-[var(--color-text)]">
      {children}
    </h2>
  );
}

function SectionBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-2 space-y-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
      {children}
    </div>
  );
}

function DescriptionBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionHeading>{renderInlineFormatting(title)}</SectionHeading>
      <SectionBody>{children}</SectionBody>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-1.5 pl-5 marker:text-[var(--color-muted)]">
      {items.map((item, i) => (
        <li key={i}>{renderInlineFormatting(item)}</li>
      ))}
    </ul>
  );
}

function isMetaDescriptionSection(title: string): boolean {
  const normalized = title.toLowerCase().replace(/:$/, "").trim();
  return (
    normalized === "release date" ||
    normalized === "release" ||
    normalized === "platforms" ||
    normalized === "platform" ||
    normalized === "last updated" ||
    normalized === "last update"
  );
}

export function GameDescription({
  title,
  description,
}: Props) {
  const { t } = useLanguage();
  const parsed = description
    ? parseDescription(description, t("game.details"))
    : { intro: [], sections: [] };
  const hasIntro = parsed.intro.length > 0;
  const descriptionSections = parsed.sections.filter(
    (section) => !isMetaDescriptionSection(section.title)
  );

  return (
    <section className="space-y-6">
      <DescriptionBlock title={t("game.description")}>
        <h1 className="text-xl font-bold text-white">{title}</h1>
        {hasIntro ? (
          parsed.intro.map((block, i) => (
            <div key={i} className="space-y-1.5">
              {renderIntroBlock(block, i)}
            </div>
          ))
        ) : (
          <p className="text-[var(--color-muted)]">{t("game.noDescription")}</p>
        )}
      </DescriptionBlock>

      {descriptionSections.map((section) => (
        <DescriptionBlock key={section.title} title={section.title}>
          <BulletList items={section.items} />
        </DescriptionBlock>
      ))}
    </section>
  );
}

export const DESCRIPTION_FORMAT_HINT =
  "Formatting: **bold**, !!UPPERCASE!!, ^^bigger^^, ## heading on its own line, **Title** alone on a line for a bold subheading";
