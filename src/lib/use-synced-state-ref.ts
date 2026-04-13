"use client";

/**
 * AI_NOTE:
 * Role: tiny helper for state values that also need an always-current ref mirror.
 * Use sparingly for runtime/orchestration cases where stale closures would otherwise be risky.
 */

import { useCallback, useRef, useState } from "react";

export function useSyncedStateRef<T>(initialValue: T) {
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
