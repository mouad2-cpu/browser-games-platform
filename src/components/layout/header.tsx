import { Suspense } from "react";
import { getSession } from "@/lib/auth";
import Link from "next/link";
import { AuthButton } from "./auth-button";

function AuthButtonFallback() {
  return (
    <div className="h-9 w-20 animate-pulse rounded-lg bg-[var(--color-surface)]" />
  );
}

export async function Header() {
  const session = await getSession();

  return (
    <header
      className="sticky top-0 z-30 border-b border-[var(--color-border)] bg-[var(--color-bg)]/95 backdrop-blur"
      style={{ height: "var(--header-h)" }}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center gap-4 px-4">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-[var(--color-accent)]"
        >
          BrowserGames
        </Link>

        <form action="/search" method="GET" className="mx-auto hidden max-w-md flex-1 sm:block">
          <input
            type="search"
            name="s"
            placeholder="Search games..."
            className="form-input w-full"
            aria-label="Search games"
          />
        </form>

        <Suspense fallback={<AuthButtonFallback />}>
          <AuthButton session={session} />
        </Suspense>
      </div>
    </header>
  );
}
