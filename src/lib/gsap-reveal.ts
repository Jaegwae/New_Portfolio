"use client";

/**
 * AI_NOTE:
 * Role: shared GSAP ScrollTrigger reveal helper for editorial sections.
 * This hook should stay generic; section-specific thresholds belong in the calling component.
 */

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useEffectEvent } from "react";

import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";

type ScrollRevealTarget = {
  // AI_CONTEXT: `element` is nullable because refs are gathered before the DOM is fully ready.
  element: HTMLElement | null;
  trigger?: Element | string;
  fromY: number;
  toY?: number;
  start: string;
  end: string;
  scrub?: boolean | number;
  opacityFrom?: number;
  opacityTo?: number;
};

let hasRegisteredGsap = false;

function ensureGsapRegistered() {
  if (hasRegisteredGsap) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  hasRegisteredGsap = true;
}

function clearRevealStyles(element: HTMLElement) {
  gsap.set(element, {
    clearProps: "opacity,transform",
  });
}

export function useGsapScrollReveal(resolveTargets: () => ScrollRevealTarget[]) {
  const getTargets = useEffectEvent(resolveTargets);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    ensureGsapRegistered();

    // AI_CONTEXT:
    // Filter once so downstream GSAP code can assume real HTMLElements only.
    const targets = getTargets().filter(
      (target): target is ScrollRevealTarget & { element: HTMLElement } => target.element instanceof HTMLElement,
    );

    if (prefersReducedMotion) {
      // AI_CONTEXT: reduced-motion path must leave content immediately readable with no residual transforms.
      targets.forEach(({ element }) => {
        clearRevealStyles(element);
      });

      return;
    }

    const context = gsap.context(() => {
      // AI_CONTEXT:
      // Each caller owns its own thresholds; this helper only wires the shared reveal mechanics.
      targets.forEach(
        ({
          element,
          trigger,
          fromY,
          toY = 0,
          start,
          end,
          scrub = true,
          opacityFrom = 0,
          opacityTo = 1,
        }) => {
          gsap.fromTo(
            element,
            {
              y: fromY,
              opacity: opacityFrom,
            },
            {
              y: toY,
              opacity: opacityTo,
              ease: "none",
              overwrite: "auto",
              scrollTrigger: {
                trigger: trigger ?? element,
                start,
                end,
                scrub,
                invalidateOnRefresh: true,
              },
            },
          );
        },
      );
    });

    return () => {
      context.revert();
    };
  }, [prefersReducedMotion]);
}
