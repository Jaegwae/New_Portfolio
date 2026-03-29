# Implementation Runbook

## Purpose
Default execution procedure for a motion-aware personal portfolio website.

## Workflow
1. Read:
   - `AGENTS.md`
   - `docs/file-map.md`
   - `docs/architecture.md`
   - `docs/portfolio-map.md`
   - `docs/motion-map.md`
   - `docs/writing-rules.md`
   - `docs/decisions.md`
   - `.codex/spec.md`
   - `.codex/plans.md`
   - `.codex/next.md`

2. Determine whether the task belongs to:
   - home identity
   - selected work
   - project detail/case study
   - about
   - footer/contact

3. Inspect only likely files first.
4. Choose the narrowest implementation that satisfies the spec.
5. Preserve project clarity, page purpose, and writing tone.
6. Check reduced-motion and mobile impact.
7. Run validation.
8. Update:
   - `.codex/plans.md`
   - `.codex/next.md`
   - `docs/worklog.md`

## Motion implementation discipline
- expressive motion belongs mostly on home and project hero sections
- work cards should stay scannable
- about sections should feel human and calm
- footer/contact should remain simple and obvious

## Validation commands
Use project-native commands.

Example baseline:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

If available, also run:
- pnpm test:e2e
- pnpm test:visual

## Completion summary format
At the end, summarize:
- files changed
- page/section changed
- user-visible behavior changed
- reduced-motion/mobile impact
- tests/checks run
- remaining concerns
