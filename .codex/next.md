# Next

## Resume point
Resume after the manifesto reveal regression fix:
- `manifestoWordProgress` was moved back to explicit `useState + useRef` because the synced helper broke live progress updates
- a Vitest integration test now catches the broken manifesto brightening path
- the rest of the cleanup pass remains intact
- semantic/dead-code/doc cleanup still stands

## Next actions
1. manually verify in live Chrome and Safari that the manifesto words brighten and hand off correctly again
2. if `HeroScene` state/ref cleanup is revisited later, keep manifesto progress on its own tested path instead of collapsing it into a generic helper blindly
3. if HOME scroll complexity grows again, consider extracting the manifesto lock into its own hook/module instead of keeping it inside `hero-scene`
4. keep Playwright on stable smoke behavior and prefer Vitest integration tests for any future motion-heavy path that headless Chrome cannot assert reliably

## Before editing again
- reread `AGENTS.md`
- reread `docs/motion-map.md`
- reread `.codex/spec.md`
- reread `.codex/plans.md`
- check latest `docs/worklog.md`

## Last known concerns
- [ ] the regression is fixed structurally and validated, but the exact live Chrome/Safari feel of the manifesto lock still needs a quick manual pass
- [ ] `HeroScene` is cleaner, but it is still the densest motion file in the repo and remains the next candidate for extraction if more behavior accumulates there
