export default function AnalyticsLoading() {
  return (
    <div className="mx-auto max-w-[1600px] animate-pulse space-y-6" aria-label="Loading analytics">
      <div className="h-20 rounded-2xl bg-[var(--color-surface)]" />
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl bg-[var(--color-surface)]"
          />
        ))}
      </div>
      <div className="h-72 rounded-2xl bg-[var(--color-surface)]" />
    </div>
  );
}
