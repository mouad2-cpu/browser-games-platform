"use client";

type Props = {
  embedPath: string;
  title?: string;
};

export function EmbedPreview({ embedPath, title = "Game preview" }: Props) {
  const src = embedPath.trim();

  if (!src) {
    return (
      <div className="flex aspect-video min-h-[200px] items-center justify-center rounded-xl border border-dashed border-[var(--color-border)] bg-[var(--color-bg)] text-sm text-[var(--color-muted)]">
        Enter an embed path or upload a game to preview
      </div>
    );
  }

  const valid = src.startsWith("https://") || src.startsWith("http://") || src.startsWith("/");
  if (!valid) {
    return (
      <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
        Invalid embed path. Use https://… or /uploads/games/…/index.html
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-[var(--color-border)] bg-black">
      <p className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-xs text-[var(--color-muted)]">
        iframe preview — {src}
      </p>
      <div className="relative aspect-video min-h-[240px] w-full">
        <iframe
          src={src}
          title={title}
          allowFullScreen
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-fullscreen"
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  );
}
