"use client";

import { useSyncExternalStore } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * AI_NOTE:
 * This module is the single source of truth for reduced-motion preference.
 * Keep browser subscription details here so motion-aware code can stay declarative.
 */
function canReadMatchMedia() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function";
}

function getSnapshot() {
  if (!canReadMatchMedia()) {
    return false;
  }

  return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function subscribe(onStoreChange: () => void) {
  if (!canReadMatchMedia()) {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  const handleChange = () => {
    onStoreChange();
  };

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
}

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
