"use client";

import { useEffect, type RefObject } from "react";

import {
  applyPointerInfluenceToFlowField,
  createFlowFieldBuffers,
  createInitialPointerState,
  createProgram,
  diffuseFlowField,
  encodeFlowTextureData,
  getFlowFieldDimensions,
  HERO_FLUID_FRAGMENT_SHADER_SOURCE,
  HERO_FLUID_QUAD_VERTICES,
  HERO_FLUID_VERTEX_SHADER_SOURCE,
  shouldAnimateHeroFluid,
  stepPointerState,
  updatePointerFromClientPosition,
} from "@/lib/hero-fluid-background-runtime";

type UseHeroFluidBackgroundSceneOptions = {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  rootRef: RefObject<HTMLDivElement | null>;
  paused: boolean;
  prefersReducedMotion: boolean;
};

/**
 * AI_NOTE:
 * This hook is the browser-only orchestration layer for the hero fluid background.
 * It owns WebGL setup, event wiring, and the RAF lifecycle.
 * Prefer moving math-heavy or reusable simulation steps into
 * `hero-fluid-background-runtime.ts` instead of growing this hook.
 */
export function useHeroFluidBackgroundScene({
  canvasRef,
  rootRef,
  paused,
  prefersReducedMotion,
}: UseHeroFluidBackgroundSceneOptions) {
  useEffect(() => {
    // AI_CONTEXT: canvas may be missing during early render phases or non-browser test environments.
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

    const program = createProgram(gl, HERO_FLUID_VERTEX_SHADER_SOURCE, HERO_FLUID_FRAGMENT_SHADER_SOURCE);

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
    gl.bufferData(gl.ARRAY_BUFFER, HERO_FLUID_QUAD_VERTICES, gl.STATIC_DRAW);

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
    const pointer = createInitialPointerState();

    let viewportWidth = 1;
    let viewportHeight = 1;
    let screenWidth = 1;
    let devicePixelRatio = 1;
    let flowWidth = 1;
    let flowHeight = 1;
    let { flowValues, nextFlowValues, flowTextureData } = createFlowFieldBuffers(flowWidth, flowHeight);
    let animationFrame = 0;
    let lastTime = performance.now();
    let time = Math.random() * 1000;

    const uploadFlowTexture = () => {
      // AI_CONTEXT: bridge CPU-side flow buffers into the GPU texture sampled by the fragment shader.
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
      flowTextureData = encodeFlowTextureData(flowValues, flowWidth, flowHeight, flowTextureData);
    };

    const configureCanvas = () => {
      // AI_CONTEXT: canvas size and simulation grid size are coupled because the field is viewport-dependent.
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

      const flowFieldDimensions = getFlowFieldDimensions(screenWidth, viewportWidth, viewportHeight);
      flowWidth = flowFieldDimensions.width;
      flowHeight = flowFieldDimensions.height;
      ({ flowValues, nextFlowValues, flowTextureData } = createFlowFieldBuffers(flowWidth, flowHeight));

      encodeFlowTexture();
      uploadFlowTexture();
    };

    const updateFlowField = () => {
      diffuseFlowField(flowValues, nextFlowValues, flowWidth, flowHeight);
      [flowValues, nextFlowValues] = [nextFlowValues, flowValues];

      applyPointerInfluenceToFlowField(flowValues, flowWidth, flowHeight, screenWidth, pointer);

      encodeFlowTexture();
      uploadFlowTexture();
    };

    const renderFrame = () => {
      // AI_CONTEXT: uniforms are refreshed every frame from the latest simulation/pointer state.
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
      // AI_CONTEXT: centralize RAF cancellation so every exit path can shut the scene down safely.
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    const tick = () => {
      const now = performance.now();
      const deltaSeconds = Math.min((now - lastTime) / 1000, 0.05);
      const shouldAnimate = shouldAnimateHeroFluid(paused, prefersReducedMotion);

      lastTime = now;
      time += stepPointerState(pointer, deltaSeconds, shouldAnimate);

      updateFlowField();
      renderFrame();

      if (shouldAnimate) {
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
      if (paused || prefersReducedMotion) {
        return;
      }

      updatePointerFromClientPosition(pointer, event.clientX, event.clientY, canvas.getBoundingClientRect());

      if (!animationFrame) {
        startTick();
      }
    };

    const handleBlur = () => {
      // AI_CONTEXT: blur decays interaction state so returning to the tab does not preserve a stale force.
      pointer.targetIntensity = 0;
      pointer.targetVelocityX = 0;
      pointer.targetVelocityY = 0;
    };

    configureCanvas();
    renderFrame();

    if (!prefersReducedMotion && !paused) {
      startTick();
    }

    window.addEventListener("resize", handleResize);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("blur", handleBlur);

    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(() => {
            handleResize();
          });

    resizeObserver?.observe(rootRef.current ?? canvas);

    return () => {
      // AI_CONTEXT: cleanup order matters — stop RAF, remove listeners, then release WebGL resources.
      stopTick();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("blur", handleBlur);
      resizeObserver?.disconnect();
      gl.deleteTexture(flowTexture);
      gl.deleteBuffer(positionBuffer);
      gl.deleteProgram(program);
    };
  }, [canvasRef, paused, prefersReducedMotion, rootRef]);
}
