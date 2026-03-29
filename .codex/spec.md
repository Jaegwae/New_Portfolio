# Spec

## Current task
Recover the manifesto word-reveal interaction after the cleanup refactor accidentally broke `manifestoWordProgress` state updates.

## Task type
Choose one:
- home identity refinement
- selected work update
- work card readability fix
- case-study page update
- about page refinement
- contact/footer update
- motion polish
- reduced-motion fix
- responsive layout fix
- performance cleanup

Current:
- home identity refinement
- selected work update
- performance cleanup

## Background
- The previous cleanup pass reduced ref/state drift in `HeroScene`, including moving `manifestoWordProgress` onto `useSyncedStateRef`.
- In live use, the manifesto words stopped brightening even though the wheel/touch handler was still firing.
- The immediate priority is to restore the manifesto reveal behavior without undoing the unrelated semantic and dead-code cleanup that landed in the same pass.

## In scope
- [x] inspect the manifesto reveal regression in `HeroScene`
- [x] restore reliable manifesto word-progress input handling
- [x] keep the other cleanup changes intact
- [x] add a regression test for manifesto progress
- [x] rerun validation

## Out of scope
- [x] redesigning HOME, manifesto, portfolio, or about sections
- [x] changing manifesto copy, pacing thresholds, or section order
- [x] replacing Lenis or rewriting the full home scroll architecture
- [x] reverting the unrelated about/CSS/doc cleanup from the previous pass

## Constraints
- preserve the portfolio-first hierarchy and current motion pacing
- keep reduced-motion behavior intact
- prefer the smallest fix that restores the broken reveal path
- do not weaken the manifesto lock or selected-work visibility
- keep the rest of the cleanup pass intact unless it directly caused the regression

## Acceptance criteria
- [x] manifesto words brighten again during the intro interaction
- [x] the regression is fixed without reverting the rest of the cleanup pass
- [x] the other cleanup changes remain in place
- [x] a test now catches the broken manifesto progress path
- [x] `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, and `npm run test:e2e` pass

## Likely files involved
- feature: `src/components/hero-scene.tsx`
- tests: `tests/integration/hero-scene.test.tsx`
- docs: `.codex/spec.md`
- docs: `.codex/plans.md`
- docs: `.codex/next.md`
- docs: `docs/worklog.md`

## Risks / watchouts
- motion concern:
  the original overlap exists for a reason here, so refactoring the manifesto progress path still needs direct regression coverage
- browser concern:
  automation still cannot fully assert the live trackpad feel of the manifesto lock; manual browser confirmation remains important
- maintenance concern:
  `HeroScene` still mixes refs and state in several motion paths, so progress-related refactors should stay narrow and tested
