"use client";

/**
 * AI_NOTE:
 * Role: remembers and restores focus when a modal-like surface closes.
 * Use this with other accessibility hooks instead of hand-rolling focus bookkeeping inside components.
 */

import { useEffect, useRef } from "react";

export function useFocusReturn(active: boolean) {
  const previousFocusedElementRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active) {
      return;
    }

    // AI_CONTEXT: capture the launcher/current focus target so keyboard users can return seamlessly on close.
    previousFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;

    return () => {
      previousFocusedElementRef.current?.focus();
      previousFocusedElementRef.current = null;
    };
  }, [active]);
}
