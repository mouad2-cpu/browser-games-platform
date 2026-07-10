import Link from "next/link";

type Props = {
  featuredSlug?: string;
  featuredTitle?: string;
};

export function Hero({ featuredSlug, featuredTitle }: Props) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[var(--color-surface)] to-[var(--color-bg)] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl text-center">
        <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-5xl">
          Play Free Browser Games
        </h1>
        <p className="mx-auto mb-8 max-w-2xl text-[var(--color-muted)] sm:text-lg">
          Hundreds of HTML5 games — action, puzzle, racing, and more. No downloads,
          no installs. Just click and play.
        </p>
        {featuredSlug && featuredTitle && (
          <Link
            href={`/game/${featuredSlug}`}
            className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-accent)] px-6 py-3 font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
          >
            Play {featuredTitle}
            <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </Link>
        )}
      </div>
    </section>
  );
}
