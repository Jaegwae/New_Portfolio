"use client";

import Lenis from "lenis";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const LenisContext = createContext<Lenis | null>(null);

export function SmoothScrollProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;

    const destroyLenis = () => {
      if (!instance) {
        setLenis(null);
        return;
      }

      instance.destroy();
      instance = null;
      setLenis(null);
    };

    const createLenis = () => {
      if (mediaQuery.matches) {
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

    const handlePreferenceChange = () => {
      destroyLenis();
      createLenis();
    };

    createLenis();
    mediaQuery.addEventListener("change", handlePreferenceChange);

    return () => {
      mediaQuery.removeEventListener("change", handlePreferenceChange);
      destroyLenis();
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}

export function useLenis() {
  return useContext(LenisContext);
}
