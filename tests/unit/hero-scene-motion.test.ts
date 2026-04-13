import { describe, expect, it } from "vitest";

import {
  getActiveHeroSection,
  getIntroCoverProgress,
  getNextHeroRetired,
  getNextHomeAmbientPaused,
  getSnapCandidate,
} from "@/lib/hero-scene-motion";

describe("hero-scene-motion helpers", () => {
  it("computes intro cover progress only after manifesto reveal completes", () => {
    expect(getIntroCoverProgress(false, 1000, 200)).toBe(0);
    expect(getIntroCoverProgress(true, 1000, 1000)).toBe(0);
    expect(getIntroCoverProgress(true, 1000, 200)).toBeGreaterThan(0.7);
  });

  it("uses hysteresis when deciding if the hero is retired", () => {
    expect(getNextHeroRetired(false, -80, 1000)).toBe(true);
    expect(getNextHeroRetired(false, 20, 1000)).toBe(false);
    expect(getNextHeroRetired(true, 40, 1000)).toBe(true);
    expect(getNextHeroRetired(true, 80, 1000)).toBe(false);
  });

  it("selects the active hero section from the current anchor positions", () => {
    expect(getActiveHeroSection(1000, 900, 1000, null)).toBe("home");
    expect(getActiveHeroSection(1000, 500, 1000, null)).toBe("manifesto");
    expect(getActiveHeroSection(1000, -300, 400, null)).toBe("intro");
    expect(getActiveHeroSection(1000, -300, 200, 500)).toBe("portfolio");
  });

  it("pauses and resumes home ambient state from section context", () => {
    expect(getNextHomeAmbientPaused(false, "home", 0, 900, 1000)).toBe(false);
    expect(getNextHomeAmbientPaused(false, "intro", 0, 900, 1000)).toBe(true);
    expect(getNextHomeAmbientPaused(false, "home", 0.02, 900, 1000)).toBe(true);
    expect(getNextHomeAmbientPaused(true, "home", 0, 700, 1000)).toBe(true);
    expect(getNextHomeAmbientPaused(true, "home", 0, 900, 1000)).toBe(false);
  });

  it("chooses the next snap candidate only when enabled and in range", () => {
    expect(
      getSnapCandidate(
        1000,
        { manifesto: false, sheet: false, portfolio: false },
        100,
        1000,
        null,
        false,
      ),
    ).toEqual({ key: "manifesto", top: 100, enabled: true });

    expect(
      getSnapCandidate(
        1000,
        { manifesto: true, sheet: false, portfolio: false },
        100,
        120,
        150,
        true,
      ),
    ).toEqual({ key: "sheet", top: 120, enabled: true });

    expect(
      getSnapCandidate(
        1000,
        { manifesto: true, sheet: true, portfolio: false },
        100,
        120,
        150,
        true,
      ),
    ).toEqual({ key: "portfolio", top: 150, enabled: true });

    expect(
      getSnapCandidate(
        1000,
        { manifesto: false, sheet: false, portfolio: false },
        200,
        300,
        400,
        false,
      ),
    ).toBeNull();
  });
});
