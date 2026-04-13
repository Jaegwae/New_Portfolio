"use client";

/**
 * AI_NOTE:
 * Role: manifesto lock helpers and listener hook.
 * Pure threshold math and scroll helpers live beside the hook because this module owns the full manifesto-lock contract.
 */

import type Lenis from "lenis";
import { useLayoutEffect, type MutableRefObject, type RefObject } from "react";

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

const MANIFESTO_LOCK_DISTANCE_RATIO = 5;
const MANIFESTO_RELEASE_SCROLL_RATIO = 0.06;
const MANIFESTO_SECTION_ACTIVE_RATIO = 0.62;
const MANIFESTO_LOCK_TRIGGER_RATIO = 0.02;
const INTRO_LOCK_READY_RATIO = 0.96;

export function releaseManifestoLockState(lockRef: { current: boolean }, lenis: Lenis | null) {
  // AI_CONTEXT: unlocking always means 'allow normal document scrolling again'.
  lockRef.current = false;
  lenis?.start();
}

export function syncManifestoProgress(
  progressRef: MutableRefObject<number>,
  setProgress: (nextProgress: number) => void,
  nextProgress: number,
) {
  // AI_CONTEXT:
  // Runtime uses refs for immediate reads and state setters for rendering.
  // This helper keeps both surfaces aligned without redundant renders.
  const clampedProgress = clampManifestoProgress(nextProgress);

  if (clampedProgress === progressRef.current) {
    return;
  }

  progressRef.current = clampedProgress;
  setProgress(clampedProgress);
}

export function clampManifestoProgress(progress: number) {
  return clamp(progress, 0, 1);
}

export function getManifestoScrollAmount(viewportHeight: number, deltaMagnitude: number) {
  return clamp(
    Math.max(deltaMagnitude, viewportHeight * MANIFESTO_RELEASE_SCROLL_RATIO),
    viewportHeight * 0.04,
    viewportHeight * 0.14,
  );
}

export function getManifestoLockEligibility(
  viewportHeight: number,
  manifestoTop: number,
  introTop: number,
  currentProgress: number,
) {
  return (
    manifestoTop <= viewportHeight * MANIFESTO_LOCK_TRIGGER_RATIO &&
    introTop >= viewportHeight * INTRO_LOCK_READY_RATIO &&
    currentProgress < 1
  );
}

export function shouldHandleManifestoLockInput(lockEligible: boolean, lockActive: boolean, prefersReducedMotion: boolean) {
  return (lockEligible || lockActive) && !prefersReducedMotion;
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
  const scrollAmount = getManifestoScrollAmount(viewportHeight, deltaMagnitude);
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

export function syncManifestoLockEligibility({
  prefersReducedMotion,
  viewportHeight,
  manifestoTop,
  introTop,
  lenis,
  manifestoLockEligibleRef,
  manifestoLockActiveRef,
  manifestoWordProgressRef,
  setManifestoLockEligible,
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
  setManifestoLockEligible: (nextValue: boolean) => void;
  setManifestoWordProgress: (nextValue: number) => void;
}) {
  // AI_CONTEXT: main eligibility gate used during scroll-sync before input interception can happen.
  if (prefersReducedMotion) {
    manifestoLockEligibleRef.current = false;
    setManifestoLockEligible(false);
    releaseManifestoLockState(manifestoLockActiveRef, lenis);
    syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, 1);
    return true;
  }

  if (manifestoTop > viewportHeight * MANIFESTO_SECTION_ACTIVE_RATIO) {
    manifestoLockEligibleRef.current = false;
    setManifestoLockEligible(false);
    releaseManifestoLockState(manifestoLockActiveRef, lenis);
    syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, 0);
    return false;
  }

  manifestoLockEligibleRef.current = getManifestoLockEligibility(
    viewportHeight,
    manifestoTop,
    introTop,
    manifestoWordProgressRef.current,
  );
  setManifestoLockEligible(manifestoLockEligibleRef.current);

  return manifestoWordProgressRef.current >= 1;
}

type ManifestoLockInteractionsOptions = {
  lenis: Lenis | null;
  lockEligible: boolean;
  lockActive: boolean;
  prefersReducedMotion: boolean;
  manifestoAnchorRef: RefObject<HTMLDivElement | null>;
  manifestoLockEligibleRef: MutableRefObject<boolean>;
  manifestoLockActiveRef: MutableRefObject<boolean>;
  manifestoWordProgressRef: MutableRefObject<number>;
  touchYRef: MutableRefObject<number | null>;
  setManifestoLockActive: (nextValue: boolean) => void;
  setManifestoWordProgress: (nextValue: number) => void;
};

export function useManifestoLockInteractions({
  lenis,
  lockEligible,
  lockActive,
  prefersReducedMotion,
  manifestoAnchorRef,
  manifestoLockEligibleRef,
  manifestoLockActiveRef,
  manifestoWordProgressRef,
  touchYRef,
  setManifestoLockActive,
  setManifestoWordProgress,
}: ManifestoLockInteractionsOptions) {
  useLayoutEffect(() => {
    // AI_CONTEXT:
    // This hook owns the capture-phase wheel/touch listeners for manifesto locking.
    // Keep the event interception policy here instead of duplicating it in runtime hooks.
    if (prefersReducedMotion) {
      touchYRef.current = null;
      return;
    }

    const advanceManifestoProgress = (deltaY: number) => {
      // AI_CONTEXT:
      // Positive delta advances the reveal; negative delta rewinds it and can hand control back to document scrolling.
      if (prefersReducedMotion) {
        return;
      }

      const viewportHeight = window.innerHeight || 1;
      const lockDistance = viewportHeight * MANIFESTO_LOCK_DISTANCE_RATIO;
      let currentProgress = manifestoWordProgressRef.current;

      if (deltaY > 0) {
        if (!manifestoLockActiveRef.current && currentProgress < 1) {
          pinManifestoToViewport(manifestoAnchorRef, manifestoLockActiveRef, lenis);
          setManifestoLockActive(true);
          currentProgress = manifestoWordProgressRef.current;
        }

        const nextProgress = clampManifestoProgress(currentProgress + deltaY / lockDistance);
        syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, nextProgress);

        if (nextProgress >= 1) {
          releaseManifestoLockState(manifestoLockActiveRef, lenis);
          setManifestoLockActive(false);
          nudgeManifestoDocumentScroll(1, deltaY, lenis);
        }

        return;
      }

      if (currentProgress > 0) {
        if (!manifestoLockActiveRef.current) {
          pinManifestoToViewport(manifestoAnchorRef, manifestoLockActiveRef, lenis);
          setManifestoLockActive(true);
          currentProgress = manifestoWordProgressRef.current;
        }

        const nextProgress = clampManifestoProgress(currentProgress + deltaY / lockDistance);
        syncManifestoProgress(manifestoWordProgressRef, setManifestoWordProgress, nextProgress);

        if (nextProgress <= 0) {
          releaseManifestoLockState(manifestoLockActiveRef, lenis);
          setManifestoLockActive(false);
          nudgeManifestoDocumentScroll(-1, Math.abs(deltaY), lenis);
        }

        return;
      }

      releaseManifestoLockState(manifestoLockActiveRef, lenis);
      setManifestoLockActive(false);
      nudgeManifestoDocumentScroll(-1, Math.abs(deltaY), lenis);
    };

    const isLockInputActive = () =>
      shouldHandleManifestoLockInput(
        lockEligible || manifestoLockEligibleRef.current,
        lockActive || manifestoLockActiveRef.current,
        prefersReducedMotion,
      );

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
    lockActive,
    lockEligible,
    manifestoAnchorRef,
    manifestoLockEligibleRef,
    manifestoLockActiveRef,
    manifestoWordProgressRef,
    prefersReducedMotion,
    touchYRef,
    setManifestoLockActive,
    setManifestoWordProgress,
  ]);
}
