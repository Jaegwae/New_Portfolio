# AGENTS.md

## Purpose
This repository is a personal portfolio website with editorial motion, selected case studies, and a strong personal brand voice.
Always optimize for clarity, craftsmanship, readability, visual consistency, and recoverable task context.

## Read first
Before starting any non-trivial task, always read these files in order:
1. docs/file-map.md
2. docs/architecture.md
3. docs/portfolio-map.md
4. docs/motion-map.md
5. docs/writing-rules.md
6. docs/decisions.md
7. .codex/spec.md
8. .codex/plans.md
9. .codex/next.md
10. .codex/implement.md
11. docs/worklog.md

## Core rule
Do not rely on conversational memory alone.
Reconstruct the current task and section ownership from repository files first.

## Site assumptions
This site is a portfolio-first brand website.
Primary goals:
- communicate who the person is quickly
- present selected work clearly
- establish credibility through experience/collaborators
- guide visitors toward project detail pages or contact
- maintain a premium, editorial, motion-aware visual language

## Structure priorities
1. identity first
2. selected work second
3. credibility signals third
4. personal/about narrative fourth
5. contact or social CTA throughout

## Operating rules
- Prefer the smallest valid change that satisfies the written task.
- Do not mix content rewrite with unrelated motion refactors.
- Do not silently change page hierarchy or section purpose.
- Preserve scanability of project cards.
- Preserve visual rhythm and editorial pacing.
- Motion must support storytelling, not obscure content.
- Keep content and motion ownership understandable.

## Motion rules
- Home and section transitions may be expressive.
- Project cards and navigation should remain calm and readable.
- Avoid animation patterns that delay access to work.
- Respect reduced motion behavior.
- Prefer section-scoped animation over page-global orchestration unless clearly necessary.

## Content rules
- Home headline must communicate identity quickly.
- Selected work must remain the most important content block.
- Experience / worked-with content should feel like credibility support, not clutter.
- About copy should feel personal, concise, and aligned with the visual tone.
- Contact paths should remain obvious.

## Required workflow
For every non-trivial task:
1. Read required docs.
2. Confirm current task in `.codex/spec.md`.
3. Check progress in `.codex/plans.md`.
4. Resume from `.codex/next.md`.
5. Follow `.codex/implement.md`.
6. Identify whether the task affects:
   - home identity section
   - selected work section
   - credibility/worked-with section
   - about section
   - contact/footer section
   - work listing or case-study page
7. Implement the smallest safe change.
8. Update tests/checks where relevant.
9. Update `.codex/plans.md`.
10. Update `.codex/next.md`.
11. Append `docs/worklog.md`.
12. Run validation before claiming completion.

## Accessibility rules
- Support `prefers-reduced-motion`.
- Keep text readable without animation.
- Preserve keyboard access and visible focus states.
- Do not rely on animation alone to communicate meaning.

## Performance rules
- Prefer transform/opacity animation where possible.
- Keep media loading intentional.
- Avoid heavy client-side logic for simple editorial sections.
- Clean up animation instances when required.

## Validation
Use repository-native commands.

Default baseline:
- pnpm lint
- pnpm test
- pnpm typecheck
- pnpm build

## Definition of done
A task is done only if:
- acceptance criteria in `.codex/spec.md` are satisfied
- the affected section still serves its portfolio purpose
- reduced-motion behavior is not broken
- relevant validation passes
- unrelated files were not changed
- `.codex/next.md` is updated
- `docs/worklog.md` contains a concise summary

## Forbidden actions
- No broad redesign without explicit scope.
- No adding decorative sections that weaken the portfolio focus.
- No random motion patterns inconsistent with the site language.
- No claiming completion without checking mobile and reduced-motion impact.
