import { describe, expect, it } from "vitest";

import {
  clampManifestoProgress,
  getManifestoLockEligibility,
  getManifestoScrollAmount,
  shouldHandleManifestoLockInput,
} from "@/lib/hero-manifesto-lock";

describe("hero-manifesto-lock helpers", () => {
  it("clamps manifesto progress into the valid range", () => {
    expect(clampManifestoProgress(-1)).toBe(0);
    expect(clampManifestoProgress(0.35)).toBe(0.35);
    expect(clampManifestoProgress(2)).toBe(1);
  });

  it("computes manifesto lock eligibility from viewport thresholds", () => {
    expect(getManifestoLockEligibility(1000, 10, 980, 0.4)).toBe(true);
    expect(getManifestoLockEligibility(1000, 30, 980, 0.4)).toBe(false);
    expect(getManifestoLockEligibility(1000, 10, 940, 0.4)).toBe(false);
    expect(getManifestoLockEligibility(1000, 10, 980, 1)).toBe(false);
  });

  it("computes document scroll nudges within the expected range", () => {
    expect(getManifestoScrollAmount(1000, 10)).toBe(60);
    expect(getManifestoScrollAmount(1000, 500)).toBe(140);
    expect(getManifestoScrollAmount(1000, 80)).toBe(80);
  });

  it("only handles manifesto lock input when active and not reduced motion", () => {
    expect(shouldHandleManifestoLockInput(false, false, false)).toBe(false);
    expect(shouldHandleManifestoLockInput(true, false, false)).toBe(true);
    expect(shouldHandleManifestoLockInput(false, true, false)).toBe(true);
    expect(shouldHandleManifestoLockInput(true, true, true)).toBe(false);
  });
});
