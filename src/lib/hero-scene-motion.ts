"use client";

/**
 * AI_NOTE:
 * Role: shared hero motion/state helpers.
 * Keep section-state derivation and snap math here so hero runtime hooks stay orchestration-focused.
 */

import type Lenis from "lenis";
import type { Dispatch, MutableRefObject, SetStateAction } from "react";

export type HeroSection = "home" | "manifesto" | "intro" | "portfolio";
export type SnapSectionKey = "manifesto" | "sheet" | "portfolio";

export type HeroSceneMetrics = {
  viewportHeight: number;
  manifestoTop: number;
  introTop: number;
  portfolioTop: number | null;
  scrollY: number;
  isScrollingDown: boolean;
  manifestoRevealComplete: boolean;
  introCoverProgress: number;
};

const MANIFESTO_SECTION_ACTIVE_RATIO = 0.62;
const INTRO_SECTION_ACTIVE_RATIO = 0.48;
const LOWER_SECTION_ACTIVE_RATIO = 0.58;
const HERO_RETIRE_RATIO = 0.06;
const AMBIENT_RESUME_RATIO = 0.82;
const SNAP_ENTRY_MAX_RATIO = 0.16;
const SNAP_ENTRY_MIN_RATIO = -0.22;

export const SECTION_NAV_ITEMS: ReadonlyArray<{
  section: HeroSection;
  label: string;
}> = [
  { section: "home", label: "HOME" },
  { section: "manifesto", label: "슬로건" },
  { section: "intro", label: "자기소개" },
  { section: "portfolio", label: "포트폴리오" },
];

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function getIntroCoverProgress(manifestoRevealComplete: boolean, viewportHeight: number, introTop: number) {
  const introOverlapOffset = manifestoRevealComplete ? clamp(viewportHeight - introTop, 0, viewportHeight * 1.1) : 0;
  const introCoverRawProgress = clamp(introOverlapOffset / (viewportHeight * 1.04), 0, 1);
  return Math.pow(introCoverRawProgress, 1.18);
}

export function getNextHeroRetired(current: boolean, manifestoTop: number, viewportHeight: number) {
  const heroRetireThreshold = -viewportHeight * HERO_RETIRE_RATIO;
  const heroRestoreThreshold = viewportHeight * HERO_RETIRE_RATIO;

  if (current) {
    return manifestoTop < heroRestoreThreshold;
  }

  return manifestoTop <= heroRetireThreshold;
}

export function getActiveHeroSection(
  viewportHeight: number,
  manifestoTop: number,
  introTop: number,
  portfolioTop: number | null,
): HeroSection {
  if (portfolioTop !== null && portfolioTop <= viewportHeight * LOWER_SECTION_ACTIVE_RATIO) {
    return "portfolio";
  }

  if (introTop <= viewportHeight * INTRO_SECTION_ACTIVE_RATIO) {
    return "intro";
  }

  if (manifestoTop <= viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    return "manifesto";
  }

  return "home";
}

export function getNextHomeAmbientPaused(
  current: boolean,
  nextSection: HeroSection,
  introCoverProgress: number,
  manifestoTop: number,
  viewportHeight: number,
) {
  const shouldPauseAmbient = nextSection !== "home" || introCoverProgress > 0.01;

  if (shouldPauseAmbient) {
    return true;
  }

  const ambientResumeThreshold = viewportHeight * AMBIENT_RESUME_RATIO;
  return manifestoTop < ambientResumeThreshold ? current : false;
}

export function getSnapCandidate(
  viewportHeight: number,
  snappedSections: Record<SnapSectionKey, boolean>,
  manifestoTop: number,
  introTop: number,
  portfolioTop: number | null,
  manifestoRevealComplete: boolean,
) {
  const candidates = [
    { key: "manifesto" as const, top: manifestoTop, enabled: true },
    { key: "sheet" as const, top: introTop, enabled: manifestoRevealComplete },
    ...(portfolioTop === null ? [] : [{ key: "portfolio" as const, top: portfolioTop, enabled: true }]),
  ];

  return (
    candidates.find(
      ({ key, top, enabled }) =>
        enabled &&
        !snappedSections[key] &&
        top <= viewportHeight * SNAP_ENTRY_MAX_RATIO &&
        top > viewportHeight * SNAP_ENTRY_MIN_RATIO,
    ) ?? null
  );
}

export function syncHeroSceneVisualState({
  metrics,
  isHeroRetiredRef,
  setIsHeroRetired,
  setCoverProgress,
  setActiveSection,
  isHomeAmbientPausedRef,
  setIsHomeAmbientPaused,
  previousScrollYRef,
}: {
  metrics: HeroSceneMetrics;
  isHeroRetiredRef: MutableRefObject<boolean>;
  setIsHeroRetired: (nextValue: boolean) => void;
  setCoverProgress: Dispatch<SetStateAction<number>>;
  setActiveSection: Dispatch<SetStateAction<HeroSection>>;
  isHomeAmbientPausedRef: MutableRefObject<boolean>;
  setIsHomeAmbientPaused: (nextValue: boolean) => void;
  previousScrollYRef: MutableRefObject<number>;
}) {
  // AI_CONTEXT:
  // Consume a metrics snapshot and push only derived visual/runtime state outward.
  // DOM reads must happen before this helper is called.
  setCoverProgress(metrics.introCoverProgress);

  const nextIsHeroRetired = getNextHeroRetired(
    isHeroRetiredRef.current,
    metrics.manifestoTop,
    metrics.viewportHeight,
  );
  setIsHeroRetired(nextIsHeroRetired);

  const nextSection = getActiveHeroSection(
    metrics.viewportHeight,
    metrics.manifestoTop,
    metrics.introTop,
    metrics.portfolioTop,
  );
  setActiveSection(nextSection);

  const nextIsHomeAmbientPaused = getNextHomeAmbientPaused(
    isHomeAmbientPausedRef.current,
    nextSection,
    metrics.introCoverProgress,
    metrics.manifestoTop,
    metrics.viewportHeight,
  );
  setIsHomeAmbientPaused(nextIsHomeAmbientPaused);

  previousScrollYRef.current = metrics.scrollY;
}

export function resetSnappedSections(
  snappedSectionsRef: MutableRefObject<Record<SnapSectionKey, boolean>>,
  viewportHeight: number,
  manifestoTop: number,
  introTop: number,
  portfolioTop: number | null,
) {
  // AI_CONTEXT: once a section leaves the activation window, it becomes eligible for future snap behavior again.
  if (manifestoTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    snappedSectionsRef.current.manifesto = false;
  }

  if (introTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    snappedSectionsRef.current.sheet = false;
  }

  if (portfolioTop !== null && portfolioTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    snappedSectionsRef.current.portfolio = false;
  }
}

export function clearSnapReleaseTimeout(snapReleaseTimeoutRef: MutableRefObject<number | null>) {
  const snapReleaseTimeout = snapReleaseTimeoutRef.current;

  if (snapReleaseTimeout === null) {
    return;
  }

  window.clearTimeout(snapReleaseTimeout);
  snapReleaseTimeoutRef.current = null;
}

export function armScrollTransitionGuard(
  isAutoSnappingRef: MutableRefObject<boolean>,
  snapReleaseTimeoutRef: MutableRefObject<number | null>,
  delay: number,
) {
  // AI_CONTEXT: prevents overlapping auto-snap/manual-jump transitions.
  clearSnapReleaseTimeout(snapReleaseTimeoutRef);
  isAutoSnappingRef.current = true;

  snapReleaseTimeoutRef.current = window.setTimeout(() => {
    isAutoSnappingRef.current = false;
    snapReleaseTimeoutRef.current = null;
  }, delay);
}

function snapSceneToTop({
  targetTop,
  lenis,
  prefersReducedMotion,
  isAutoSnappingRef,
  snapReleaseTimeoutRef,
}: {
  targetTop: number;
  lenis: Lenis | null;
  prefersReducedMotion: boolean;
  isAutoSnappingRef: MutableRefObject<boolean>;
  snapReleaseTimeoutRef: MutableRefObject<number | null>;
}) {
  armScrollTransitionGuard(
    isAutoSnappingRef,
    snapReleaseTimeoutRef,
    prefersReducedMotion ? 0 : 560,
  );

  if (lenis && !prefersReducedMotion) {
    lenis.scrollTo(targetTop, {
      duration: 1,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      lock: true,
      force: true,
      onComplete: () => {
        isAutoSnappingRef.current = false;
        clearSnapReleaseTimeout(snapReleaseTimeoutRef);
      },
    });
  } else {
    window.scrollTo({
      top: targetTop,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }
}

export function maybeSnapToNextSection({
  metrics,
  snappedSectionsRef,
  isAutoSnappingRef,
  lenis,
  prefersReducedMotion,
  snapReleaseTimeoutRef,
}: {
  metrics: HeroSceneMetrics;
  snappedSectionsRef: MutableRefObject<Record<SnapSectionKey, boolean>>;
  isAutoSnappingRef: MutableRefObject<boolean>;
  lenis: Lenis | null;
  prefersReducedMotion: boolean;
  snapReleaseTimeoutRef: MutableRefObject<number | null>;
}) {
  // AI_CONTEXT: auto-snap is intentionally conservative and only runs while scrolling downward.
  if (isAutoSnappingRef.current || !metrics.isScrollingDown) {
    return;
  }

  const snapCandidate = getSnapCandidate(
    metrics.viewportHeight,
    snappedSectionsRef.current,
    metrics.manifestoTop,
    metrics.introTop,
    metrics.portfolioTop,
    metrics.manifestoRevealComplete,
  );

  if (!snapCandidate) {
    return;
  }

  snappedSectionsRef.current[snapCandidate.key] = true;
  snapSceneToTop({
    targetTop: metrics.scrollY + snapCandidate.top,
    lenis,
    prefersReducedMotion,
    isAutoSnappingRef,
    snapReleaseTimeoutRef,
  });
}
