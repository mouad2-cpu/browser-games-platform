import type { ReactNode } from "react";
import { AboutFloatingShapes } from "./about-floating-shapes";

type SceneProps = {
  id: string;
  bg: string;
  children: ReactNode;
  className?: string;
};

export function AboutScene({ id, bg, children, className = "" }: SceneProps) {
  return (
    <section
      id={id}
      className={`about-scene ${className}`}
      style={{ backgroundColor: bg }}
    >
      <AboutFloatingShapes />
      <div className="about-scene-inner">{children}</div>
    </section>
  );
}
