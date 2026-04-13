"use client";

/**
 * AI_NOTE:
 * Role: top-level hero runtime composition hook.
 * This hook should mostly stitch smaller hooks together rather than growing new motion logic inline.
 */

import type Lenis from "lenis";
import { useEffect, useRef, useState } from "react";

import {
  useManifestoLockInteractions,
} from "@/lib/hero-manifesto-lock";
import { type HeroSection, type SnapSectionKey } from "@/lib/hero-scene-motion";
import { useHeroSceneNavigation } from "@/lib/use-hero-scene-navigation";
import { useHeroSceneScrollSync } from "@/lib/use-hero-scene-scroll-sync";
import { useSyncedStateRef } from "@/lib/use-synced-state-ref";

export function useHeroSceneRuntime(lenis: Lenis | null, prefersReducedMotion: boolean) {
  // AI_CONTEXT:
  // This hook is the top-level composition point for hero runtime behavior.
  // It should mainly stitch smaller hooks together and expose the final render-facing API.
  const manifestoAnchorRef = useRef<HTMLDivElement>(null);
  const sheetAnchorRef = useRef<HTMLDivElement>(null);
  const portfolioAnchorRef = useRef<HTMLDivElement>(null);
  const previousScrollYRef = useRef(0);
  const snappedSectionsRef = useRef<Record<SnapSectionKey, boolean>>({
    manifesto: false,
    sheet: false,
    portfolio: false,
  });
  const isAutoSnappingRef = useRef(false);
  const snapReleaseTimeoutRef = useRef<number | null>(null);
  const prefersReducedMotionRef = useRef(false);
  const touchYRef = useRef<number | null>(null);
  const manifestoWordProgressRef = useRef(0);
  const [isManifestoLockEligible, manifestoLockEligibleRef, setManifestoLockEligible] = useSyncedStateRef(false);
  const [isManifestoLockActive, manifestoLockActiveRef, setManifestoLockActive] = useSyncedStateRef(false);
  const [coverProgress, setCoverProgress] = useState(0);
  const [isHeroRetired, isHeroRetiredRef, setIsHeroRetired] = useSyncedStateRef(false);
  const [isHomeAmbientPaused, isHomeAmbientPausedRef, setIsHomeAmbientPaused] = useSyncedStateRef(false);
  const [manifestoWordProgress, setManifestoWordProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<HeroSection>("home");

  useEffect(() => {
    prefersReducedMotionRef.current = prefersReducedMotion;
  }, [prefersReducedMotion]);

  useManifestoLockInteractions({
    lenis,
    lockEligible: isManifestoLockEligible,
    lockActive: isManifestoLockActive,
    prefersReducedMotion,
    manifestoAnchorRef,
    manifestoLockEligibleRef,
    manifestoLockActiveRef,
    manifestoWordProgressRef,
    touchYRef,
    setManifestoLockActive,
    setManifestoWordProgress,
  });

  useHeroSceneScrollSync({
    lenis,
    prefersReducedMotion,
    manifestoAnchorRef,
    sheetAnchorRef,
    portfolioAnchorRef,
    previousScrollYRef,
    snappedSectionsRef,
    isAutoSnappingRef,
    snapReleaseTimeoutRef,
    manifestoLockEligibleRef,
    manifestoLockActiveRef,
    prefersReducedMotionRef,
    manifestoWordProgressRef,
    setManifestoLockEligible,
    isHeroRetiredRef,
    isHomeAmbientPausedRef,
    setManifestoWordProgress,
    setCoverProgress,
    setIsHeroRetired,
    setIsHomeAmbientPaused,
    setActiveSection,
  });

  const scrollToSection = useHeroSceneNavigation({
    lenis,
    manifestoAnchorRef,
    sheetAnchorRef,
    portfolioAnchorRef,
    manifestoLockEligibleRef,
    manifestoLockActiveRef,
    manifestoWordProgressRef,
    prefersReducedMotionRef,
    touchYRef,
    setManifestoLockActive,
    isAutoSnappingRef,
    snapReleaseTimeoutRef,
    setManifestoWordProgress,
  });

  return {
    activeSection,
    coverProgress,
    isHeroRetired,
    isHomeAmbientPaused,
    manifestoWordProgress,
    manifestoAnchorRef,
    portfolioAnchorRef,
    scrollToSection,
    sheetAnchorRef,
  };
}
