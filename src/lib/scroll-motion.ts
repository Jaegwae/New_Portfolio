"use client";

import type Lenis from "lenis";
import { useEffect, useEffectEvent } from "react";

import { useLenis } from "@/components/smooth-scroll-provider";

type ScrollSceneContext = {
  prefersReducedMotion: boolean;
};

type RevealStyleConfig = {
  enterOffset: number;
  exitOffset: number;
  fadeInStart: number;
  fadeInEnd: number;
};

export const DEFAULT_SECTION_TITLE_REVEAL = {
  enterOffset: 58,
  exitOffset: 42,
  fadeInStart: 0.04,
  fadeInEnd: 0.22,
} as const satisfies RevealStyleConfig;

type ScrollSceneSubscriber = (context: ScrollSceneContext) => void;

const scrollSceneSubscribers = new Set<ScrollSceneSubscriber>();
let scrollSceneMediaQuery: MediaQueryList | null = null;
let scrollSceneFrameId = 0;
let activeLenis: Lenis | null = null;
let removeLenisScrollListener: (() => void) | undefined;
let hasWindowScrollListener = false;

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function resetRevealStyles(node: HTMLElement) {
  node.style.setProperty("--reveal-shift", "0px");
  node.style.setProperty("--reveal-opacity", "1");
}

export function applyRevealStyles(
  node: HTMLElement,
  viewportHeight: number,
  { enterOffset, exitOffset, fadeInStart, fadeInEnd }: RevealStyleConfig,
) {
  const rect = node.getBoundingClientRect();
  const progress = clamp((viewportHeight - rect.top) / (viewportHeight + rect.height), 0, 1);
  const shift = enterOffset - (enterOffset + exitOffset) * progress;
  const opacity = clamp((progress - fadeInStart) / (fadeInEnd - fadeInStart), 0, 1);

  node.style.setProperty("--reveal-shift", `${shift.toFixed(2)}px`);
  node.style.setProperty("--reveal-opacity", opacity.toFixed(3));
}

function notifyScrollSceneSubscribers() {
  if (!scrollSceneMediaQuery) {
    return;
  }

  const context = {
    prefersReducedMotion: scrollSceneMediaQuery.matches,
  };

  scrollSceneSubscribers.forEach((subscriber) => {
    subscriber(context);
  });
}

function requestScrollSceneUpdate() {
  if (scrollSceneFrameId !== 0) {
    return;
  }

  scrollSceneFrameId = window.requestAnimationFrame(() => {
    scrollSceneFrameId = 0;
    notifyScrollSceneSubscribers();
  });
}

function detachWindowScrollListener() {
  if (!hasWindowScrollListener) {
    return;
  }

  window.removeEventListener("scroll", requestScrollSceneUpdate);
  hasWindowScrollListener = false;
}

function bindScrollSource(lenis: Lenis | null) {
  if (activeLenis === lenis && (lenis ? removeLenisScrollListener : hasWindowScrollListener)) {
    return;
  }

  removeLenisScrollListener?.();
  removeLenisScrollListener = undefined;
  detachWindowScrollListener();
  activeLenis = lenis;

  if (lenis) {
    removeLenisScrollListener = lenis.on("scroll", requestScrollSceneUpdate);
    return;
  }

  window.addEventListener("scroll", requestScrollSceneUpdate, { passive: true });
  hasWindowScrollListener = true;
}

function startScrollSceneRuntime(lenis: Lenis | null) {
  if (!scrollSceneMediaQuery) {
    scrollSceneMediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("resize", requestScrollSceneUpdate);
    scrollSceneMediaQuery.addEventListener("change", requestScrollSceneUpdate);
  }

  bindScrollSource(lenis);
  requestScrollSceneUpdate();
}

function stopScrollSceneRuntime() {
  if (scrollSceneFrameId !== 0) {
    window.cancelAnimationFrame(scrollSceneFrameId);
    scrollSceneFrameId = 0;
  }

  removeLenisScrollListener?.();
  removeLenisScrollListener = undefined;
  detachWindowScrollListener();

  if (scrollSceneMediaQuery) {
    scrollSceneMediaQuery.removeEventListener("change", requestScrollSceneUpdate);
    window.removeEventListener("resize", requestScrollSceneUpdate);
    scrollSceneMediaQuery = null;
  }

  activeLenis = null;
}

function subscribeToScrollScene(subscriber: ScrollSceneSubscriber, lenis: Lenis | null) {
  scrollSceneSubscribers.add(subscriber);
  startScrollSceneRuntime(lenis);

  return () => {
    scrollSceneSubscribers.delete(subscriber);

    if (scrollSceneSubscribers.size === 0) {
      stopScrollSceneRuntime();
    }
  };
}

export function useScrollScene(update: (context: ScrollSceneContext) => void) {
  const lenis = useLenis();
  const handleUpdate = useEffectEvent((context: ScrollSceneContext) => {
    update(context);
  });

  useEffect(() => {
    return subscribeToScrollScene(handleUpdate, lenis);
  }, [lenis]);
}
