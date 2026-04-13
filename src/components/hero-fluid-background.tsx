"use client";

/**
 * AI_NOTE:
 * Role: lightweight render shell for the HOME fluid background canvas.
 * All heavy simulation/runtime logic should stay in src/lib/use-hero-fluid-background-scene.ts.
 */

import { useRef } from "react";

import { useHeroFluidBackgroundScene } from "@/lib/use-hero-fluid-background-scene";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

export function HeroFluidBackground({ paused }: { paused: boolean }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useHeroFluidBackgroundScene({
    canvasRef,
    rootRef,
    paused,
    prefersReducedMotion,
  });

  return (
    <div
      aria-hidden="true"
      className={`hero-fluid-background${paused ? " is-paused" : ""}`}
      ref={rootRef}
    >
      <div className="hero-fluid-background__fallback" />
      <canvas className="hero-fluid-background__canvas" ref={canvasRef} />
      <div className="hero-fluid-background__veil" />
    </div>
  );
}
