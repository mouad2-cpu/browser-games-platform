"use client";

import { useEffect, useRef } from "react";

const SHAPE_LAYOUT = [
  { left: "5%", top: "8%", size: 160, type: "heart", rotate: -8 },
  { left: "82%", top: "12%", size: 140, type: "x", rotate: 12 },
  { left: "72%", top: "58%", size: 130, type: "circle", rotate: 4 },
  { left: "6%", top: "62%", size: 150, type: "square", rotate: -6 },
  { left: "42%", top: "5%", size: 95, type: "square", rotate: 10 },
  { left: "88%", top: "72%", size: 110, type: "heart", rotate: -14 },
  { left: "18%", top: "38%", size: 85, type: "x", rotate: 6 },
  { left: "55%", top: "78%", size: 120, type: "circle", rotate: -10 },
] as const;

type ShapeType = (typeof SHAPE_LAYOUT)[number]["type"];

function ShapeSvg({ type, size }: { type: ShapeType; size: number }) {
  if (type === "heart") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  if (type === "x") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    );
  }
  if (type === "circle") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <circle cx="12" cy="12" r="9" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="2" y="2" width="20" height="20" rx="5" />
    </svg>
  );
}

type MotionProfile = {
  baseRotate: number;
  floatAmp: number;
  floatSpeed: number;
  rotateAmp: number;
  rotateSpeed: number;
  phase: number;
};

const MOTION_PROFILES: MotionProfile[] = SHAPE_LAYOUT.map((shape, index) => ({
  baseRotate: shape.rotate,
  floatAmp: 10 + (index % 4) * 5,
  floatSpeed: 0.00075 + (index % 5) * 0.00012,
  rotateAmp: 1.5 + (index % 3) * 1.2,
  rotateSpeed: 0.00055 + (index % 4) * 0.0001,
  phase: index * 1.65 + shape.rotate * 0.05,
}));

export function AboutFloatingShapes() {
  const shapeRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) return;

    let frameId = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const elapsed = now - start;

      shapeRefs.current.forEach((element, index) => {
        if (!element) return;

        const motion = MOTION_PROFILES[index];
        const y = Math.sin(elapsed * motion.floatSpeed + motion.phase) * motion.floatAmp;
        const rotate =
          motion.baseRotate +
          Math.sin(elapsed * motion.rotateSpeed + motion.phase * 0.85) * motion.rotateAmp;

        element.style.transform = `translateY(${y}px) rotate(${rotate}deg)`;
      });

      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="about-shapes" aria-hidden>
      {SHAPE_LAYOUT.map((shape, index) => (
        <div
          key={index}
          ref={(element) => {
            shapeRefs.current[index] = element;
          }}
          className="about-shape"
          style={{
            left: shape.left,
            top: shape.top,
            width: shape.size,
            height: shape.size,
            transform: `rotate(${shape.rotate}deg)`,
          }}
        >
          <ShapeSvg type={shape.type} size={shape.size} />
        </div>
      ))}
    </div>
  );
}
