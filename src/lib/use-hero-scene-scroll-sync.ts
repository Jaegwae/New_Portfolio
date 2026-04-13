"use client";

/**
 * AI_NOTE:
 * Role: scroll-driven hero state synchronization.
 * It reads DOM positions, derives scene metrics, and hands those metrics to the shared motion helpers.
 */

import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useEffectEvent, type Dispatch, type MutableRefObject, type RefObject, type SetStateAction } from "react";

import { syncManifestoLockEligibility } from "@/lib/hero-manifesto-lock";
import {
  getIntroCoverProgress,
  maybeSnapToNextSection,
  resetSnappedSections,
  syncHeroSceneVisualState,
  type HeroSceneMetrics,
  type HeroSection,
  type SnapSectionKey,
} from "@/lib/hero-scene-motion";

let hasRegisteredScrollTrigger = false;

function ensureScrollTriggerRegistered() {
  if (hasRegisteredScrollTrigger) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  hasRegisteredScrollTrigger = true;
}

type UseHeroSceneScrollSyncOptions = {
  lenis: Lenis | null;
  prefersReducedMotion: boolean;
  manifestoAnchorRef: RefObject<HTMLDivElement | null>;
  sheetAnchorRef: RefObject<HTMLDivElement | null>;
  portfolioAnchorRef: RefObject<HTMLDivElement | null>;
  previousScrollYRef: MutableRefObject<number>;
  snappedSectionsRef: MutableRefObject<Record<SnapSectionKey, boolean>>;
  isAutoSnappingRef: MutableRefObject<boolean>;
  snapReleaseTimeoutRef: MutableRefObject<number | null>;
  manifestoLockEligibleRef: MutableRefObject<boolean>;
  manifestoLockActiveRef: MutableRefObject<boolean>;
  prefersReducedMotionRef: MutableRefObject<boolean>;
  manifestoWordProgressRef: MutableRefObject<number>;
  setManifestoLockEligible: (nextValue: boolean) => void;
  isHeroRetiredRef: MutableRefObject<boolean>;
  isHomeAmbientPausedRef: MutableRefObject<boolean>;
  setManifestoWordProgress: (nextValue: number) => void;
  setCoverProgress: Dispatch<SetStateAction<number>>;
  setIsHeroRetired: (nextValue: boolean) => void;
  setIsHomeAmbientPaused: (nextValue: boolean) => void;
  setActiveSection: Dispatch<SetStateAction<HeroSection>>;
};

export function useHeroSceneScrollSync({
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
}: UseHeroSceneScrollSyncOptions) {
  // AI_CONTEXT:
  // This hook owns the scroll-to-state pipeline:
  // DOM rects -> metrics snapshot -> derived hero state -> optional auto-snap.
  const syncSceneFromScroll = useEffectEvent((reducedMotion: boolean) => {
    // AI_CONTEXT: this callback is invoked by ScrollTrigger updates and refreshes.
    const manifestoAnchor = manifestoAnchorRef.current;
    const sheetAnchor = sheetAnchorRef.current;
    const portfolioAnchor = portfolioAnchorRef.current;

    if (!manifestoAnchor || !sheetAnchor) {
      return;
    }

    const manifestoRect = manifestoAnchor.getBoundingClientRect();
    const rect = sheetAnchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    prefersReducedMotionRef.current = reducedMotion;
    const portfolioTop = portfolioAnchor?.getBoundingClientRect().top ?? null;
    const manifestoRevealComplete = syncManifestoLockEligibility({
      prefersReducedMotion: reducedMotion,
      viewportHeight,
      manifestoTop: manifestoRect.top,
      introTop: rect.top,
      lenis,
      manifestoLockEligibleRef,
      manifestoLockActiveRef,
      manifestoWordProgressRef,
      setManifestoLockEligible,
      setManifestoWordProgress,
    });

    const metrics: HeroSceneMetrics = {
      viewportHeight,
      manifestoTop: manifestoRect.top,
      introTop: rect.top,
      portfolioTop,
      scrollY: window.scrollY,
      isScrollingDown: window.scrollY > previousScrollYRef.current,
      manifestoRevealComplete,
      introCoverProgress: getIntroCoverProgress(manifestoRevealComplete, viewportHeight, rect.top),
    };

    syncHeroSceneVisualState({
      metrics,
      isHeroRetiredRef,
      setIsHeroRetired,
      setCoverProgress,
      setActiveSection,
      isHomeAmbientPausedRef,
      setIsHomeAmbientPaused,
      previousScrollYRef,
    });

    resetSnappedSections(
      snappedSectionsRef,
      metrics.viewportHeight,
      metrics.manifestoTop,
      metrics.introTop,
      metrics.portfolioTop,
    );

    maybeSnapToNextSection({
      metrics,
      snappedSectionsRef,
      isAutoSnappingRef,
      lenis,
      prefersReducedMotion: reducedMotion,
      snapReleaseTimeoutRef,
    });
  });

  useEffect(() => {
    ensureScrollTriggerRegistered();

    const handleSceneUpdate = () => {
      syncSceneFromScroll(prefersReducedMotion);
    };
    const sceneTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      onUpdate: handleSceneUpdate,
      onRefresh: handleSceneUpdate,
    });
    const removeLenisScrollListener = lenis?.on("scroll", ScrollTrigger.update);

    handleSceneUpdate();

    return () => {
      removeLenisScrollListener?.();
      sceneTrigger.kill();
    };
    // Keep the effect-event dependency shape stable during Fast Refresh in dev.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, prefersReducedMotion, syncSceneFromScroll]);
}
