"use client";

export default function AnalyticsError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      role="alert"
      className="mx-auto max-w-2xl rounded-2xl border border-red-500/40 bg-red-500/10 p-6"
    >
      <h1 className="text-xl font-bold text-red-100">
        Analytics could not be loaded
      </h1>
      <p className="mt-2 text-sm text-red-200/80">
        Check the database migration and connection, then try again.
      </p>
      <button type="button" className="btn-secondary mt-4" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
