"use client";

/**
 * AI_NOTE:
 * Role: minimal body scroll-lock side effect for modal/dialog usage.
 * Keep it generic and free of modal-specific focus logic.
 */

import { useEffect } from "react";

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) {
      return;
    }

    // AI_CONTEXT: remember the previous value so cleanup is safe even if other code touched body overflow.
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [locked]);
}
