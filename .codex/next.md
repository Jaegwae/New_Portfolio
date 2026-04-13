# Next

## Resume point
Resume after the detailed source-commenting pass:
- the main source/style files now include denser AI-readable comments around meaningful logic boundaries
- the full local validation suite still passes after the comment pass
- lint, unit/integration tests, typecheck, build, and Playwright smoke tests all pass locally

## Next actions
1. keep comments updated whenever ownership or runtime flow changes again
2. consider deeper responsive/style cleanup if the remaining large CSS files start to slow down maintenance
3. consider adding a lightweight component-level test around `HeroFluidBackground` wiring if more runtime refactors are planned

## Before editing again
- reread `AGENTS.md`
- reread `docs/file-map.md`
- reread `.codex/spec.md`
- reread `.codex/plans.md`
- check latest `docs/worklog.md`

## Last known concerns
- [ ] `hero-scene.tsx` is smaller but still owns a lot of orchestration logic
- [ ] this working folder has no `.git` directory, so Git-based verification still cannot run here
