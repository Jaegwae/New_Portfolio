"use client";

/**
 * AI_NOTE:
 * Role: generic keyboard focus trap for modal-like containers.
 * Keep selector rules centralized here so modal components stay mostly declarative.
 */

import { useEffect, type RefObject } from "react";

const DEFAULT_FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

type UseFocusTrapOptions = {
  active: boolean;
  containerRef: RefObject<HTMLElement | null>;
  initialFocusRef?: RefObject<HTMLElement | null>;
  onEscape?: () => void;
};

function getFocusableElements(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(DEFAULT_FOCUSABLE_SELECTOR)).filter(
    (element) => !element.hasAttribute("disabled") && element.getAttribute("aria-hidden") !== "true",
  );
}

export function useFocusTrap({ active, containerRef, initialFocusRef, onEscape }: UseFocusTrapOptions) {
  useEffect(() => {
    if (!active) {
      return;
    }

    // AI_CONTEXT: initial focus is deferred to the next frame so the modal DOM is fully committed first.
    const focusInitialTarget = () => {
      initialFocusRef?.current?.focus();
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onEscape?.();
        return;
      }

      if (event.key !== "Tab") {
        return;
      }

      const container = containerRef.current;

      if (!container) {
        // AI_CONTEXT: fallback to the initial target if the container ref is temporarily unavailable.
        event.preventDefault();
        focusInitialTarget();
        return;
      }

      const focusableElements = getFocusableElements(container);

      if (focusableElements.length === 0) {
        // AI_CONTEXT: even an empty modal shell should retain keyboard focus inside itself.
        event.preventDefault();
        focusInitialTarget();
        return;
      }

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];
      const activeElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const isFocusInsideContainer = !!activeElement && container.contains(activeElement);

      if (event.shiftKey) {
        if (!isFocusInsideContainer || activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        }

        return;
      }

      if (!isFocusInsideContainer || activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.requestAnimationFrame(focusInitialTarget);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [active, containerRef, initialFocusRef, onEscape]);
}
