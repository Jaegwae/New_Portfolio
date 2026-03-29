# Spec

## Current task
Write a root README and push the latest project state to GitHub.

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
- The latest portfolio state has already been deployed to Firebase Hosting.
- The user wants the repository itself updated on GitHub as well.
- Before pushing, the repo should have a usable root `README.md`.

## In scope
- [x] add a root `README.md` that explains the project clearly
- [x] keep the README aligned with the current stack and deployment flow
- [x] push the latest repository state to the existing GitHub remote

## Out of scope
- [x] making additional UI or motion changes
- [x] changing the Firebase Hosting target
- [x] restructuring the project beyond documentation and repo sync

## Constraints
- keep the README concise, accurate, and useful for collaborators
- push only meaningful project files, not local preview artifacts
- preserve the current live deployment setup

## Acceptance criteria
- [x] the repo has a root `README.md`
- [x] the README reflects the current project and deployment commands
- [ ] the latest local project state is pushed to the GitHub remote

## Likely files involved
- docs: `README.md`
- docs: `.codex/spec.md`
- docs: `.codex/plans.md`
- docs: `.codex/next.md`
- docs: `docs/worklog.md`

## Risks / watchouts
- repo concern:
  this working folder is not a Git checkout, so GitHub sync should be done through the temporary clone without including local preview artifacts
