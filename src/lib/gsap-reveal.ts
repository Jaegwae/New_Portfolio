"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useEffectEvent } from "react";

type ScrollRevealTarget = {
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

  useEffect(() => {
    ensureGsapRegistered();

    const mediaMatcher = gsap.matchMedia();

    mediaMatcher.add(
      {
        reduce: "(prefers-reduced-motion: reduce)",
        noReduce: "(prefers-reduced-motion: no-preference)",
      },
      (context) => {
        const conditions = context.conditions as {
          reduce?: boolean;
        };
        const targets = getTargets().filter(
          (target): target is ScrollRevealTarget & { element: HTMLElement } => target.element instanceof HTMLElement,
        );

        if (conditions.reduce) {
          targets.forEach(({ element }) => {
            clearRevealStyles(element);
          });
          return;
        }

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
      },
    );

    return () => {
      mediaMatcher.revert();
    };
  }, []);
}
