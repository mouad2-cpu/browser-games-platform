import Link from "next/link";

type Props = {
  categories: { slug: string; name: string }[];
  title: string;
};

export function GameBreadcrumb({ categories, title }: Props) {
  const primary = categories[0];

  return (
    <nav aria-label="Breadcrumb" className="min-w-0 text-xs text-[var(--color-muted)]">
      <ol className="flex flex-wrap items-center gap-1.5">
        <li>
          <Link href="/" className="transition hover:text-[var(--color-text)]">
            Home
          </Link>
        </li>
        {primary && (
          <>
            <li aria-hidden>»</li>
            <li>
              <Link
                href={`/c/${primary.slug}`}
                className="transition hover:text-[var(--color-text)]"
              >
                {primary.name}
              </Link>
            </li>
          </>
        )}
        <li aria-hidden>»</li>
        <li className="truncate text-[var(--color-text)]">{title}</li>
      </ol>
    </nav>
  );
}
