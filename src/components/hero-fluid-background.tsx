"use client";

import { useEffect, useRef } from "react";

type PointerState = {
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

const VERTEX_SHADER_SOURCE = `
attribute vec2 a_position;
varying vec2 v_uv;

void main() {
  v_uv = vec2(a_position.x, -a_position.y) * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER_SOURCE = `
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

function clamp(value: number, min: number, max: number) {
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

function createProgram(gl: WebGLRenderingContext, vertexSource: string, fragmentSource: string) {
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

export function HeroFluidBackground({ paused }: { paused: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      premultipliedAlpha: true,
      preserveDrawingBuffer: false,
      stencil: false,
    });

    if (!gl) {
      return;
    }

    const program = createProgram(gl, VERTEX_SHADER_SOURCE, FRAGMENT_SHADER_SOURCE);

    if (!program) {
      return;
    }

    const positionBuffer = gl.createBuffer();
    const flowTexture = gl.createTexture();

    if (!positionBuffer || !flowTexture) {
      if (positionBuffer) {
        gl.deleteBuffer(positionBuffer);
      }

      if (flowTexture) {
        gl.deleteTexture(flowTexture);
      }

      gl.deleteProgram(program);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
      ]),
      gl.STATIC_DRAW,
    );

    gl.bindTexture(gl.TEXTURE_2D, flowTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const pointerLocation = gl.getUniformLocation(program, "u_pointer");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const intensityLocation = gl.getUniformLocation(program, "u_intensity");
    const mobileLocation = gl.getUniformLocation(program, "u_mobile");
    const flowLocation = gl.getUniformLocation(program, "u_flow");
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer: PointerState = {
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
    };

    let viewportWidth = 1;
    let viewportHeight = 1;
    let screenWidth = 1;
    let devicePixelRatio = 1;
    let flowWidth = 1;
    let flowHeight = 1;
    let flowValues = new Float32Array(flowWidth * flowHeight * 2);
    let nextFlowValues = new Float32Array(flowWidth * flowHeight * 2);
    let flowTextureData = new Uint8Array(flowWidth * flowHeight * 4);
    let animationFrame = 0;
    let lastTime = performance.now();
    let time = Math.random() * 1000;

    const uploadFlowTexture = () => {
      gl.bindTexture(gl.TEXTURE_2D, flowTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        flowWidth,
        flowHeight,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        flowTextureData,
      );
    };

    const encodeFlowTexture = () => {
      for (let y = 0; y < flowHeight; y += 1) {
        const textureRow = flowHeight - 1 - y;

        for (let x = 0; x < flowWidth; x += 1) {
          const fieldIndex = (y * flowWidth + x) * 2;
          const textureIndex = (textureRow * flowWidth + x) * 4;
          const velocityX = clamp(flowValues[fieldIndex], -1, 1);
          const velocityY = clamp(flowValues[fieldIndex + 1], -1, 1);
          const magnitude = clamp(Math.hypot(velocityX, velocityY) * 1.35, 0, 1);

          flowTextureData[textureIndex] = Math.round((velocityX * 0.5 + 0.5) * 255);
          flowTextureData[textureIndex + 1] = Math.round((velocityY * 0.5 + 0.5) * 255);
          flowTextureData[textureIndex + 2] = Math.round(magnitude * 255);
          flowTextureData[textureIndex + 3] = 255;
        }
      }
    };

    const configureCanvas = () => {
      const root = rootRef.current;
      const rect = root?.getBoundingClientRect();

      viewportWidth = Math.max(Math.round(rect?.width ?? window.innerWidth ?? 1), 1);
      viewportHeight = Math.max(Math.round(rect?.height ?? window.innerHeight ?? 1), 1);
      screenWidth = window.innerWidth || viewportWidth;
      devicePixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(viewportWidth * devicePixelRatio);
      canvas.height = Math.round(viewportHeight * devicePixelRatio);
      canvas.style.width = `${viewportWidth}px`;
      canvas.style.height = `${viewportHeight}px`;

      flowWidth = screenWidth <= 640 ? 92 : screenWidth <= 1024 ? 128 : 172;
      flowHeight = Math.max(54, Math.round(flowWidth * (viewportHeight / viewportWidth)));
      flowValues = new Float32Array(flowWidth * flowHeight * 2);
      nextFlowValues = new Float32Array(flowWidth * flowHeight * 2);
      flowTextureData = new Uint8Array(flowWidth * flowHeight * 4);

      encodeFlowTexture();
      uploadFlowTexture();
    };

    const updateFlowField = () => {
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
          const averageX =
            (flowValues[leftIndex] + flowValues[rightIndex] + flowValues[upIndex] + flowValues[downIndex]) * 0.25;
          const averageY =
            (flowValues[leftIndex + 1] + flowValues[rightIndex + 1] + flowValues[upIndex + 1] + flowValues[downIndex + 1]) * 0.25;

          nextFlowValues[index] = (flowValues[index] * 0.72 + averageX * 0.28) * 0.968;
          nextFlowValues[index + 1] = (flowValues[index + 1] * 0.72 + averageY * 0.28) * 0.968;
        }
      }

      const swap = flowValues;

      flowValues = nextFlowValues;
      nextFlowValues = swap;

      if (pointer.intensity > 0.001) {
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
      }

      encodeFlowTexture();
      uploadFlowTexture();
    };

    const renderFrame = () => {
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLocation);
      gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, flowTexture);

      if (flowLocation) {
        gl.uniform1i(flowLocation, 0);
      }

      if (resolutionLocation) {
        gl.uniform2f(resolutionLocation, viewportWidth, viewportHeight);
      }

      if (pointerLocation) {
        gl.uniform2f(pointerLocation, pointer.x, pointer.y);
      }

      if (timeLocation) {
        gl.uniform1f(timeLocation, time);
      }

      if (intensityLocation) {
        gl.uniform1f(intensityLocation, pointer.intensity);
      }

      if (mobileLocation) {
        gl.uniform1f(mobileLocation, screenWidth <= 900 ? 1 : 0);
      }

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const stopTick = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const tick = () => {
      const now = performance.now();
      const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);

      lastTime = now;
      time += deltaSeconds * (paused || mediaQuery.matches ? 0 : 0.9 + pointer.intensity * 0.75);
      pointer.x += (pointer.targetX - pointer.x) * 0.085;
      pointer.y += (pointer.targetY - pointer.y) * 0.085;
      pointer.velocityX += (pointer.targetVelocityX - pointer.velocityX) * 0.14;
      pointer.velocityY += (pointer.targetVelocityY - pointer.velocityY) * 0.14;
      pointer.targetVelocityX *= 0.86;
      pointer.targetVelocityY *= 0.86;
      pointer.intensity += (pointer.targetIntensity - pointer.intensity) * 0.1;
      pointer.targetIntensity *= 0.94;

      updateFlowField();
      renderFrame();

      if (!paused && !mediaQuery.matches) {
        animationFrame = window.requestAnimationFrame(tick);
      }
    };

    const startTick = () => {
      stopTick();
      lastTime = performance.now();
      animationFrame = window.requestAnimationFrame(tick);
    };

    const handleResize = () => {
      configureCanvas();
      renderFrame();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (paused || mediaQuery.matches) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const localX = clamp((event.clientX - rect.left) / Math.max(rect.width, 1), 0, 1);
      const localY = clamp((event.clientY - rect.top) / Math.max(rect.height, 1), 0, 1);
      const deltaX = (event.clientX - pointer.lastPointerX) / Math.max(rect.width, 1);
      const deltaY = (event.clientY - pointer.lastPointerY) / Math.max(rect.height, 1);

      pointer.targetX = localX;
      pointer.targetY = localY;
      pointer.lastPointerX = event.clientX;
      pointer.lastPointerY = event.clientY;
      pointer.targetVelocityX = clamp(deltaX, -0.24, 0.24);
      pointer.targetVelocityY = clamp(deltaY, -0.24, 0.24);
      pointer.targetIntensity = 1;

      if (!animationFrame) {
        startTick();
      }
    };

    const handleBlur = () => {
      pointer.targetIntensity = 0;
      pointer.targetVelocityX = 0;
      pointer.targetVelocityY = 0;
    };

    const handleReducedMotionChange = () => {
      pointer.targetIntensity = 0;
      pointer.targetVelocityX = 0;
      pointer.targetVelocityY = 0;

      if (mediaQuery.matches || paused) {
        stopTick();
        renderFrame();
        return;
      }

      startTick();
    };

    configureCanvas();
    renderFrame();

    if (!mediaQuery.matches && !paused) {
      startTick();
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handleBlur);
    mediaQuery.addEventListener("change", handleReducedMotionChange);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            handleResize();
          });

    resizeObserver?.observe(rootRef.current ?? canvas);

    return () => {
      stopTick();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleBlur);
      mediaQuery.removeEventListener("change", handleReducedMotionChange);
      resizeObserver?.disconnect();
      gl.deleteTexture(flowTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [paused]);

  return (
    <div
      aria-hidden="true"
      className={`hero-fluid-background${paused ? " is-paused" : ""}`}
      ref={rootRef}
    >
      <div className="hero-fluid-background__fallback" />
      <canvas className="hero-fluid-background__canvas" ref={canvasRef} />
      <div className="hero-fluid-background__veil" />
    </div>
  );
}
