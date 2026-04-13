/**
 * AI_NOTE:
 * Role: fixed section navigation UI for the HOME route.
 * Navigation metadata comes from src/lib/hero-scene-motion.ts.
 */

import type { HeroSection } from "@/lib/hero-scene-motion";
import { SECTION_NAV_ITEMS } from "@/lib/hero-scene-motion";

type HeroSectionNavProps = {
  activeSection: HeroSection;
  onNavigate: (section: HeroSection) => void;
};

export function HeroSectionNav({ activeSection, onNavigate }: HeroSectionNavProps) {
  // AI_CONTEXT:
  // Local state is intentionally absent here.
  // The nav is a pure view over runtime-provided section metadata and active state.
  return (
    <nav aria-label="Section navigation" className="section-nav">
      <span aria-hidden="true" className="section-nav__line" />
      {SECTION_NAV_ITEMS.map(({ section, label }) => (
        <button
          key={section}
          className={`section-nav__item${activeSection === section ? " is-active" : ""}`}
          onClick={() => onNavigate(section)}
          type="button"
        >
          <span className="section-nav__label">{label}</span>
          <span aria-hidden="true" className="section-nav__dot" />
        </button>
      ))}
    </nav>
  );
}
