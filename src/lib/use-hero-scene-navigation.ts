"use client";

/**
 * AI_NOTE:
 * Role: section-jump navigation behavior for the HOME hero runtime.
 * Keep actual section metadata and snap constants outside this hook.
 */

import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { useCallback, useEffect, type MutableRefObject, type RefObject } from "react";

import { releaseManifestoLockState, syncManifestoProgress } from "@/lib/hero-manifesto-lock";
import { armScrollTransitionGuard, clearSnapReleaseTimeout, type HeroSection } from "@/lib/hero-scene-motion";

let hasRegisteredScrollToPlugin = false;

function ensureScrollToPluginRegistered() {
  if (hasRegisteredScrollToPlugin) {
    return;
  }

  gsap.registerPlugin(ScrollToPlugin);
  hasRegisteredScrollToPlugin = true;
}

type UseHeroSceneNavigationOptions = {
  lenis: Lenis | null;
  manifestoAnchorRef: RefObject<HTMLDivElement | null>;
  sheetAnchorRef: RefObject<HTMLDivElement | null>;
  portfolioAnchorRef: RefObject<HTMLDivElement | null>;
  manifestoLockEligibleRef: MutableRefObject<boolean>;
  manifestoLockActiveRef: MutableRefObject<boolean>;
  manifestoWordProgressRef: MutableRefObject<number>;
  prefersReducedMotionRef: MutableRefObject<boolean>;
  touchYRef: MutableRefObject<number | null>;
  setManifestoLockActive: (nextValue: boolean) => void;
  isAutoSnappingRef: MutableRefObject<boolean>;
  snapReleaseTimeoutRef: MutableRefObject<number | null>;
  setManifestoWordProgress: (nextValue: number) => void;
};

export function useHeroSceneNavigation({
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
}: UseHeroSceneNavigationOptions) {
  // AI_CONTEXT:
  // This hook owns section-jump side effects only.
  // It should not derive active section state or scroll metrics.
  const releaseManifestoLock = useCallback(() => {
    releaseManifestoLockState(manifestoLockActiveRef, lenis);
    setManifestoLockActive(false);
  }, [lenis, manifestoLockActiveRef, setManifestoLockActive]);

  const prepareManifestoForSectionJump = useCallback(
    (section: HeroSection) => {
      manifestoLockEligibleRef.current = false;
      touchYRef.current = null;
      releaseManifestoLock();

      if (section === "home" || section === "manifesto") {
        syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, 0);
      }
    },
    [
      manifestoLockEligibleRef,
      touchYRef,
      releaseManifestoLock,
      manifestoWordProgressRef,
      setManifestoWordProgress,
    ],
  );

  useEffect(() => {
    return () => {
      clearSnapReleaseTimeout(snapReleaseTimeoutRef);
      releaseManifestoLockState(manifestoLockActiveRef, lenis);
    };
  }, [lenis, manifestoLockActiveRef, snapReleaseTimeoutRef]);

  return useCallback(
    (section: HeroSection) => {
      ensureScrollToPluginRegistered();
      prepareManifestoForSectionJump(section);

      const sectionTargets = {
        manifesto: manifestoAnchorRef.current,
        intro: sheetAnchorRef.current,
        portfolio: portfolioAnchorRef.current,
      };
      const target = section === "home" ? 0 : sectionTargets[section];

      if (!target && section !== "home") {
        return;
      }

      armScrollTransitionGuard(
        isAutoSnappingRef,
        snapReleaseTimeoutRef,
        prefersReducedMotionRef.current ? 0 : 1100,
      );

      if (lenis) {
        lenis.scrollTo(target ?? 0, {
          duration: 1,
          easing: (t) => 1 - Math.pow(1 - t, 4),
          lock: true,
          force: true,
          onComplete: () => {
            isAutoSnappingRef.current = false;
            clearSnapReleaseTimeout(snapReleaseTimeoutRef);
          },
        });
        return;
      }

      gsap.to(window, {
        duration: prefersReducedMotionRef.current ? 0 : 1,
        ease: prefersReducedMotionRef.current ? "none" : "power4.out",
        overwrite: "auto",
        scrollTo: target ?? 0,
        onComplete: () => {
          isAutoSnappingRef.current = false;
          clearSnapReleaseTimeout(snapReleaseTimeoutRef);
        },
      });
    },
    [
      prepareManifestoForSectionJump,
      manifestoAnchorRef,
      sheetAnchorRef,
      portfolioAnchorRef,
      isAutoSnappingRef,
      snapReleaseTimeoutRef,
      prefersReducedMotionRef,
      lenis,
    ],
  );
}
