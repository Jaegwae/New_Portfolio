import { describe, expect, it } from "vitest";

import {
  applyPointerInfluenceToFlowField,
  clamp,
  createEmptyFlowTextureData,
  encodeFlowTextureData,
  getFlowFieldDimensions,
} from "@/lib/hero-fluid-background-runtime";

describe("hero-fluid-background-runtime", () => {
  it("returns responsive flow field dimensions", () => {
    expect(getFlowFieldDimensions(480, 480, 800)).toEqual({ width: 92, height: 153 });
    expect(getFlowFieldDimensions(900, 900, 1000)).toEqual({ width: 128, height: 142 });
    expect(getFlowFieldDimensions(1440, 1440, 900)).toEqual({ width: 172, height: 108 });
  });

  it("encodes flow vectors into RGBA texture data", () => {
    const flowValues = new Float32Array([
      1, 0,
      0, -1,
      -1, 1,
      0.5, 0.5,
    ]);
    const target = createEmptyFlowTextureData(2, 2);

    const encoded = encodeFlowTextureData(flowValues, 2, 2, target);
    const pixels = Array.from({ length: encoded.length / 4 }, (_, index) =>
      Array.from(encoded.slice(index * 4, index * 4 + 4)),
    );

    expect(encoded).toHaveLength(16);
    expect(pixels).toContainEqual([0, 255, 255, 255]);
    expect(pixels).toContainEqual([255, 128, 255, 255]);
    expect(pixels).toContainEqual([128, 0, 255, 255]);
    expect(pixels).toContainEqual([191, 191, 243, 255]);
  });

  it("applies pointer influence while clamping values to the valid range", () => {
    const flowValues = new Float32Array(20 * 20 * 2);

    applyPointerInfluenceToFlowField(flowValues, 20, 20, 1200, {
      x: 0.5,
      y: 0.5,
      velocityX: 5,
      velocityY: -5,
      intensity: 1,
    });

    expect(flowValues.some((value) => value !== 0)).toBe(true);
    expect(flowValues.every((value) => value >= -1 && value <= 1)).toBe(true);
  });

  it("keeps clamp bounded inclusively", () => {
    expect(clamp(-2, -1, 1)).toBe(-1);
    expect(clamp(0.2, -1, 1)).toBe(0.2);
    expect(clamp(5, -1, 1)).toBe(1);
  });
});
