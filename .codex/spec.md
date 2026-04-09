# Spec

## Current task
Deploy and commit the home profile age text update from `만 25세` to `만 26세`.

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

## Background
- The home hero profile currently shows the birth date line as `2000.03.30 (만 25세)`.
- As of April 9, 2026 in the user's locale, the displayed age should now read `만 26세`.
- The user wants that text update deployed live and pushed to GitHub.

## In scope
- [x] update the home profile age text to `만 26세`
- [x] verify the app still passes the repository checks
- [x] redeploy the site with the updated age text
- [x] commit and push the age update to GitHub

## Out of scope
- [x] redesigning layout or motion
- [x] changing unrelated profile copy
- [x] making unrelated content changes

## Constraints
- keep the birth date line format the same except for the age value
- avoid introducing unrelated app changes
- push only the age update and related task records

## Acceptance criteria
- [x] the app shows `2000.03.30 (만 26세)` in the home profile
- [x] `npm run lint`, `npm test`, `npm run typecheck`, and `npm run build` pass
- [x] the live Firebase Hosting site is redeployed with the age update
- [x] the age update is committed and pushed to `origin/main`

## Likely files involved
- component: `src/components/hero-scene.tsx`
- docs: `.codex/spec.md`
- docs: `.codex/plans.md`
- docs: `.codex/next.md`
- docs: `docs/worklog.md`

## Risks / watchouts
- stale deploy concern:
  the live site could still show the old age until the latest build is deployed successfully
