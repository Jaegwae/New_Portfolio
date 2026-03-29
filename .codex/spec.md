# Spec

## Current task
Deploy and commit the new vector `K.J` favicon update.

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
- contact/footer update
- performance cleanup

## Background
- The user wants the site favicon to use a bold `K.J` monogram.
- They specifically want a vector SVG approach rather than text rendered from a font at runtime.
- The favicon should stay legible at small tab sizes.
- The user now wants that favicon change both deployed live and committed to GitHub.

## In scope
- [x] create a path-based SVG favicon for `K.J`
- [x] add it in the Next app icon location
- [x] verify the app still builds successfully
- [x] redeploy the site with the new favicon
- [x] commit and push the favicon update to GitHub

## Out of scope
- [x] redesigning other brand assets
- [x] changing layout or motion behavior
- [x] making unrelated content changes

## Constraints
- use vector shapes rather than plain text nodes
- keep the favicon high-contrast and readable at small sizes
- avoid introducing unrelated app changes
- push only the favicon change and related task records

## Acceptance criteria
- [x] the app has a new vector `K.J` favicon file
- [x] the favicon uses path/circle shapes instead of font text rendering
- [x] `npm run lint`, `npm test`, `npm run typecheck`, and `npm run build` pass
- [x] the live Firebase Hosting site is redeployed with the favicon update
- [ ] the favicon update is committed and pushed to `origin/main`

## Likely files involved
- icon: `src/app/icon.svg`
- config: `package.json`
- docs: `.codex/spec.md`
- docs: `.codex/plans.md`
- docs: `.codex/next.md`
- docs: `docs/worklog.md`

## Risks / watchouts
- legibility concern:
  the monogram has to stay readable in tiny browser tab sizes, so simplified bold geometry is preferable to intricate lettering
