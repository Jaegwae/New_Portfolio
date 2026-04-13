# File Map

## Purpose
This document helps humans and agents locate code ownership quickly.

## Top-level structure

### Routes
- `src/app/`
  - current live app route entry points and layouts
  - the repo currently ships only the `/` app route plus shared app shell assets

### Shared UI
- `src/components/`
  - current home-page section ownership lives here
  - `hero-scene.tsx` composes the route-level home experience and now focuses on final render/composition
  - `hero-section-nav.tsx` owns the fixed section navigation UI for the home route
  - `hero-profile.tsx` owns the home hero profile list rendering
  - `hero-fluid-background.tsx` owns the decorative HOME WebGL flowmap + fragment-shader background behind the hero copy and delegates runtime details to `src/lib/`
  - `manifesto-section.tsx`, `about-sheet.tsx`, and `portfolio-section.tsx` own the live home sections
  - `portfolio-modal.tsx`, `rotating-role.tsx`, and `smooth-scroll-provider.tsx` support the home route

### Motion
- `src/lib/gsap-reveal.ts`
  - GSAP ScrollTrigger-based reveal helpers for editorial section copy
- `src/lib/hero-manifesto-lock.ts`
  - manifesto lock / wheel-touch progression helpers extracted from `hero-scene.tsx`
- `src/lib/hero-scene-motion.ts`
  - shared hero section metrics, nav metadata, and scene snap helpers extracted from `hero-scene.tsx`
- `src/components/smooth-scroll-provider.tsx`
  - Lenis ownership and reduced-motion-aware smooth-scroll setup
- `src/animations/`
  - reserved for future extracted motion modules; currently not used by the live route

### Tooling
- `scripts/`
  - validation and maintenance helpers
  - `ensure-next-cache-life.mjs` backfills Next's generated `cache-life.d.ts` before standalone typecheck runs

### Content
- `src/content/`
  - project data, bio copy, links, case study content schema

### Utilities
- `src/lib/`
  - shared helpers and formatting logic
  - `use-prefers-reduced-motion.ts` centralizes reduced-motion preference detection for motion-sensitive modules
  - `use-body-scroll-lock.ts`, `use-focus-return.ts`, and `use-focus-trap.ts` now own the portfolio modal’s accessibility side effects
  - `use-synced-state-ref.ts` centralizes the paired state/ref pattern used by hero orchestration
  - `use-hero-scene-runtime.ts` now composes the hero scene runtime from smaller hooks
  - `use-hero-scene-navigation.ts` owns hero section-jump navigation behavior
  - `use-hero-scene-scroll-sync.ts` owns hero scroll/section synchronization behavior
  - `hero-fluid-background-runtime.ts` holds the WebGL shader/runtime primitives plus the extracted pure fluid helper functions
  - `use-hero-fluid-background-scene.ts` owns the fluid background animation lifecycle hook and delegates more simulation math/state to the runtime helper module
  - `hero-manifesto-lock.ts` now exposes testable manifesto-lock helper functions alongside the hook, with explicit eligible/active runtime state feeding the listener logic
  - `hero-scene-motion.ts` now exposes testable pure hero motion helper functions alongside the state-sync helpers

### Reserved directories
- `src/features/`
  - currently placeholders; live section ownership is still in `src/components/`
- `src/styles/`
  - currently a placeholder and not part of the live styling path
- `src/app/styles/`
  - imported partial styles that back the `src/app/globals.css` entrypoint

### Tests
- `tests/unit/`
- `tests/integration/`
- `tests/e2e/`
- `tests/visual/`

## How to find code by task type

### Home intro issue
1. home route
2. intro section component
3. intro motion file
4. shared type/spacing tokens
5. visual checks

### Work card issue
1. work list/grid component
2. project card component
3. project content source
4. hover/reveal motion
5. tests

### About section issue
1. about-related content component
2. about content block
3. copy source
4. motion file if relevant
5. validation

### Footer/contact issue
1. footer component
2. link/social data
3. hover animation
4. accessibility checks

## Sensitive areas
- shared project card component
- case study layout template
- route-level transitions
- reduced-motion handling
- project content schema
