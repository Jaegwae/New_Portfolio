import { describe, expect, it } from "vitest";

import {
  createFlowFieldBuffers,
  diffuseFlowField,
  shouldAnimateHeroFluid,
  stepPointerState,
  updatePointerFromClientPosition,
  type PointerState,
} from "@/lib/hero-fluid-background-runtime";

function createPointerState(): PointerState {
  return {
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    velocityX: 0,
    velocityY: 0,
    targetVelocityX: 0,
    targetVelocityY: 0,
    intensity: 0,
    targetIntensity: 0,
    lastPointerX: 100,
    lastPointerY: 100,
  };
}

describe("hero-fluid-background scene helpers", () => {
  it("creates correctly sized flow field buffers", () => {
    const buffers = createFlowFieldBuffers(8, 6);

    expect(buffers.flowValues).toHaveLength(96);
    expect(buffers.nextFlowValues).toHaveLength(96);
    expect(buffers.flowTextureData).toHaveLength(192);
  });

  it("diffuses the flow field into the next buffer", () => {
    const { flowValues, nextFlowValues } = createFlowFieldBuffers(3, 3);
    flowValues[8] = 1;
    flowValues[9] = -1;

    diffuseFlowField(flowValues, nextFlowValues, 3, 3);

    expect(nextFlowValues.some((value) => value !== 0)).toBe(true);
    expect(nextFlowValues[8]).toBeLessThan(1);
    expect(nextFlowValues[9]).toBeGreaterThan(-1);
  });

  it("updates pointer target values from client position", () => {
    const pointer = createPointerState();

    updatePointerFromClientPosition(pointer, 150, 50, {
      left: 50,
      top: 0,
      width: 200,
      height: 100,
    });

    expect(pointer.targetX).toBe(0.5);
    expect(pointer.targetY).toBe(0.5);
    expect(pointer.targetVelocityX).toBeGreaterThan(0);
    expect(pointer.targetIntensity).toBe(1);
  });

  it("steps pointer state and only advances time when animation is enabled", () => {
    const pointer = createPointerState();
    pointer.targetX = 0.8;
    pointer.targetY = 0.2;
    pointer.targetVelocityX = 0.3;
    pointer.targetVelocityY = -0.2;
    pointer.targetIntensity = 1;

    const animatedTimeDelta = stepPointerState(pointer, 0.5, true);

    expect(animatedTimeDelta).toBeGreaterThan(0);
    expect(pointer.x).toBeGreaterThan(0.5);
    expect(pointer.y).toBeLessThan(0.5);
    expect(pointer.intensity).toBeGreaterThan(0);

    const pausedTimeDelta = stepPointerState(pointer, 0.5, false);
    expect(pausedTimeDelta).toBe(0);
  });

  it("computes the basic animate/not-animate gate", () => {
    expect(shouldAnimateHeroFluid(false, false)).toBe(true);
    expect(shouldAnimateHeroFluid(true, false)).toBe(false);
    expect(shouldAnimateHeroFluid(false, true)).toBe(false);
  });
});
