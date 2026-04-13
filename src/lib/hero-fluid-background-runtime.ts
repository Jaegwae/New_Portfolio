"use client";

/**
 * AI_NOTE:
 * This file is the "pure/runtime helper" layer for the hero fluid background.
 * Prefer adding math, buffer, and small WebGL utility helpers here.
 * Avoid React hooks and browser event wiring in this file.
 */

export type PointerState = {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  velocityX: number;
  velocityY: number;
  targetVelocityX: number;
  targetVelocityY: number;
  intensity: number;
  targetIntensity: number;
  lastPointerX: number;
  lastPointerY: number;
};

export const HERO_FLUID_VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = vec2(a_position.x, -a_position.y) * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

export const HERO_FLUID_FRAGMENT_SHADER_SOURCE = `
precision highp float;

varying vec2 v_uv;

uniform vec2 u_resolution;
uniform vec2 u_pointer;
uniform sampler2D u_flow;
uniform float u_time;
uniform float u_intensity;
uniform float u_mobile;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
    mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
    u.y
  );
}

float fbm(vec2 p) {
  float value = 0.0;
  float amplitude = 0.58;
  float total = 0.0;

  for (int i = 0; i < 5; i += 1) {
    value += noise(p) * amplitude;
    total += amplitude;
    p = mat2(1.6, 1.2, -1.2, 1.6) * p + 13.7;
    amplitude *= 0.52;
  }

  return value / total;
}

void main() {
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  float motionScale = mix(1.0, 0.68, u_mobile);
  vec3 flowSample = texture2D(u_flow, vec2(v_uv.x, 1.0 - v_uv.y)).rgb;
  vec2 flow = (flowSample.rg * 2.0 - 1.0) * motionScale;
  float energy = flowSample.b;

  vec2 domain = v_uv;
  domain += flow * (0.075 + energy * 0.03);
  domain += vec2(
    fbm(v_uv * vec2(1.45, 1.1) + vec2(u_time * 0.035, -u_time * 0.028)),
    fbm(v_uv.yx * vec2(1.1, 1.58) + vec2(-u_time * 0.024, u_time * 0.042))
  ) * 0.03 - 0.015;

  float smoke = fbm(domain * vec2(2.35, 1.95) + vec2(u_time * 0.02, -u_time * 0.018));
  float detail = fbm((domain + flow * 0.18) * vec2(5.7, 4.8) + vec2(-u_time * 0.052, u_time * 0.041));
  float ribbons = fbm(vec2(domain.x * 1.25 + detail * 0.72, domain.y * 8.5 - u_time * 0.053));

  vec2 pointerVector = (v_uv - u_pointer) * vec2(aspect, 1.0);
  float pointerGlow = exp(-length(pointerVector) * 10.4);

  vec2 headCenter = (v_uv - vec2(0.76, 0.36)) * vec2(aspect * 1.08, 1.0);
  vec2 torsoCenter = (v_uv - vec2(0.71, 0.63)) * vec2(aspect * 0.92, 1.18);
  float rightFocus = 1.0 - smoothstep(0.12, 0.94, length(headCenter));
  float shoulderGlow = 1.0 - smoothstep(0.2, 1.08, length(torsoCenter));
  float leftFade = smoothstep(0.05, 0.42, v_uv.x);
  float edgeVignette = 1.0 - smoothstep(0.18, 1.06, length((v_uv - vec2(0.7, 0.48)) * vec2(aspect * 1.22, 1.05)));

  float tone = 0.018;
  tone += smoke * 0.22;
  tone += detail * 0.36;
  tone += ribbons * 0.12;
  tone += rightFocus * 0.1;
  tone += shoulderGlow * 0.07;
  tone += edgeVignette * 0.07;
  tone += pointerGlow * (0.05 + energy * 0.14 + u_intensity * 0.03);
  tone += energy * 0.1;

  tone = mix(tone * 0.62, tone * 0.9, leftFade);
  tone *= mix(0.92, 1.03, rightFocus);
  tone += (hash(gl_FragCoord.xy + u_time * 42.0) - 0.5) * 0.04;
  tone = smoothstep(0.07, 0.92, tone);

  gl_FragColor = vec4(vec3(clamp(tone, 0.0, 1.0)), 1.0);
}
`;

export const HERO_FLUID_QUAD_VERTICES = new Float32Array([
  -1, -1,
  1, -1,
  -1, 1,
  1, 1,
]);

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    return shader;
  }

  gl.deleteShader(shader);
  return null;
}

export function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

  if (!vertexShader || !fragmentShader) {
    if (vertexShader) {
      gl.deleteShader(vertexShader);
    }

    if (fragmentShader) {
      gl.deleteShader(fragmentShader);
    }

    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return program;
  }

  gl.deleteProgram(program);
  return null;
}

export function createInitialPointerState() {
  // AI_CONTEXT: initial pointer state represents the scene's resting focus before user input.
  return {
    x: 0.72,
    y: 0.4,
    targetX: 0.72,
    targetY: 0.4,
    velocityX: 0,
    velocityY: 0,
    targetVelocityX: 0,
    targetVelocityY: 0,
    intensity: 0,
    targetIntensity: 0,
    lastPointerX: window.innerWidth * 0.72,
    lastPointerY: window.innerHeight * 0.4,
  } satisfies PointerState;
}

export function shouldAnimateHeroFluid(paused: boolean, prefersReducedMotion: boolean) {
  // AI_CONTEXT: single gate used by the scene hook to decide whether RAF should keep running.
  return !paused && !prefersReducedMotion;
}

export function getFlowFieldDimensions(screenWidth: number, viewportWidth: number, viewportHeight: number) {
  const width = screenWidth <= 640 ? 92 : screenWidth <= 1024 ? 128 : 172;
  const height = Math.max(54, Math.round(width * (viewportHeight / viewportWidth)));

  return {
    width,
    height,
  };
}

export function createEmptyFlowTextureData(flowWidth: number, flowHeight: number) {
  return new Uint8Array(flowWidth * flowHeight * 4);
}

export function createFlowFieldBuffers(flowWidth: number, flowHeight: number) {
  // AI_CONTEXT: allocate all mutable simulation buffers together so swap/reset stays predictable.
  return {
    flowValues: new Float32Array(flowWidth * flowHeight * 2),
    nextFlowValues: new Float32Array(flowWidth * flowHeight * 2),
    flowTextureData: createEmptyFlowTextureData(flowWidth, flowHeight),
  };
}

export function encodeFlowTextureData(
  flowValues: Float32Array,
  flowWidth: number,
  flowHeight: number,
  target = createEmptyFlowTextureData(flowWidth, flowHeight),
) {
  // AI_CONTEXT: smooth the current field into the next buffer before pointer influence is reapplied.
  for (let y = 0; y < flowHeight; y += 1) {
    const textureRow = flowHeight - 1 - y;

    for (let x = 0; x < flowWidth; x += 1) {
      const fieldIndex = (y * flowWidth + x) * 2;
      const textureIndex = (textureRow * flowWidth + x) * 4;
      const velocityX = clamp(flowValues[fieldIndex], -1, 1);
      const velocityY = clamp(flowValues[fieldIndex + 1], -1, 1);
      const magnitude = clamp(Math.hypot(velocityX, velocityY) * 1.35, 0, 1);

      target[textureIndex] = Math.round((velocityX * 0.5 + 0.5) * 255);
      target[textureIndex + 1] = Math.round((velocityY * 0.5 + 0.5) * 255);
      target[textureIndex + 2] = Math.round(magnitude * 255);
      target[textureIndex + 3] = 255;
    }
  }

  return target;
}

export function diffuseFlowField(
  flowValues: Float32Array,
  nextFlowValues: Float32Array,
  flowWidth: number,
  flowHeight: number,
) {
  for (let y = 0; y < flowHeight; y += 1) {
    const upY = y === 0 ? 0 : y - 1;
    const downY = y === flowHeight - 1 ? flowHeight - 1 : y + 1;

    for (let x = 0; x < flowWidth; x += 1) {
      const leftX = x === 0 ? 0 : x - 1;
      const rightX = x === flowWidth - 1 ? flowWidth - 1 : x + 1;
      const index = (y * flowWidth + x) * 2;
      const leftIndex = (y * flowWidth + leftX) * 2;
      const rightIndex = (y * flowWidth + rightX) * 2;
      const upIndex = (upY * flowWidth + x) * 2;
      const downIndex = (downY * flowWidth + x) * 2;
      const averageX = (flowValues[leftIndex] + flowValues[rightIndex] + flowValues[upIndex] + flowValues[downIndex]) * 0.25;
      const averageY =
        (flowValues[leftIndex + 1] + flowValues[rightIndex + 1] + flowValues[upIndex + 1] + flowValues[downIndex + 1]) *
        0.25;

      nextFlowValues[index] = (flowValues[index] * 0.72 + averageX * 0.28) * 0.968;
      nextFlowValues[index + 1] = (flowValues[index + 1] * 0.72 + averageY * 0.28) * 0.968;
    }
  }
}

export function updatePointerFromClientPosition(
  pointer: PointerState,
  clientX: number,
  clientY: number,
  rect: Pick<DOMRect, "left" | "top" | "width" | "height">,
) {
  // AI_CONTEXT: convert viewport client coordinates into normalized canvas coordinates and bounded velocity.
  const localX = clamp((clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
  const localY = clamp((clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
  const deltaX = (clientX - pointer.lastPointerX) / Math.max(rect.width, 1);
  const deltaY = (clientY - pointer.lastPointerY) / Math.max(rect.height, 1);

  pointer.targetX = localX;
  pointer.targetY = localY;
  pointer.lastPointerX = clientX;
  pointer.lastPointerY = clientY;
  pointer.targetVelocityX = clamp(deltaX, -0.24, 0.24);
  pointer.targetVelocityY = clamp(deltaY, -0.24, 0.24);
  pointer.targetIntensity = 1;
}

export function stepPointerState(pointer: PointerState, deltaSeconds: number, shouldAnimate: boolean) {
  // AI_CONTEXT:
  // Mutates pointer easing state and returns only the contribution that should be added to scene time.
  const timeDelta = shouldAnimate ? deltaSeconds * (0.9 + pointer.intensity * 0.75) : 0;

  pointer.x += (pointer.targetX - pointer.x) * 0.085;
  pointer.y += (pointer.targetY - pointer.y) * 0.085;
  pointer.velocityX += (pointer.targetVelocityX - pointer.velocityX) * 0.14;
  pointer.velocityY += (pointer.targetVelocityY - pointer.velocityY) * 0.14;
  pointer.targetVelocityX *= 0.86;
  pointer.targetVelocityY *= 0.86;
  pointer.intensity += (pointer.targetIntensity - pointer.intensity) * 0.1;
  pointer.targetIntensity *= 0.94;

  return timeDelta;
}

export function applyPointerInfluenceToFlowField(
  flowValues: Float32Array,
  flowWidth: number,
  flowHeight: number,
  screenWidth: number,
  pointer: Pick<PointerState, "x" | "y" | "velocityX" | "velocityY" | "intensity">,
) {
  if (pointer.intensity <= 0.001) {
    return flowValues;
  }

  const centerX = Math.round(pointer.x * (flowWidth - 1));
  const centerY = Math.round(pointer.y * (flowHeight - 1));
  const radius = Math.max(5, Math.round(flowWidth * (screenWidth <= 640 ? 0.068 : 0.056)));
  const influence = 0.46 + pointer.intensity * 0.56;

  for (let offsetY = -radius; offsetY <= radius; offsetY += 1) {
    const sampleY = centerY + offsetY;

    if (sampleY < 0 || sampleY >= flowHeight) {
      continue;
    }

    for (let offsetX = -radius; offsetX <= radius; offsetX += 1) {
      const sampleX = centerX + offsetX;

      if (sampleX < 0 || sampleX >= flowWidth) {
        continue;
      }

      const distance = Math.sqrt(offsetX * offsetX + offsetY * offsetY) / radius;

      if (distance > 1) {
        continue;
      }

      const falloff = (1 - distance) * (1 - distance);
      const localX = offsetX / radius;
      const localY = offsetY / radius;
      const swirlX = -localY;
      const swirlY = localX;
      const index = (sampleY * flowWidth + sampleX) * 2;

      flowValues[index] = clamp(
        flowValues[index] + (pointer.velocityX * 2.6 + swirlX * 0.42) * falloff * influence,
        -1,
        1,
      );
      flowValues[index + 1] = clamp(
        flowValues[index + 1] + (pointer.velocityY * 2.6 + swirlY * 0.42) * falloff * influence,
        -1,
        1,
      );
    }
  }

  return flowValues;
}
