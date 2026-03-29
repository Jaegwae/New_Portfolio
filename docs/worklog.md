# Worklog

## Purpose
Concise history of meaningful portfolio changes.

## Template

### [YYYY-MM-DD] Task title
- Type:
- Page:
- Section:
- Summary:
- Files changed:
  - `path/to/file`
- Reduced motion impact:
- Mobile impact:
- Tests / checks:
- Remaining concerns:

---

## Entries

### [2026-03-29] Manifesto progress state regression fix
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  manifesto intro word reveal
- Summary:
  The manifesto words were no longer brightening because `manifestoWordProgress` had been folded into the generic `useSyncedStateRef` cleanup path. Restored that one value to explicit `useState + useRef`, kept the rest of the cleanup intact, and added a regression test that exercises manifesto wheel-driven progress directly.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `tests/integration/hero-scene.test.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the fix only restores the standard-motion progress state path
- Mobile impact:
  touch and wheel driven manifesto reveal now share the same restored progress state path again
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm test`
  `npm run build`
  `npm run test:e2e`
- Remaining concerns:
  a quick live Chrome/Safari pass is still worth doing because automation now proves progress updates, but not the exact compositor feel

### [2026-03-29] Manifesto reveal regression fix
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  manifesto intro word reveal
- Summary:
  Restored the manifesto word-brightening interaction after the previous listener-scoping cleanup over-constrained the custom wheel/touch handler. The fix only rolls back that listener-availability change and keeps the rest of the cleanup pass intact.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the fix only restores the standard-motion manifesto input path
- Mobile impact:
  touch-driven manifesto reveal works again because the custom touch listener is no longer gated too aggressively
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm test`
  `npm run build`
  `npm run test:e2e`
- Remaining concerns:
  live Chrome/Safari confirmation is still needed for the exact manifesto feel because automation does not fully cover trackpad momentum

### [2026-03-29] Overlap and dead-code cleanup pass
- Type:
  home identity refinement / selected work update / performance cleanup
- Page:
  home
- Section:
  manifesto lock path, about board, portfolio content schema, global CSS, repo structure docs
- Summary:
  Cleaned the follow-up audit findings by scoping the manifesto wheel/touch listeners to the active interaction window, replacing decorative empty `AboutFinale` headings with non-heading placeholders, reducing `HeroScene` ref/state drift with a synced helper, removing the duplicate `body` declaration and unused schema/debug fields, and aligning the repo structure docs with the actual `components`/`lib` ownership.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/about-finale.tsx`
  - `src/content/portfolio-projects.ts`
  - `src/app/globals.css`
  - `docs/file-map.md`
  - `docs/architecture.md`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the manifesto listener cleanup still exits to the same reduced-motion path and only narrows when the custom listeners are mounted
- Mobile impact:
  mobile keeps the same manifesto lock and section order, with only the listener attachment window and decorative about markup cleaned up
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm test`
  `npm run build`
  `npm run test:e2e`
- Remaining concerns:
  a quick live Chrome/Safari pass is still worth doing to confirm the manifesto lock feels identical after the listener scoping change

### [2026-03-29] Interaction test surface expanded
- Type:
  home identity refinement / selected work update / performance cleanup
- Page:
  home
- Section:
  section navigation, selected work filters, selected work modal
- Summary:
  Added a repo-native Vitest integration layer for the motion-heavy interactions that headless Chrome could not assert reliably. The suite now covers portfolio filter narrowing, modal focus trap and focus restore, and the `HeroScene` right-nav jump issuing the expected `Lenis.scrollTo` call. Playwright smoke remains intentionally focused on stable HOME/manifesto/portfolio entry checks.
- Files changed:
  - `package.json`
  - `package-lock.json`
  - `vitest.config.ts`
  - `tests/setup/vitest.setup.tsx`
  - `tests/integration/portfolio-section.test.tsx`
  - `tests/integration/hero-scene.test.tsx`
  - `tests/e2e/home-smoke.spec.ts`
  - `tests/e2e/helpers.ts`
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because this pass only adds test surfaces and does not alter the live motion logic
- Mobile impact:
  none in this pass; the new automation stays on desktop jsdom and desktop Playwright surfaces only
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm test`
  `npm run build`
  `npm run test:e2e`
- Remaining concerns:
  full browser feel for the Lenis nav jump still needs manual Chrome/Safari confirmation because the new integration test proves the component call path, not compositor-level motion behavior

### [2026-03-28] Portfolio filter semantics cleanup
- Type:
  work card readability fix
- Page:
  home
- Section:
  selected work filters
- Summary:
  Replaced the incorrect `tablist/tab` semantics on the portfolio filters with grouped filter-button semantics, kept the same filtering behavior, and added visible focus indication for keyboard users.
- Files changed:
  - `src/components/portfolio-section.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only adjusts semantics and focus styling on the filter controls
- Mobile impact:
  mobile keeps the same filter layout and project switching behavior, with only semantics and focus visibility updated
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the repo still has no real automated tests for motion-heavy interactions beyond lint/typecheck/build

### [2026-03-28] Portfolio modal focus management
- Type:
  selected work update
- Page:
  home
- Section:
  selected work modal
- Summary:
  Added minimal dialog focus management to the portfolio modal by moving focus to the close button on open, trapping `Tab` within the modal while open, restoring focus to the previous launcher on close, and exposing visible focus styles for the launcher and modal controls.
- Files changed:
  - `src/components/portfolio-modal.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only changes keyboard focus management and visible focus states
- Mobile impact:
  mobile keeps the same modal layout and content, with keyboard focus behavior improved for hardware-keyboard scenarios
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the next semantics issue is the portfolio filter still using `tablist/tab` roles without full tab behavior

### [2026-03-28] Manifesto navigation lock fix
- Type:
  motion polish
- Page:
  home
- Section:
  section navigation / manifesto lock handoff
- Summary:
  Fixed the `hero-scene` section-navigation path so manifesto lock eligibility, active touch state, and running lock state are cleared before a section jump, preventing lower-section navigation from inheriting stale manifesto lock state.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the fix only clears stale interaction refs before a manual section jump
- Mobile impact:
  mobile now clears the same lingering touch-lock state before section jumps, so direct navigation behaves more consistently
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the next user-visible risk is the portfolio modal focus path, which still lacks complete dialog focus management

### [2026-03-28] Hero scene scroll-callback refactor
- Type:
  performance cleanup
- Page:
  home
- Section:
  hero scene scroll-state orchestration
- Summary:
  Refactored the large `useScrollScene` callback in `hero-scene` by extracting manifesto lock eligibility, HOME visual-state syncing, and section snap reset/trigger flow into named helpers while preserving the existing thresholds and HOME behavior.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the refactor preserves the same reduced-motion short-circuit and snap fallback path
- Mobile impact:
  mobile keeps the same HOME/manifesto/about pacing because the refactor only reorganizes the existing callback logic
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  this is intended as a no-behavior-change refactor, so a quick live Chrome pass should still confirm that HOME return pacing and section snap feel unchanged

### [2026-03-28] Manifesto input refactor
- Type:
  performance cleanup
- Page:
  home
- Section:
  manifesto wheel/touch lock path
- Summary:
  Refactored the manifesto lock input flow in `hero-scene` by extracting progress syncing, viewport pinning, and document nudge behavior into named helpers and moving the wheel/touch listener setup into a dedicated local hook.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the refactor preserves the same lock gating and still exits early when reduced motion is active
- Mobile impact:
  mobile keeps the same manifesto touch-lock behavior because the refactor preserves the same touch input path and thresholds
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  this is intended as a no-behavior-change refactor, so a quick live Chrome scroll pass should still confirm the latest HOME and manifesto flicker fixes feel unchanged

### [2026-03-28] Shared scroll-scene runtime
- Type:
  performance cleanup
- Page:
  home, portfolio, about
- Section:
  shared scroll scene runtime
- Summary:
  Refactored `useScrollScene` so multiple consumers now share one internal `resize`/`mediaQuery`/`scroll` runtime and one RAF scheduler, instead of each section mounting its own duplicate global listener chain.
- Files changed:
  - `src/lib/scroll-motion.ts`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the hook still reacts to the same media-query and scroll source changes
- Mobile impact:
  mobile keeps the same reveal timing and section order because the change is internal to the shared hook runtime
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  this is intended as a no-behavior-change runtime refactor, so a quick live Chrome scroll pass should still confirm the previous flicker fixes feel unchanged

### [2026-03-28] Duplicate and dead-code cleanup pass
- Type:
  performance cleanup
- Page:
  home, portfolio
- Section:
  hero support logic, section title reveal, portfolio modal
- Summary:
  Cleaned up the direct review findings by centralizing the repeated section-title reveal settings, reusing one manifesto-lock release helper, removing the unused `RotatingRole` wrapper export, and adding proper dialog semantics to the portfolio modal without changing the current visual behavior.
- Files changed:
  - `src/lib/scroll-motion.ts`
  - `src/components/hero-scene.tsx`
  - `src/components/about-sheet.tsx`
  - `src/components/about-finale.tsx`
  - `src/components/portfolio-section.tsx`
  - `src/components/rotating-role.tsx`
  - `src/components/portfolio-modal.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because this pass only removes duplication and improves markup semantics
- Mobile impact:
  mobile keeps the same section order, reveal values, and modal behavior because the cleanup does not alter layout thresholds or copy
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the larger remaining structural issue is still the repeated `useScrollScene` subscription pattern, which was left alone to avoid a broader motion architecture change

### [2026-03-28] HOME hero scene readability refactor
- Type:
  performance cleanup
- Page:
  home
- Section:
  hero scene orchestration
- Summary:
  Refactored the HOME hero scene to centralize section labels and extract named helpers for intro cover progress, active-section selection, hero retire state, ambient pause state, and snap-candidate selection, so the recent Chrome-flicker fixes remain intact but the component reads more clearly.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because this pass only reorganizes existing HOME scene calculations
- Mobile impact:
  mobile keeps the same section order, labels, and hero/manifesto pacing because thresholds and targets are unchanged
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  this is intended as a no-behavior-change refactor, so a quick live Chrome scroll pass should still confirm the latest flicker fixes feel the same

### [2026-03-28] HOME text compositing hint pass
- Type:
  motion polish
- Page:
  home
- Section:
  hero headline + typed role line
- Summary:
  Applied the recommended Chromium mitigation by adding narrow layer-separation hints (`translateZ(0)`, `backface-visibility: hidden`, `will-change: transform`) to the HOME Korean headline and typed line, while keeping the existing typewriter logic unchanged.
- Files changed:
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because this pass only adds compositing hints to static HOME text selectors
- Mobile impact:
  mobile keeps the same section order, typography, and typing rhythm with only the compositing path adjusted
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  manual Chromium confirmation is still required to judge visual improvement of the text tear/glitch during typing

### [2026-03-28] Reverted HOME typed line stabilization
- Type:
  motion polish
- Page:
  home
- Section:
  hero typed role line
- Summary:
  Reverted the full-word reveal experiment for the HOME typewriter after it changed the typing feel, restoring the previous substring-based text updates and removing the extra reveal and measurement styling.
- Files changed:
  - `src/components/rotating-role.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the revert only restores the prior standard-motion typing render path
- Mobile impact:
  mobile returns to the previous typed-line behavior and layout without changing section order or copy
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the previous typing feel is back, but any Chromium flicker tied to the old substring-based render path may also return

### [2026-03-28] HOME typed line stabilization
- Type:
  motion polish
- Page:
  home
- Section:
  hero typed role line
- Summary:
  Replaced the per-tick substring swap in the HOME typewriter with a stable full-word reveal path that measures the active word, clips only the visible width, and moves the caret without rewriting the visible text node every character.
- Files changed:
  - `src/components/rotating-role.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only changes how the existing typed line is rendered during standard motion
- Mobile impact:
  mobile keeps the same headline wording and line breaks, with only the typed-line rendering path switching from substring replacement to width reveal
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  Playwright confirms the full word stays mounted while reveal width changes and heading width stays constant, but final live Chromium verification is still needed for the exact flicker reduction

### [2026-03-28] HOME return ambient attachment cleanup
- Type:
  motion polish
- Page:
  home
- Section:
  HOME hero return path
- Summary:
  Narrowed the remaining Chromium-only return flicker to the HOME ambient pieces being detached with `animation: none` and then reattached mid-return, then kept the same wave/caret/scroll-dot animations mounted and simply paused them in place so Chromium does not have to rebuild those animations while the hero is coming back.
- Files changed:
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only changes how existing non-essential HOME ambient animations are paused on the standard-motion return path
- Mobile impact:
  mobile keeps the same section order and manifesto lock behavior, with only the HOME ambient return path switching from animation detachment to pause/resume
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  Playwright confirms the wave/caret/dot keep their animation names and report `animation-play-state: paused` during early return, but final live Chromium wheel and trackpad confirmation is still needed for the exact visual result

### [2026-03-28] HOME return ambient delay
- Type:
  motion polish
- Page:
  home
- Section:
  HOME hero return path
- Summary:
  Narrowed the remaining Chrome-only return flicker to wave/caret motion restarting too early while the hero was still scrolling back into place, then kept ambient motion paused longer so the fixed hero can reappear first and the wave/caret only resume near the top.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only delays non-reduced ambient reactivation on HOME return
- Mobile impact:
  mobile keeps the same section order and lock behavior, with only the HOME return path holding wave/caret a bit longer before reactivation
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  Playwright confirms the hero is already visible at early return while wave/caret remain paused, but final Chrome wheel and trackpad confirmation is still needed for the exact flicker reduction

### [2026-03-28] HOME return boundary softened
- Type:
  motion polish
- Page:
  home
- Section:
  HOME hero return path
- Summary:
  Narrowed the remaining Chrome-only return flicker to the fixed HOME layer reappearing too abruptly at the manifesto boundary, then added retire/restore hysteresis and switched the hero hidden state from `visibility` to composited opacity so the hero no longer snaps back on at a single frame.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only smooths the existing non-reduced HOME return boundary
- Mobile impact:
  mobile keeps the same section order and manifesto lock behavior, with only the fixed HOME layer restoring more gradually on the way back up
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  Playwright confirms the hero now stays retired through the manifesto boundary and restores only after a positive offset, but final live Chrome wheel and trackpad confirmation is still needed for the exact visual result

### [2026-03-28] Typed role line stabilized
- Type:
  motion polish
- Page:
  home
- Section:
  hero typed role line
- Summary:
  Split the typing text and caret into separate elements, added a hidden full-width reference string for stable layout width, disabled kerning/ligature features so Chrome does not shimmer as much while letters are appended, then restored the blinking caret by moving the blink keyframes to opacity and removing the extra one-character offset.
- Files changed:
  - `src/components/rotating-role.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because this only changes how the existing typed line is rendered
- Mobile impact:
  mobile keeps the same headline wording and typewriter behavior, with a steadier line box during typing
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  Playwright confirms the DOM/CSS split, `fontKerning: none`, `wordMinWidth: 0px`, and changing caret opacity, but final Chrome visual confirmation is still needed for the exact flicker reduction

### [2026-03-28] HOME return motion stabilized
- Type:
  motion polish
- Page:
  home
- Section:
  HOME hero return path
- Summary:
  Prevented the HOME wave field from replaying its intro draw animation after returning from lower sections, so the hero comes back in a settled ambient state instead of flashing like it is reloading.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only changes the non-reduced return path after the first HOME exit
- Mobile impact:
  mobile keeps the same section order and lock behavior, with only the returning HOME wave field becoming steadier
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  Playwright confirms the return-state wave animation is now `sway-wave` instead of `draw-line, sway-wave`, but a final real Chrome scroll/nav check is still needed

### [2026-03-28] Chrome handoff ambient pause
- Type:
  motion polish
- Page:
  home
- Section:
  HOME hero to manifesto / white intro handoff
- Summary:
  Traced the remaining Chrome-only handoff flicker to the fixed HOME hero continuing to run its wave SVG, typing caret, and scroll-indicator animations while being covered, then paused those ambient animations once HOME is no longer the active visible section.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/rotating-role.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because the patch only pauses non-essential ambient motion earlier in the existing handoff
- Mobile impact:
  mobile keeps the same section order and manifesto lock behavior, with only the covered HOME layer becoming quieter sooner
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  Playwright confirms the wave and caret animations resolve to `none` once the manifesto takes over, but final Chrome wheel and trackpad verification is still needed for the live flicker

### [2026-03-28] Manifesto reveal timing restored
- Type:
  motion polish
- Page:
  home
- Section:
  manifesto
- Summary:
  Removed the long dead zone at the start of the manifesto stage so the words begin brightening sooner again, while keeping the white-sheet cover gated until after the final word is lit.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/manifesto-section.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior is unchanged because this only adjusts reveal timing inside the existing motion path
- Mobile impact:
  mobile keeps the same structure and section order, with only the manifesto pacing starting earlier
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  browser check via Playwright on `http://localhost:3000`
- Remaining concerns:
  manual Chrome scrolling should still confirm the pacing feels right and that no remaining flicker distracts from the reveal

### [2026-03-28] Chrome desktop overflow fix
- Type:
  responsive layout fix
- Page:
  home
- Section:
  hero identity, manifesto
- Summary:
  Reproduced the Chrome desktop clipping issue, traced it to real horizontal overflow from the hero typed line and manifesto copy width, then constrained both sections and set the root background/overflow so the right edge no longer gets cut off.
- Files changed:
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond the existing reduced-motion behavior because the patch only adjusts width and overflow constraints
- Mobile impact:
  mobile keeps the same section order and behavior, with the manifesto width constraint mirrored on the small-screen rule
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the right-edge clipping is fixed at the tested 1228px desktop viewport, but the remaining live scroll flicker still needs manual Chrome confirmation

### [2026-03-28] Chrome flicker second pass
- Type:
  motion polish
- Page:
  home
- Section:
  hero to manifesto handoff, manifesto to about handoff
- Summary:
  Added a second Chrome-stability pass by retiring the fixed hero once the manifesto takes over, making the manifesto exit clearer, and removing leftover always-on compositing hints from inner reveal elements.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior stays intact because the patch only removes persistent layers and does not add new motion
- Mobile impact:
  mobile keeps the same section order and sizing, with only the hero retirement and manifesto exit timing changing
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  Playwright launches again, but scripted scroll does not fully mirror the live Lenis-driven handoff, so final Chrome confirmation still needs a real manual scroll check

### [2026-03-28] Chrome flicker and overlap cleanup
- Type:
  motion polish
- Page:
  home
- Section:
  manifesto to about handoff, portfolio to about handoff
- Summary:
  Simplified the home page section handoff to reduce Chrome-only flicker by removing whole-section wrapper translation, reducing large negative overlap between sections, and dropping unstable compositing hints from the largest animated wrappers.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion behavior stays intact because the patch removed wrapper motion rather than adding more
- Mobile impact:
  mobile keeps the same section order and sizing, with overlap reduced to a seam-safe handoff
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  manual Chrome verification is still needed because local Playwright launches remain blocked by the existing persistent-session issue

### [2026-03-28] Home motion cleanup refactor
- Type:
  performance cleanup
- Page:
  home
- Section:
  home reveal flow and portfolio support data
- Summary:
  Extracted a shared scroll-motion helper for repeated reveal behavior, refactored the home/about/portfolio sections to use it, removed dead manifesto/style/data leftovers, and stabilized the local typecheck command around the current Next.js setup.
- Files changed:
  - `src/lib/scroll-motion.ts`
  - `src/components/hero-scene.tsx`
  - `src/components/about-sheet.tsx`
  - `src/components/about-finale.tsx`
  - `src/components/portfolio-section.tsx`
  - `src/components/manifesto-section.tsx`
  - `src/content/about-sheet.ts`
  - `src/content/portfolio-projects.ts`
  - `src/app/globals.css`
  - `package.json`
  - `tsconfig.json`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion reset behavior is now shared through one helper instead of repeated per component
- Mobile impact:
  no intended layout change; existing mobile breakpoints were preserved while only dead classes and shared motion plumbing were cleaned up
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  local Playwright verification was blocked by the existing Chrome persistent-session launch issue, so final mobile/reduced-motion review was limited to code-path inspection plus static validation

### [2026-03-26] Portfolio harness initialized
- Type:
  repository workflow setup
- Page:
  global
- Section:
  global
- Summary:
  Added Codex-oriented portfolio, motion, and writing guidance for a personal brand website with selected work and editorial pacing.
- Files changed:
  - `AGENTS.md`
  - `docs/file-map.md`
  - `docs/portfolio-map.md`
  - `docs/motion-map.md`
  - `docs/writing-rules.md`
  - `docs/decisions.md`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `.codex/implement.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none
- Mobile impact:
  none
- Tests / checks:
  not applicable
- Remaining concerns:
  replace generic paths and commands with actual project structure

### [2026-03-26] Home hero section implemented
- Type:
  home identity refinement
- Page:
  home
- Section:
  hero
- Summary:
  Added the first landing section with a dark editorial hero, a top bar, large introduction copy for Kim Jaegwan, a typed `PROBLEM SOLVER` line, and an animated line-field background.
- Files changed:
  - `.impeccable.md`
  - `package.json`
  - `tsconfig.json`
  - `next-env.d.ts`
  - `next.config.ts`
  - `eslint.config.mjs`
  - `.gitignore`
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `src/components/wave-field.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  typing, wave motion, and scroll indicator collapse safely under `prefers-reduced-motion`
- Mobile impact:
  hero typography and wave field reflow with smaller clamps and repositioned background
- Tests / checks:
  `npm install`
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  selected work and the rest of the portfolio pages are still not implemented

### [2026-03-26] Hero typography adjusted
- Type:
  home identity refinement
- Page:
  home
- Section:
  hero
- Summary:
  Switched the hero typography to Pretendard and adjusted the typed role line so `I'm a PROBLEM SOLVER` stays on one line on desktop instead of breaking awkwardly.
- Files changed:
  - `src/app/layout.tsx`
  - `src/app/globals.css`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond existing hero motion behavior
- Mobile impact:
  desktop line wrapping was tightened while small screens still allow a controlled fallback
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the next section under the hero is still not implemented

### [2026-03-26] Hero headline wrap fixed
- Type:
  home identity refinement
- Page:
  home
- Section:
  hero
- Summary:
  Tightened the desktop headline sizing and wrapping rules so the Korean introduction stays on one line more reliably, and adjusted spacing between `I'm a` and `PROBLEM SOLVER`.
- Files changed:
  - `src/app/globals.css`
  - `docs/worklog.md`
- Reduced motion impact:
  none
- Mobile impact:
  desktop wrap rules were strengthened while smaller breakpoints still allow controlled wrapping
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  visual fine-tuning may still be needed after the next section is added

### [2026-03-26] Hero role text set to rotate
- Type:
  motion polish
- Page:
  home
- Section:
  hero
- Summary:
  Replaced the fixed role text with a rotating typed sequence so the line under the main headline continuously changes instead of staying static.
- Files changed:
  - `src/components/rotating-role.tsx`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `docs/worklog.md`
- Reduced motion impact:
  caret remains minimal and the typed word falls back safely under reduced-motion rules
- Mobile impact:
  dynamic word area keeps a reserved width on desktop and relaxes on smaller screens
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  exact rotating word list can still be changed to match the final portfolio positioning

### [2026-03-26] Full-screen menu overlay added
- Type:
  home identity refinement
- Page:
  home
- Section:
  menu overlay
- Summary:
  Added a full-screen menu overlay with a close button, vertical navigation, grayscale image panel, and an angled hero preview panel to match the captured menu-open composition more closely.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `docs/worklog.md`
- Reduced motion impact:
  overlay uses simple opacity transitions only
- Mobile impact:
  overlay collapses into a single-column stack and keeps the preview card centered
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  menu items are visual placeholders until additional pages and routing are implemented

### [2026-03-26] Menu open animation staged
- Type:
  motion polish
- Page:
  home
- Section:
  menu overlay
- Summary:
  Reworked the menu opening behavior so the overlay fades in with staged motion: side panels slide, the photo reveals upward, navigation items stagger in, and the preview card rotates and slides into place instead of appearing instantly.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `docs/worklog.md`
- Reduced motion impact:
  overlay transitions are disabled under `prefers-reduced-motion`
- Mobile impact:
  the animated preview card keeps a centered target transform on smaller screens
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  animation timing can still be tuned further against the final menu content

### [2026-03-26] Menu overlay close flow fixed
- Type:
  motion polish
- Page:
  home
- Section:
  menu overlay
- Summary:
  Reworked the menu overlay into a mounted/open/close sequence so the menu now animates out instead of disappearing abruptly, reset browser-native button styling, added backdrop click and `Escape` close handling, and tightened the preview/menu spacing.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  close unmount timing collapses to a minimal delay when `prefers-reduced-motion` is enabled
- Mobile impact:
  existing stacked overlay layout is preserved while the same open/close sequence now applies on smaller screens
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  local Playwright verification is still blocked by an existing Chrome persistent session, so final motion tuning was done from code and the user capture rather than an automated browser run

### [2026-03-26] Menu reverse timing refined
- Type:
  motion polish
- Page:
  home
- Section:
  menu overlay
- Summary:
  Split the menu into explicit open and closing states so stagger delays apply only on entry, while close transitions now reverse immediately without lingering delays or early unmounting.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the close timer still collapses to a minimal delay under `prefers-reduced-motion`
- Mobile impact:
  the same reverse timing behavior now applies to the stacked mobile overlay layout
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  extracting multiple intermediate frames from the latest reference video was limited by missing local video tooling, so the motion was tuned from the available thumbnail state and the user's direction

### [2026-03-26] Menu opening phase rebuilt
- Type:
  motion polish
- Page:
  home
- Section:
  menu overlay
- Summary:
  Rebuilt the menu overlay around explicit `closed/opening/open/closing` phases so the menu now animates from a true closed state into its final composition instead of feeling like an already-open layout fading in.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the new phase model still collapses to near-instant transitions under `prefers-reduced-motion`
- Mobile impact:
  the stacked mobile overlay inherits the same phase-based open animation
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  local frame extraction from the newest reference video was constrained by missing `ffmpeg` and incompatible Swift toolchain video scripting, so finer motion matching still depends on iterative visual feedback

### [2026-03-26] Menu opening slowed and staged
- Type:
  motion polish
- Page:
  home
- Section:
  menu overlay
- Summary:
  Adjusted the menu opening to feel closer to the `edwinle.com` reference by slowing the panel reveal, making the sheet open from a more clearly closed top-anchored state, and delaying the menu text and preview content so the composition unfolds in visible stages.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the longer open timing still collapses safely under `prefers-reduced-motion`
- Mobile impact:
  the same slower panel-first reveal applies to the stacked mobile overlay
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  direct frame-by-frame extraction from the live reference remains limited by local tool availability, so final matching still depends on visual iteration

### [2026-03-26] Menu motion rewritten as keyframes
- Type:
  motion polish
- Page:
  home
- Section:
  menu overlay
- Summary:
  Replaced most transition-based menu motion with explicit opening and closing keyframe sequences so the menu behaves more like a sheet unfolding first, followed by delayed navigation, image, and preview-card reveals.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the new keyframe sequence still collapses under `prefers-reduced-motion`
- Mobile impact:
  the same keyframe-driven motion applies to the mobile stacked overlay layout
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the timing is now much more explicit, but matching the feel still depends on iterative visual comparison rather than direct 1:1 extraction from the reference site

### [2026-03-26] Menu overlay removed
- Type:
  home identity refinement
- Page:
  home
- Section:
  hero
- Summary:
  Removed the full-screen menu overlay entirely and restored the hero to a simpler identity-first composition with a static top-left portfolio label instead of a menu trigger.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  removing the menu also removes its animation path and leaves only the hero motion system
- Mobile impact:
  the top bar is now simpler and lighter on smaller screens
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the page below the hero is still empty and needs the selected work section next

### [2026-03-26] Hero top bar removed
- Type:
  home identity refinement
- Page:
  home
- Section:
  hero
- Summary:
  Removed the remaining top-bar labels so the first screen is now fully focused on the main headline, rotating role line, and supporting copy.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `docs/worklog.md`
- Reduced motion impact:
  none
- Mobile impact:
  the hero starts slightly higher and has less unused top chrome on small screens
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the next section under the hero is still not implemented

### [2026-03-26] Draggable introduction sheet added
- Type:
  home identity refinement
- Page:
  home
- Section:
  hero introduction sheet
- Summary:
  Added a draggable white bottom sheet that rises over the dark hero, snaps open or closed, reuses the self-introduction content from the existing portfolio, and removes the last dead menu overlay styles.
- Files changed:
  - `src/components/about-sheet.tsx`
  - `src/components/hero-scene.tsx`
  - `src/content/about-sheet.ts`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  sheet motion collapses to minimal timing while preserving the same open and closed states
- Mobile impact:
  the sheet uses a smaller visible peek, single-column copy layout, and tighter spacing on small screens
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  drag feel may still need another pass after comparing it directly against the latest user capture

### [2026-03-26] Introduction sheet changed to scroll reveal
- Type:
  motion polish
- Page:
  home
- Section:
  hero introduction sheet
- Summary:
  Replaced the draggable white sheet with a scroll-driven full-screen overlay that stays hidden at first, rises only when the page scrolls, and recenters the self-introduction content into a cleaner editorial composition.
- Files changed:
  - `src/components/about-sheet.tsx`
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the reveal now follows page scroll directly instead of relying on separate drag motion
- Mobile impact:
  the centered introduction block uses tighter padding and smaller type while keeping the same scroll-driven reveal
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the reveal timing may still need another visual pass against the user's latest capture

### [2026-03-26] Introduction section moved into page flow
- Type:
  motion polish
- Page:
  home
- Section:
  hero to introduction transition
- Summary:
  Replaced the in-hero white overlay with a real next section so the white introduction area now rises from the black section below during scroll instead of appearing mid-screen inside the hero.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the transition now relies on normal page scroll rather than extra motion state
- Mobile impact:
  the same below-the-fold entry pattern is preserved while the introduction block keeps the centered mobile layout
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  entry timing and section height may still need another pass after user review

### [2026-03-26] Introduction cover effect refined
- Type:
  motion polish
- Page:
  home
- Section:
  hero to introduction transition
- Summary:
  Reintroduced scroll-based hero fading so the first section gradually disappears while the white introduction section rises from below, removed the introduction meta line, forced the Korean title to stay on one line on desktop, and unified the body copy sizing.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/about-sheet.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the cover effect collapses to direct scroll behavior without lingering transitions
- Mobile impact:
  the title wraps again on smaller screens while the unified body size is scaled down to preserve readability
- Tests / checks:
  `npm run lint`
  `npm run build`
  `npm run typecheck`
- Remaining concerns:
  the overlap timing may still need one more pass after the user checks the live result

### [2026-03-26] Hero darkening and intro scale adjusted
- Type:
  home identity refinement
- Page:
  home
- Section:
  hero and introduction
- Summary:
  Kept the hero text fixed in place during the cover transition, made the hero darken faster as the white section rises, restored a simple `자기소개` eyebrow in the second section, and reduced the introduction title/body type scale for a calmer editorial balance.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/about-sheet.tsx`
  - `src/content/about-sheet.ts`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  the fixed-position hero and color transition still collapse cleanly under reduced motion
- Mobile impact:
  the introduction title still wraps on smaller screens while the reduced body scale preserves readability
- Tests / checks:
  `npm run lint`
  `npm run build`
  `npm run typecheck`
- Remaining concerns:
  hero overlap timing may still need one more visual pass after the user checks the live result

### [2026-03-27] Manifesto stage rebuilt
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  manifesto to white introduction transition
- Summary:
  Rebuilt the manifesto stage so the copy is truly pinned during word-by-word color reveal, moved the reveal and white-sheet cover onto separate progress phases, removed sticky-breaking overflow on the home wrapper, and delayed the white introduction until the final manifesto word completes.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/manifesto-section.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  manifesto still degrades safely because the word reveal logic remains content-first and the next section no longer depends on decorative movement
- Mobile impact:
  manifesto height and white-sheet overlay offsets were updated on smaller breakpoints to preserve the same stage order
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  left offset and density of the manifesto lines may still need another visual pass after user review

### [2026-03-27] Manifesto reveal timing and Chrome repaint reduced
- Type:
  motion polish
- Page:
  home
- Section:
  manifesto
- Summary:
  Slowed the manifesto word reveal, delayed exit so `MIND.` reaches full white before the next section visibly advances, and reduced Chrome flicker by removing scroll-driven transition/filter combinations from major fixed layers.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/manifesto-section.tsx`
  - `src/app/globals.css`
  - `docs/worklog.md`
- Reduced motion impact:
  no additional reduced-motion burden; the reveal still degrades to a simple readable sequence
- Mobile impact:
  manifesto stage height was increased on smaller breakpoints to keep the slower reveal readable
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  Chrome should still be visually checked by the user because repaint artifacts can differ from Playwright rendering

### [2026-03-27] White-sheet rise slowed
- Type:
  motion polish
- Page:
  home
- Section:
  manifesto to white introduction transition
- Summary:
  Slowed the white introduction cover so it rises later than the manifesto exit, stretched the manifesto stage for a longer reveal window, and simplified several scroll-driven text effects to reduce Chrome flicker.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond existing manifesto and cover gating
- Mobile impact:
  manifesto stage height was increased on smaller breakpoints to keep the slower reveal pacing consistent
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  Chrome may still need one more targeted pass if a specific layer is still flashing on the user's machine

### [2026-03-27] White-sheet cover softened and Chrome layer load reduced
- Type:
  motion polish / performance cleanup
- Page:
  home
- Section:
  manifesto to white introduction transition
- Summary:
  Slowed the white introduction rise with a separate softer cover-progress curve, increased manifesto stage height to create a longer overlap window, and removed the large animated filter from the portfolio section to reduce Chrome flicker.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond the existing content-first reveal flow
- Mobile impact:
  manifesto stage height was increased on tablet and mobile to preserve the slower cover timing
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  Chrome may still need one more visual pass if a remaining fixed or transformed layer continues to flash on the user's machine

### [2026-03-27] White-sheet cover model rebuilt
- Type:
  motion polish / performance cleanup
- Page:
  home
- Section:
  manifesto to white introduction transition
- Summary:
  Replaced the white introduction's transform-pulled lift with a natural overlap model so it rises more like the later about section, froze the manifesto visually during overlap, and removed the large portfolio filter to further reduce Chrome flicker.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond the existing staged manifesto reveal and section overlap behavior
- Mobile impact:
  manifesto height and overlap offsets were adjusted on tablet and mobile to preserve the slower cover rhythm
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the user still needs to confirm whether the new natural overlap fully matches the desired about-like cover behavior in live Chrome

### [2026-03-27] Manifesto alignment and intro snap restored
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  manifesto and white introduction entry
- Summary:
  Left-aligned the manifesto copy block with wider spacing between lines and restored the white introduction section as a one-time snap target so it pauses once on entry.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond the existing snap and section-overlap behavior
- Mobile impact:
  manifesto spacing and left offset were adjusted on mobile to keep the left-aligned block readable
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the manifesto block and the white intro snap threshold still need live browser confirmation for final feel

### [2026-03-28] Intro section ownership split
- Type:
  home identity refinement / responsive layout fix
- Page:
  home
- Section:
  manifesto and white introduction sections
- Summary:
  Split the black manifesto into its own introduction section and kept the white content as a separate self-introduction section, updating navigation labels, click targets, and active-section logic to match.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond the existing section snap and overlap behavior
- Mobile impact:
  no structural mobile changes beyond the new section identity and navigation behavior
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  the active-state threshold between `소개` and `자기소개` may still need one live-browser tuning pass

### [2026-03-28] Manifesto final-word gate tightened
- Type:
  motion polish
- Page:
  home
- Section:
  manifesto to about-sheet handoff
- Summary:
  Kept the manifesto reveal as direct per-word text-color changes and delayed the white-sheet cover until the explicit exit phase begins after the final word is already bright.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond the existing staged manifesto reveal and handoff timing
- Mobile impact:
  none beyond the existing sticky manifesto pacing
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  manual Chrome review still matters because the live wheel/trackpad feel can differ slightly from scripted Playwright scroll steps

### [2026-03-28] Manifesto exit motion removed before handoff
- Type:
  motion polish
- Page:
  home
- Section:
  manifesto to about-sheet handoff
- Summary:
  Removed the manifesto copy's early fade/translate exit so the lines stay on screen while the words brighten, and verified the white sheet still waits until after the final word is lit.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond preserving the existing sticky manifesto and staged handoff
- Mobile impact:
  none beyond preserving the existing sticky manifesto pacing
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  manual Chrome review still matters for the exact wheel/trackpad feel even though Playwright confirms the manifesto copy no longer exits before the white sheet begins

### [2026-03-28] Manifesto section length reduced
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  black manifesto introduction
- Summary:
  Reduced the manifesto section height across breakpoints so the word-by-word reveal now completes in about one screen of scroll instead of stretching across multiple screens.
- Files changed:
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond preserving the existing pinned manifesto and gated handoff behavior
- Mobile impact:
  reduced the manifesto height on tablet and mobile too so the intro does not overstay on smaller screens
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  live Chrome and Safari should still be checked for the exact feel because trackpad momentum can make the shorter range feel slightly different from scripted Playwright wheel steps

### [2026-03-28] Manifesto section length reduced again
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  black manifesto introduction
- Summary:
  Reduced the manifesto section height more aggressively so the black intro now plays as a tighter single-page beat and the white self-introduction starts rising much sooner after the final word.
- Files changed:
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond preserving the existing pinned manifesto and gated handoff behavior
- Mobile impact:
  reduced the manifesto height on tablet and mobile too so the shorter pacing carries across breakpoints
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  live wheel and trackpad feel should still be checked in Chrome and Safari because the tighter range may now feel slightly fast even though the handoff is much closer

### [2026-03-28] Manifesto converted to one-page locked intro
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  black manifesto introduction
- Summary:
  Converted the manifesto into a single-viewport interaction section: while it is on screen, wheel/touch input only brightens the manifesto words, and once the final word completes the document scroll releases so the white self-introduction rises immediately below.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  reduced-motion users still skip the locked reveal and go straight to readable content without the pinning behavior
- Mobile impact:
  the manifesto section is now constrained to one viewport on smaller screens too, and touch input is consumed the same way as wheel input during the reveal
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  real Chrome and Safari wheel/trackpad feel should still be checked even though Playwright now confirms `scrollY` pins at the manifesto top while the words brighten and only releases after the final word

### [2026-03-28] Manifesto entry and handoff softened
- Type:
  home identity refinement / motion polish
- Page:
  home
- Section:
  black manifesto introduction to white self-introduction handoff
- Summary:
  Added a short dark buffer after the manifesto pins so the first word does not brighten immediately, and reduced the release nudge so the white self-introduction rises more gently after the final word.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `src/components/manifesto-section.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond preserving the reduced-motion bypass of the locked reveal
- Mobile impact:
  touch input now gets the same softened pin-and-release pacing as wheel input
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  real Chrome and Safari should still be checked because trackpad momentum may make the softened release feel slightly different from the scripted Playwright samples

### [2026-03-28] White-sheet seam hidden before cover
- Type:
  motion polish
- Page:
  home
- Section:
  manifesto to white self-introduction boundary
- Summary:
  Hid the white self-introduction's top glow, shadow, and slight vertical offset until `cover-progress` becomes non-zero so the bottom edge of the manifesto stays fully black before the handoff starts.
- Files changed:
  - `src/app/globals.css`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond preserving the existing reduced-motion bypass of the manifesto lock
- Mobile impact:
  the hidden seam behavior applies the same way on smaller screens so the white section does not peek early at the bottom edge
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
- Remaining concerns:
  real Safari and Chrome should still be checked because the exact bottom-edge seam can vary slightly with browser compositing and viewport chrome

### [2026-03-28] Playwright smoke baseline added
- Type:
  home identity refinement / selected work update / test coverage
- Page:
  home
- Section:
  home identity, manifesto intro, selected work
- Summary:
  Added a small Playwright smoke-test baseline and repo-native `npm run test:e2e` command. The suite now checks that the home identity renders, the manifesto section enters before the white intro cover takes over, the selected-work section renders its heading/filters/cards, and project-detail launcher buttons remain accessible. The first attempt at deeper nav/filter/modal browser automation was intentionally narrowed back to stable structure and section-state coverage after headless Chrome proved unreliable for some motion-heavy paths.
- Files changed:
  - `package.json`
  - `package-lock.json`
  - `.gitignore`
  - `playwright.config.ts`
  - `tests/e2e/helpers.ts`
  - `tests/e2e/home-smoke.spec.ts`
  - `tests/e2e/portfolio-smoke.spec.ts`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  selected-work smoke runs under reduced motion so the baseline still covers the lower-motion path explicitly
- Mobile impact:
  none in this pass; the new coverage uses a fixed desktop viewport only
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  `npm run test:e2e`
- Remaining concerns:
  richer automated checks for nav-driven scrolling, filter toggling, and modal focus loops still need a safer test surface than the current headless Chrome motion path exposes

### [2026-03-29] Section-nav jump guard added for selected work
- Type:
  home identity refinement / selected work update / motion polish
- Page:
  home
- Section:
  right-side section navigation to manifesto/self-intro/selected work
- Summary:
  Scoped the existing scroll-transition guard so explicit section-nav jumps are treated differently from ordinary downward scrolling. This prevents the manifesto/section auto-snap from hijacking a manual `포트폴리오` jump mid-flight, which was causing the first click from HOME to stop on `소개` instead of selected work.
- Files changed:
  - `src/components/hero-scene.tsx`
  - `.codex/spec.md`
  - `.codex/plans.md`
  - `.codex/next.md`
  - `docs/worklog.md`
- Reduced motion impact:
  none beyond preserving the existing immediate release path when reduced motion is active
- Mobile impact:
  the same manual-jump guard now applies to touch-driven section-nav taps as well because it sits above the shared scroll-transition state
- Tests / checks:
  `npm run lint`
  `npm run typecheck`
  `npm run build`
  `npm run test:e2e`
- Remaining concerns:
  the exact one-click HOME -> selected-work jump still needs live Chrome/Safari confirmation because current headless Chrome is not a reliable assertion surface for the full Lenis nav-click path
