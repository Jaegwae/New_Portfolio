"use client";

import type Lenis from "lenis";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  useCallback,
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  type CSSProperties,
  type Dispatch,
  type MutableRefObject,
  type RefObject,
  type SetStateAction,
} from "react";

import { AboutSheet } from "@/components/about-sheet";
import { HeroFluidBackground } from "@/components/hero-fluid-background";
import { ManifestoSection } from "@/components/manifesto-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { RotatingRoleInner } from "@/components/rotating-role";
import { useLenis } from "@/components/smooth-scroll-provider";

type HeroSection = "home" | "manifesto" | "intro" | "portfolio" | "about";
type SnapSectionKey = "manifesto" | "sheet" | "portfolio" | "about";
type HeroSceneMetrics = {
  viewportHeight: number;
  manifestoTop: number;
  introTop: number;
  portfolioTop: number | null;
  aboutTop: number | null;
  scrollY: number;
  isScrollingDown: boolean;
  manifestoRevealComplete: boolean;
  introCoverProgress: number;
};

function useSyncedStateRef<T>(initialValue: T) {
  const [value, setValue] = useState(initialValue);
  const valueRef = useRef(initialValue);

  const setSyncedValue = useCallback((nextValue: T) => {
    if (Object.is(valueRef.current, nextValue)) {
      return;
    }

    valueRef.current = nextValue;
    setValue(nextValue);
  }, []);

  return [value, valueRef, setSyncedValue] as const;
}

let hasRegisteredHeroSceneGsap = false;

function ensureHeroSceneGsapRegistered() {
  if (hasRegisteredHeroSceneGsap) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  hasRegisteredHeroSceneGsap = true;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const MANIFESTO_LOCK_DISTANCE_RATIO = 5;
const MANIFESTO_RELEASE_SCROLL_RATIO = 0.06;
const MANIFESTO_SECTION_ACTIVE_RATIO = 0.62;
const MANIFESTO_LOCK_TRIGGER_RATIO = 0.02;
const INTRO_LOCK_READY_RATIO = 0.96;
const INTRO_SECTION_ACTIVE_RATIO = 0.48;
const LOWER_SECTION_ACTIVE_RATIO = 0.58;
const HERO_RETIRE_RATIO = 0.06;
const AMBIENT_RESUME_RATIO = 0.82;
const SNAP_ENTRY_MAX_RATIO = 0.16;
const SNAP_ENTRY_MIN_RATIO = -0.22;
const ABOUT_OVERLAP_RATIO = 0.88;

const SECTION_NAV_ITEMS: ReadonlyArray<{
  section: HeroSection;
  label: string;
}> = [
  { section: "home", label: "HOME" },
  { section: "manifesto", label: "슬로건" },
  { section: "intro", label: "자기소개" },
  { section: "portfolio", label: "포트폴리오" },
];

const HERO_PROFILE_ITEMS: ReadonlyArray<{
  label: string;
  value: string;
  href?: string;
}> = [
  {
    label: "생년월일",
    value: "2000.03.30 (만 25세)",
  },
  {
    label: "이메일",
    value: "kimjk4031@naver.com",
    href: "mailto:kimjk4031@naver.com",
  },
  {
    label: "연락처",
    value: "010-9127-4031",
    href: "tel:01091274031",
  },
] as const;

function getIntroCoverProgress(manifestoRevealComplete: boolean, viewportHeight: number, introTop: number) {
  const introOverlapOffset = manifestoRevealComplete ? clamp(viewportHeight - introTop, 0, viewportHeight * 1.1) : 0;
  const introCoverRawProgress = clamp(introOverlapOffset / (viewportHeight * 1.04), 0, 1);
  return Math.pow(introCoverRawProgress, 1.18);
}

function getNextHeroRetired(current: boolean, manifestoTop: number, viewportHeight: number) {
  const heroRetireThreshold = -viewportHeight * HERO_RETIRE_RATIO;
  const heroRestoreThreshold = viewportHeight * HERO_RETIRE_RATIO;

  if (current) {
    return manifestoTop < heroRestoreThreshold;
  }

  return manifestoTop <= heroRetireThreshold;
}

function getActiveHeroSection(
  viewportHeight: number,
  manifestoTop: number,
  introTop: number,
  portfolioTop: number | null,
  aboutTop: number | null,
): HeroSection {
  if (aboutTop !== null && aboutTop <= viewportHeight * LOWER_SECTION_ACTIVE_RATIO) {
    return "about";
  }

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

function getNextHomeAmbientPaused(
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

function getPortfolioFadeProgress(viewportHeight: number, aboutTop: number | null) {
  if (aboutTop === null) {
    return 0;
  }

  return clamp((viewportHeight - aboutTop) / (viewportHeight * ABOUT_OVERLAP_RATIO), 0, 1);
}

function getSnapCandidate(
  viewportHeight: number,
  snappedSections: Record<SnapSectionKey, boolean>,
  manifestoTop: number,
  introTop: number,
  portfolioTop: number | null,
  aboutTop: number | null,
  manifestoRevealComplete: boolean,
) {
  const candidates = [
    { key: "manifesto" as const, top: manifestoTop, enabled: true },
    { key: "sheet" as const, top: introTop, enabled: manifestoRevealComplete },
    ...(portfolioTop === null ? [] : [{ key: "portfolio" as const, top: portfolioTop, enabled: true }]),
    ...(aboutTop === null ? [] : [{ key: "about" as const, top: aboutTop, enabled: true }]),
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

function releaseManifestoLockState(lockRef: { current: boolean }, lenis: Lenis | null) {
  lockRef.current = false;
  lenis?.start();
}

function syncManifestoProgress(
  progressRef: MutableRefObject<number>,
  setProgress: (nextProgress: number) => void,
  nextProgress: number,
) {
  const clampedProgress = clamp(nextProgress, 0, 1);

  if (clampedProgress === progressRef.current) {
    return;
  }

  progressRef.current = clampedProgress;
  setProgress(clampedProgress);
}

function pinManifestoToViewport(
  manifestoAnchorRef: RefObject<HTMLDivElement | null>,
  manifestoLockActiveRef: MutableRefObject<boolean>,
  lenis: Lenis | null,
) {
  const manifestoAnchor = manifestoAnchorRef.current;

  if (!manifestoAnchor) {
    return;
  }

  const targetTop = window.scrollY + manifestoAnchor.getBoundingClientRect().top;
  manifestoLockActiveRef.current = true;

  if (lenis) {
    lenis.stop();
    lenis.scrollTo(targetTop, {
      immediate: true,
      force: true,
    });
    return;
  }

  window.scrollTo({
    top: targetTop,
    behavior: "auto",
  });
}

function nudgeManifestoDocumentScroll(direction: 1 | -1, deltaMagnitude: number, lenis: Lenis | null) {
  const viewportHeight = window.innerHeight || 1;
  const scrollAmount = clamp(
    Math.max(deltaMagnitude, viewportHeight * MANIFESTO_RELEASE_SCROLL_RATIO),
    viewportHeight * 0.04,
    viewportHeight * 0.14,
  );
  const targetTop = Math.max(0, window.scrollY + direction * scrollAmount);

  if (lenis) {
    lenis.start();
    lenis.scrollTo(targetTop, {
      duration: 0.58,
      easing: (t) => 1 - Math.pow(1 - t, 3),
      lock: true,
      force: true,
    });
    return;
  }

  window.scrollTo({
    top: targetTop,
    behavior: "auto",
  });
}

function syncManifestoLockEligibility({
  prefersReducedMotion,
  viewportHeight,
  manifestoTop,
  introTop,
  lenis,
  manifestoLockEligibleRef,
  manifestoLockActiveRef,
  manifestoWordProgressRef,
  setManifestoWordProgress,
}: {
  prefersReducedMotion: boolean;
  viewportHeight: number;
  manifestoTop: number;
  introTop: number;
  lenis: Lenis | null;
  manifestoLockEligibleRef: MutableRefObject<boolean>;
  manifestoLockActiveRef: MutableRefObject<boolean>;
  manifestoWordProgressRef: MutableRefObject<number>;
  setManifestoWordProgress: (nextValue: number) => void;
}) {
  if (prefersReducedMotion) {
    manifestoLockEligibleRef.current = false;
    releaseManifestoLockState(manifestoLockActiveRef, lenis);
    syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, 1);
    return true;
  }

  if (manifestoTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    manifestoLockEligibleRef.current = false;
    releaseManifestoLockState(manifestoLockActiveRef, lenis);
    syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, 0);
    return false;
  }

  manifestoLockEligibleRef.current =
    manifestoTop <= viewportHeight * MANIFESTO_LOCK_TRIGGER_RATIO &&
    introTop >= viewportHeight * INTRO_LOCK_READY_RATIO &&
    manifestoWordProgressRef.current < 1;

  return manifestoWordProgressRef.current >= 1;
}

function syncHeroSceneVisualState({
  metrics,
  isHeroRetiredRef,
  setIsHeroRetired,
  setCoverProgress,
  setPortfolioFadeProgress,
  setActiveSection,
  isHomeAmbientPausedRef,
  setIsHomeAmbientPaused,
  isHeroAmbientSettledRef,
  setIsHeroAmbientSettled,
  previousScrollYRef,
}: {
  metrics: HeroSceneMetrics;
  isHeroRetiredRef: MutableRefObject<boolean>;
  setIsHeroRetired: (nextValue: boolean) => void;
  setCoverProgress: Dispatch<SetStateAction<number>>;
  setPortfolioFadeProgress: Dispatch<SetStateAction<number>>;
  setActiveSection: Dispatch<SetStateAction<HeroSection>>;
  isHomeAmbientPausedRef: MutableRefObject<boolean>;
  setIsHomeAmbientPaused: (nextValue: boolean) => void;
  isHeroAmbientSettledRef: MutableRefObject<boolean>;
  setIsHeroAmbientSettled: (nextValue: boolean) => void;
  previousScrollYRef: MutableRefObject<number>;
}) {
  setCoverProgress(metrics.introCoverProgress);

  const nextIsHeroRetired = getNextHeroRetired(
    isHeroRetiredRef.current,
    metrics.manifestoTop,
    metrics.viewportHeight,
  );
  setIsHeroRetired(nextIsHeroRetired);

  setPortfolioFadeProgress(getPortfolioFadeProgress(metrics.viewportHeight, metrics.aboutTop));

  const nextSection = getActiveHeroSection(
    metrics.viewportHeight,
    metrics.manifestoTop,
    metrics.introTop,
    metrics.portfolioTop,
    metrics.aboutTop,
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

  if (!isHeroAmbientSettledRef.current && (nextSection !== "home" || metrics.introCoverProgress > 0.01)) {
    setIsHeroAmbientSettled(true);
  }

  previousScrollYRef.current = metrics.scrollY;

  return nextSection;
}

function resetSnappedSections(
  snappedSectionsRef: MutableRefObject<Record<SnapSectionKey, boolean>>,
  viewportHeight: number,
  manifestoTop: number,
  introTop: number,
  portfolioTop: number | null,
  aboutTop: number | null,
) {
  if (manifestoTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    snappedSectionsRef.current.manifesto = false;
  }

  if (introTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    snappedSectionsRef.current.sheet = false;
  }

  if (portfolioTop !== null && portfolioTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    snappedSectionsRef.current.portfolio = false;
  }

  if (aboutTop !== null && aboutTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    snappedSectionsRef.current.about = false;
  }
}

function clearSnapReleaseTimeout(snapReleaseTimeoutRef: MutableRefObject<number | null>) {
  const snapReleaseTimeout = snapReleaseTimeoutRef.current;

  if (snapReleaseTimeout === null) {
    return;
  }

  window.clearTimeout(snapReleaseTimeout);
  snapReleaseTimeoutRef.current = null;
}

function armScrollTransitionGuard(
  isAutoSnappingRef: MutableRefObject<boolean>,
  snapReleaseTimeoutRef: MutableRefObject<number | null>,
  delay: number,
) {
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

function maybeSnapToNextSection({
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
  if (isAutoSnappingRef.current || !metrics.isScrollingDown) {
    return;
  }

  const snapCandidate = getSnapCandidate(
    metrics.viewportHeight,
    snappedSectionsRef.current,
    metrics.manifestoTop,
    metrics.introTop,
    metrics.portfolioTop,
    metrics.aboutTop,
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

type ManifestoLockInteractionsOptions = {
  lenis: Lenis | null;
  manifestoAnchorRef: RefObject<HTMLDivElement | null>;
  manifestoLockEligibleRef: MutableRefObject<boolean>;
  manifestoLockActiveRef: MutableRefObject<boolean>;
  manifestoWordProgressRef: MutableRefObject<number>;
  prefersReducedMotionRef: MutableRefObject<boolean>;
  touchYRef: MutableRefObject<number | null>;
  setManifestoWordProgress: (nextValue: number) => void;
};

function useManifestoLockInteractions({
  lenis,
  manifestoAnchorRef,
  manifestoLockEligibleRef,
  manifestoLockActiveRef,
  manifestoWordProgressRef,
  prefersReducedMotionRef,
  touchYRef,
  setManifestoWordProgress,
}: ManifestoLockInteractionsOptions) {
  useEffect(() => {
    const advanceManifestoProgress = (deltaY: number) => {
      if (prefersReducedMotionRef.current) {
        return;
      }

      const viewportHeight = window.innerHeight || 1;
      const lockDistance = viewportHeight * MANIFESTO_LOCK_DISTANCE_RATIO;
      let currentProgress = manifestoWordProgressRef.current;

      if (deltaY > 0) {
        if (!manifestoLockActiveRef.current && currentProgress < 1) {
          pinManifestoToViewport(manifestoAnchorRef, manifestoLockActiveRef, lenis);
          currentProgress = manifestoWordProgressRef.current;
        }

        const nextProgress = clamp(currentProgress + deltaY / lockDistance, 0, 1);
        syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, nextProgress);

        if (nextProgress >= 1) {
          releaseManifestoLockState(manifestoLockActiveRef, lenis);
          nudgeManifestoDocumentScroll(1, deltaY, lenis);
        }

        return;
      }

      if (currentProgress > 0) {
        if (!manifestoLockActiveRef.current) {
          pinManifestoToViewport(manifestoAnchorRef, manifestoLockActiveRef, lenis);
          currentProgress = manifestoWordProgressRef.current;
        }

        const nextProgress = clamp(currentProgress + deltaY / lockDistance, 0, 1);
        syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, nextProgress);

        if (nextProgress <= 0) {
          releaseManifestoLockState(manifestoLockActiveRef, lenis);
          nudgeManifestoDocumentScroll(-1, Math.abs(deltaY), lenis);
        }

        return;
      }

      releaseManifestoLockState(manifestoLockActiveRef, lenis);
      nudgeManifestoDocumentScroll(-1, Math.abs(deltaY), lenis);
    };

    const isLockInputActive = () =>
      (manifestoLockEligibleRef.current || manifestoLockActiveRef.current) && !prefersReducedMotionRef.current;

    const handleWheel = (event: WheelEvent) => {
      if (!isLockInputActive() || event.deltaY === 0) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      advanceManifestoProgress(event.deltaY);
    };

    const handleTouchStart = (event: TouchEvent) => {
      touchYRef.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isLockInputActive()) {
        return;
      }

      const currentY = event.touches[0]?.clientY;
      const previousY = touchYRef.current;

      if (currentY === undefined || previousY === null) {
        return;
      }

      const deltaY = previousY - currentY;

      if (deltaY === 0) {
        return;
      }

      touchYRef.current = currentY;
      event.preventDefault();
      event.stopPropagation();
      advanceManifestoProgress(deltaY);
    };

    const resetTouch = () => {
      touchYRef.current = null;
    };

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true, capture: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", resetTouch, { passive: true, capture: true });
    window.addEventListener("touchcancel", resetTouch, { passive: true, capture: true });

    return () => {
      window.removeEventListener("wheel", handleWheel, true);
      window.removeEventListener("touchstart", handleTouchStart, true);
      window.removeEventListener("touchmove", handleTouchMove, true);
      window.removeEventListener("touchend", resetTouch, true);
      window.removeEventListener("touchcancel", resetTouch, true);
    };
  }, [
    lenis,
    manifestoAnchorRef,
    manifestoLockEligibleRef,
    manifestoLockActiveRef,
    manifestoWordProgressRef,
    prefersReducedMotionRef,
    touchYRef,
    setManifestoWordProgress,
  ]);
}

export function HeroScene() {
  const lenis = useLenis();
  const manifestoAnchorRef = useRef<HTMLDivElement>(null);
  const sheetAnchorRef = useRef<HTMLDivElement>(null);
  const portfolioAnchorRef = useRef<HTMLDivElement>(null);
  const aboutFinaleAnchorRef = useRef<HTMLDivElement>(null);
  const previousScrollYRef = useRef(0);
  const snappedSectionsRef = useRef<Record<SnapSectionKey, boolean>>({
    manifesto: false,
    sheet: false,
    portfolio: false,
    about: false,
  });
  const isAutoSnappingRef = useRef(false);
  const snapReleaseTimeoutRef = useRef<number | null>(null);
  const manifestoLockEligibleRef = useRef(false);
  const manifestoLockActiveRef = useRef(false);
  const prefersReducedMotionRef = useRef(false);
  const touchYRef = useRef<number | null>(null);
  const manifestoWordProgressRef = useRef(0);
  const [coverProgress, setCoverProgress] = useState(0);
  const [isHeroRetired, isHeroRetiredRef, setIsHeroRetired] = useSyncedStateRef(false);
  const [isHeroAmbientSettled, isHeroAmbientSettledRef, setIsHeroAmbientSettled] = useSyncedStateRef(false);
  const [isHomeAmbientPaused, isHomeAmbientPausedRef, setIsHomeAmbientPaused] = useSyncedStateRef(false);
  const [manifestoWordProgress, setManifestoWordProgress] = useState(0);
  const [portfolioFadeProgress, setPortfolioFadeProgress] = useState(0);
  const [activeSection, setActiveSection] = useState<HeroSection>("home");

  const releaseManifestoLock = useCallback(() => {
    releaseManifestoLockState(manifestoLockActiveRef, lenis);
  }, [lenis]);

  const prepareManifestoForSectionJump = useCallback((section: HeroSection) => {
    manifestoLockEligibleRef.current = false;
    touchYRef.current = null;
    releaseManifestoLock();

    if (section === "home" || section === "manifesto") {
      syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, 0);
    }
  }, [manifestoWordProgressRef, releaseManifestoLock, setManifestoWordProgress]);

  useEffect(() => {
    return () => {
      clearSnapReleaseTimeout(snapReleaseTimeoutRef);

      releaseManifestoLockState(manifestoLockActiveRef, lenis);
    };
  }, [lenis]);

  useManifestoLockInteractions({
    lenis,
    manifestoAnchorRef,
    manifestoLockEligibleRef,
    manifestoLockActiveRef,
    manifestoWordProgressRef,
    prefersReducedMotionRef,
    touchYRef,
    setManifestoWordProgress,
  });

  const syncSceneFromScroll = useEffectEvent((prefersReducedMotion: boolean) => {
    const manifestoAnchor = manifestoAnchorRef.current;
    const sheetAnchor = sheetAnchorRef.current;
    const portfolioAnchor = portfolioAnchorRef.current;
    const aboutFinaleAnchor = aboutFinaleAnchorRef.current;

    if (!manifestoAnchor || !sheetAnchor) {
      return;
    }

    const manifestoRect = manifestoAnchor.getBoundingClientRect();
    const rect = sheetAnchor.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    prefersReducedMotionRef.current = prefersReducedMotion;
    const portfolioTop = portfolioAnchor?.getBoundingClientRect().top ?? null;
    const aboutTop = aboutFinaleAnchor?.getBoundingClientRect().top ?? null;
    const manifestoRevealComplete = syncManifestoLockEligibility({
      prefersReducedMotion,
      viewportHeight,
      manifestoTop: manifestoRect.top,
      introTop: rect.top,
      lenis,
      manifestoLockEligibleRef,
      manifestoLockActiveRef,
      manifestoWordProgressRef,
      setManifestoWordProgress,
    });
    const metrics: HeroSceneMetrics = {
      viewportHeight,
      manifestoTop: manifestoRect.top,
      introTop: rect.top,
      portfolioTop,
      aboutTop,
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
      setPortfolioFadeProgress,
      setActiveSection,
      isHomeAmbientPausedRef,
      setIsHomeAmbientPaused,
      isHeroAmbientSettledRef,
      setIsHeroAmbientSettled,
      previousScrollYRef,
    });

    resetSnappedSections(
      snappedSectionsRef,
      metrics.viewportHeight,
      metrics.manifestoTop,
      metrics.introTop,
      metrics.portfolioTop,
      metrics.aboutTop,
    );

    maybeSnapToNextSection({
      metrics,
      snappedSectionsRef,
      isAutoSnappingRef,
      lenis,
      prefersReducedMotion,
      snapReleaseTimeoutRef,
    });
  });

  useEffect(() => {
    ensureHeroSceneGsapRegistered();

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleSceneUpdate = () => {
      syncSceneFromScroll(mediaQuery.matches);
    };
    const handleReducedMotionChange = () => {
      ScrollTrigger.refresh();
      handleSceneUpdate();
    };
    const sceneTrigger = ScrollTrigger.create({
      start: 0,
      end: "max",
      invalidateOnRefresh: true,
      onUpdate: handleSceneUpdate,
      onRefresh: handleSceneUpdate,
    });
    const removeLenisScrollListener = lenis?.on("scroll", ScrollTrigger.update);

    mediaQuery.addEventListener("change", handleReducedMotionChange);
    handleSceneUpdate();

    return () => {
      removeLenisScrollListener?.();
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
      sceneTrigger.kill();
    };
    // Keep the effect-event dependency shape stable during Fast Refresh in dev.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lenis, syncSceneFromScroll]);

  const scrollToSection = useCallback((section: HeroSection) => {
    prepareManifestoForSectionJump(section);

    const sectionTargets = {
      manifesto: manifestoAnchorRef.current,
      intro: sheetAnchorRef.current,
      portfolio: portfolioAnchorRef.current,
      about: aboutFinaleAnchorRef.current,
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
  }, [lenis, prepareManifestoForSectionJump]);

  return (
    <main
      className="hero-page"
      style={
        {
          "--cover-progress": coverProgress,
          "--surface-phase":
            activeSection === "portfolio" || (activeSection === "intro" && coverProgress >= 0.38) ? 1 : 0,
          "--portfolio-fade-progress": portfolioFadeProgress,
        } as CSSProperties
      }
    >
      <nav aria-label="Section navigation" className="section-nav">
        <span aria-hidden="true" className="section-nav__line" />
        {SECTION_NAV_ITEMS.map(({ section, label }) => (
          <button
            key={section}
            className={`section-nav__item${activeSection === section ? " is-active" : ""}`}
            onClick={() => scrollToSection(section)}
            type="button"
          >
            <span className="section-nav__label">{label}</span>
            <span aria-hidden="true" className="section-nav__dot" />
          </button>
        ))}
      </nav>

      <section
        className={`hero-stage${isHeroRetired ? " is-retired" : ""}${isHeroAmbientSettled ? " is-ambient-settled" : ""}${isHomeAmbientPaused ? " is-ambient-paused" : ""}`}
      >
        <HeroFluidBackground paused={isHomeAmbientPaused} />
        <div className="hero-copy">
          <h1 className="hero-heading">
            <span className="hero-heading__muted">안녕하세요, 저는 </span>
            <span className="hero-heading__strong">김재관입니다.</span>
          </h1>

          <p className="hero-typed-line">
            <span className="hero-typed-line__muted">I&apos;m a </span>
            <RotatingRoleInner paused={isHomeAmbientPaused} />
          </p>

          <dl className="hero-profile">
            {HERO_PROFILE_ITEMS.map((item) => (
              <div className="hero-profile__item" key={item.label}>
                <dt className="hero-profile__label">{item.label}</dt>
                <dd className="hero-profile__value">
                  {item.href ? (
                    <a className="hero-profile__link" href={item.href}>
                      {item.value}
                    </a>
                  ) : (
                    item.value
                  )}
                </dd>
              </div>
            ))}
          </dl>

        </div>
        <div aria-hidden="true" className="hero-scroll">
          <span className="hero-scroll__mouse" />
        </div>
      </section>

      <div className="manifesto-anchor" ref={manifestoAnchorRef}>
        <ManifestoSection wordProgress={manifestoWordProgress} />
      </div>

      <div className="about-sheet-anchor" ref={sheetAnchorRef}>
        <AboutSheet />
      </div>

      <div className="portfolio-anchor" ref={portfolioAnchorRef}>
        <PortfolioSection />
      </div>

    </main>
  );
}
