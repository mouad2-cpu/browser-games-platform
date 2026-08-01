"use client";

import { useEffect, useRef } from "react";

type Props = {
  embedPath: string;
  title: string;
  onPlay: () => void;
};

export function GamePlayer({ embedPath, title, onPlay }: Props) {
  const playRecorded = useRef(false);

  useEffect(() => {
    if (playRecorded.current) return;
    playRecorded.current = true;
    onPlay();
  }, [onPlay]);

  return (
    <div
      id="game-player-container"
      className="relative w-full overflow-hidden rounded-2xl bg-[var(--color-surface)] shadow-2xl shadow-black/50"
      style={{ minHeight: "min(70vh, 640px)" }}
    >
      <iframe
        src={embedPath}
        title={title}
        allowFullScreen
        // allow-popups: needed for GD/Famobi Play/Try buttons & ads.
        // Do NOT add allow-top-navigation*: that lets embeds replace zenfungames.com.
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock allow-fullscreen"
        referrerPolicy="strict-origin-when-cross-origin"
        className="h-full min-h-[inherit] w-full border-0"
        style={{ minHeight: "min(70vh, 640px)" }}
      />
    </div>
  );
}
