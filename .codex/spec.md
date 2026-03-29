# Spec

## Current task
Commit the remaining local changes from this reconnected working folder and push them to GitHub.

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
- contact/footer update
- performance cleanup

## Background
- This working folder has already been reconnected to the GitHub repository.
- A few local changes still remain here: updated task-tracking docs and the user-added `public/assets/hero/ascii-figure.png`.
- The user wants those remaining local changes pushed from this folder directly.

## In scope
- [x] review the remaining local changes in this folder
- [x] commit the remaining meaningful files from this folder
- [x] push the new commit to the GitHub remote

## Out of scope
- [x] making additional UI or motion changes
- [x] changing deployment config
- [x] cleaning every untracked local asset outside the current push scope

## Constraints
- push from this folder now that Git is reconnected here
- include the meaningful remaining asset the user left in `public/assets/hero/`
- keep local cache folders and preview artifacts out of the commit

## Acceptance criteria
- [x] the remaining local docs and hero asset are committed from this folder
- [ ] the new commit is pushed to `origin/main`
- [x] local preview/cache artifacts remain uncommitted

## Likely files involved
- asset: `public/assets/hero/ascii-figure.png`
- docs: `.codex/spec.md`
- docs: `.codex/plans.md`
- docs: `.codex/next.md`
- docs: `docs/worklog.md`

## Risks / watchouts
- repo concern:
  only the intended remaining local files should be committed, not local cache folders or preview artifacts
