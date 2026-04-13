"use client";

/**
 * AI_NOTE:
 * Role: Lenis lifecycle owner and context provider.
 * Reduced-motion policy comes from usePrefersReducedMotion; avoid duplicating matchMedia logic here.
 */

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

const LenisContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    let instance: Lenis | null = null;

    const destroyLenis = () => {
      // AI_CONTEXT:
      // Keep destroy idempotent so repeated effect cleanup cannot leak the Lenis instance.
      if (!instance) {
        setLenis(null);
        return;
      }

      instance.destroy();
      instance = null;
      setLenis(null);
    };

    const createLenis = () => {
      if (prefersReducedMotion) {
        // AI_CONTEXT: reduced motion disables smooth-scroll runtime entirely.
        destroyLenis();
        return;
      }

      instance = new Lenis({
        autoRaf: true,
        smoothWheel: true,
        lerp: 0.08,
        wheelMultiplier: 0.92,
        touchMultiplier: 1,
        overscroll: true,
      });

      setLenis(instance);
    };

    createLenis();

    return () => {
      destroyLenis();
    };
  }, [prefersReducedMotion]);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
