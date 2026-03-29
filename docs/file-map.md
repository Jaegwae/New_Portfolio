# File Map

## Purpose
This document helps humans and agents locate code ownership quickly.

## Top-level structure

### Routes
- `src/app/`
  - route-level entry points and layouts

### Shared UI
- `src/components/`
  - current home-page section ownership lives here
  - `hero-scene.tsx` composes the route-level home experience and now owns the GSAP-driven hero scene state sync
  - `hero-fluid-background.tsx` owns the decorative HOME WebGL flowmap + fragment-shader background behind the hero copy
  - `manifesto-section.tsx`, `about-sheet.tsx`, `portfolio-section.tsx`, `about-finale.tsx` own the home sections
  - `portfolio-modal.tsx`, `rotating-role.tsx`, `wave-field.tsx`, `smooth-scroll-provider.tsx` support the home route

### Motion
- `src/lib/gsap-reveal.ts`
  - GSAP ScrollTrigger-based reveal helpers for editorial section copy
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

### Reserved directories
- `src/features/`
  - currently a placeholder; section ownership is still in `src/components/`
- `src/styles/`
  - currently a placeholder; route styling lives in `src/app/globals.css`

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
1. about route
2. about content block
3. portrait/media component
4. copy source
5. motion file if relevant

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
