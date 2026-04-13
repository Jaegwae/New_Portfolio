# Architecture

## Purpose
This document defines the high-level page architecture for a personal portfolio website centered on case studies, identity, and editorial pacing.

## Route model
- `/`
  - home identity, selected work, credibility/worked-with, short personal statement, contact CTA

## Current implementation note
- the current codebase only implements the home route in `src/app/`
- `/work`, `/work/[slug]`, and `/about` remain architectural targets rather than live app routes in this repo state

## Composition rules
- route files own page composition, not dense content storage
- in the current repo, `src/components/` owns the section markup and section behavior
- content should live in `src/content/` when it needs to be reused or audited
- shared UI should live in `src/components/`
- reusable motion logic currently lives mostly in `src/lib/` (`gsap-reveal`, hero runtime helpers, fluid runtime helpers) plus `src/components/smooth-scroll-provider.tsx`
- `src/animations/` remains available for future extracted motion modules if the site grows beyond the current home-route setup

## Architectural priorities
1. identity clarity
2. selected work visibility
3. case-study readability
4. trust and credibility signals
5. simple contact paths

## Notes
- keep route hierarchy simple
- keep card structure consistent between home previews and work listing
- keep motion ownership understandable and section-scoped where possible
