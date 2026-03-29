# Spec

## Current task
Temporarily disable the ABOUT section on the home page.

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
- The home page currently still renders the final ABOUT section and shows an ABOUT item in the section nav.
- The user wants that section disabled for now so it can be revisited later.
- This should be handled as a temporary home-page deactivation, not a broader content or route removal.

## In scope
- [x] remove the ABOUT item from the home section nav
- [x] stop rendering the final ABOUT section on the home page
- [x] keep the rest of the home section flow intact
- [x] rerun relevant validation

## Out of scope
- [x] deleting the ABOUT component files
- [x] changing the dedicated `/about` route
- [x] retuning unrelated HOME motion or copy

## Constraints
- keep the change reversible so the ABOUT section can be restored later
- do not disturb HOME section order before the removed finale
- avoid mixing this deactivation with unrelated layout or motion changes

## Acceptance criteria
- [x] the home section nav no longer shows ABOUT
- [x] the ABOUT finale no longer renders on the home page
- [x] existing HOME scroll behavior still works for the remaining sections
- [x] `npm run lint`, `npm test`, `npm run typecheck`, and `npm run build` pass

## Likely files involved
- component: `src/components/hero-scene.tsx`
- docs: `.codex/spec.md`
- docs: `.codex/plans.md`
- docs: `.codex/next.md`
- docs: `docs/worklog.md`

## Risks / watchouts
- state concern:
  the home scroll/nav logic still contains dormant ABOUT references, so the visible deactivation should be verified without over-refactoring
