"use client";

/**
 * AI_NOTE:
 * Role: final composition layer for the HOME route.
 * Keep orchestration in lib hooks and keep this file focused on render structure.
 */

import { useMemo, type CSSProperties } from "react";

import { AboutSheet } from "@/components/about-sheet";
import { HeroFluidBackground } from "@/components/hero-fluid-background";
import { HeroProfile } from "@/components/hero-profile";
import { HeroSectionNav } from "@/components/hero-section-nav";
import { ManifestoSection } from "@/components/manifesto-section";
import { PortfolioSection } from "@/components/portfolio-section";
import { RotatingRoleInner } from "@/components/rotating-role";
import { useLenis } from "@/components/smooth-scroll-provider";
import { usePrefersReducedMotion } from "@/lib/use-prefers-reduced-motion";
import { useHeroSceneRuntime } from "@/lib/use-hero-scene-runtime";

export function HeroScene() {
  // AI_CONTEXT:
  // This component should stay thin.
  // Runtime logic belongs in src/lib hooks; this file should mostly express final layout and composition.
  const lenis = useLenis();
  const prefersReducedMotion = usePrefersReducedMotion();
  const {
    activeSection,
    coverProgress,
    isHeroRetired,
    isHomeAmbientPaused,
    manifestoWordProgress,
    manifestoAnchorRef,
    portfolioAnchorRef,
    scrollToSection,
    sheetAnchorRef,
  } = useHeroSceneRuntime(lenis, prefersReducedMotion);

  // AI_CONTEXT:
  // CSS variables are the runtime-to-style handshake for the hero shell.
  // Keep only derived visual state here; do not move content logic into CSS vars.
  const heroPageStyle = useMemo(
    () =>
      ({
        "--cover-progress": coverProgress,
        "--surface-phase": activeSection === "portfolio" || (activeSection === "intro" && coverProgress >= 0.38) ? 1 : 0,
      }) as CSSProperties,
    [activeSection, coverProgress],
  );

  return (
    <main className="hero-page" style={heroPageStyle}>
      {/* AI_CONTEXT: fixed section nav driven entirely by runtime-derived active section state */}
      <HeroSectionNav activeSection={activeSection} onNavigate={scrollToSection} />

      {/* AI_CONTEXT: the hero remains mounted while later sections scroll underneath it */}
      <section className={`hero-stage${isHeroRetired ? " is-retired" : ""}${isHomeAmbientPaused ? " is-ambient-paused" : ""}`}>
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

          <HeroProfile />
        </div>
        <div aria-hidden="true" className="hero-scroll">
          <span className="hero-scroll__mouse" />
        </div>
      </section>

      {/* AI_CONTEXT: these anchors are the DOM measurement targets used by the hero runtime hooks */}
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
