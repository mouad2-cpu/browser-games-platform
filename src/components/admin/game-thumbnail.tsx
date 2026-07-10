import { getGameImageAlt } from "@/lib/game-image-alt";

type Props = {
  src: string | null | undefined;
  title: string;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizes = {
  sm: "h-10 w-16",
  md: "h-20 w-32",
  lg: "aspect-[16/10] w-full max-w-xs",
};

export function GameThumbnail({ src, title, size = "sm", className = "" }: Props) {
  const base = `${sizes[size]} shrink-0 overflow-hidden rounded-lg bg-[var(--color-surface)] object-cover ${className}`;

  if (src) {
    return <img src={src} alt={getGameImageAlt(title)} className={base} />;
  }

  return (
    <div
      className={`${base} flex items-center justify-center text-xs text-[var(--color-muted)]`}
      aria-hidden
    >
      No image
    </div>
  );
}
