import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-2 text-6xl font-bold text-[var(--color-accent)]">404</h1>
      <p className="mb-6 text-lg text-[var(--color-muted)]">
        Page not found — this game or category doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-[var(--color-accent)] px-6 py-2.5 font-semibold text-white transition hover:bg-[var(--color-accent-hover)]"
      >
        Back to Home
      </Link>
    </div>
  );
}
