# Spec

## Current task
Clean up the repository docs so the active guidance matches the current local codebase.

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
- performance cleanup

## Background
- The active docs have already been aligned with the current codebase.
- The user then requested a much denser AI-readable commenting pass across the actual source files so future AI edits are easier and safer.
- This pass should update source/style comments only; runtime behavior must stay unchanged.

## In scope
- [x] add detailed AI-readable comments across the meaningful source/style logic boundaries
- [x] keep comments descriptive enough for future AI edits without changing behavior
- [x] rerun local validation after the commenting pass

## Out of scope
- [x] rewriting historical worklog entries
- [x] changing runtime behavior just to fit comments
- [x] any GitHub, commit, push, or deployment action

## Constraints
- keep the visible home/portfolio behavior unchanged
- keep comments grounded in the actual current code responsibilities
- use local validation only
- do not touch GitHub or deployment surfaces in this pass

## Acceptance criteria
- [x] the app shows `2000.03.30 (만 26세)` in the home profile
- [x] the main source/style files now contain detailed AI-readable comments around meaningful logic boundaries
- [x] repository behavior remains unchanged under the existing unit, integration, and e2e checks
- [x] repository behavior remains unchanged under the existing unit, integration, and e2e checks
- [x] `npm run lint`, `npm test`, `npm run typecheck`, and `npm run build` pass
- [x] `npm run test:e2e` passes locally

## Likely files involved
- app: `src/app/*.tsx`
- styles: `src/app/styles/*.css`
- components: `src/components/*.tsx`
- content: `src/content/*.ts`
- lib: `src/lib/*.ts`
- docs: `.codex/spec.md`
- docs: `.codex/plans.md`
- docs: `.codex/next.md`
- docs: `docs/worklog.md`

## Risks / watchouts
- comment-drift risk:
  dense AI-readable comments can become stale if future refactors update ownership without updating comments together
- environment note:
  this working folder currently has no `.git` directory, so Git status/commit verification is unavailable from here
