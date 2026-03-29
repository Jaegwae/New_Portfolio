# Plan

## Goal
Restore the broken manifesto word-reveal interaction caused by the recent `HeroScene` state/ref cleanup.

## Current status
- not started
- in progress
- blocked
- ready for verification
- done

Current: done

## Checklist
- [x] reread the required docs and current task records
- [x] inspect the manifesto reveal regression in `hero-scene`
- [x] isolate the broken `manifestoWordProgress` state path
- [x] restore manifesto progress with the smallest safe change
- [x] add a regression test that exercises manifesto word brightening
- [x] rerun `lint`, `typecheck`, `test`, `build`, and `test:e2e`
- [x] update `next.md`
- [x] append `worklog`

## Checkpoints

### 1. Regression isolation
- verify that the broken reveal comes from the progress state/ref refactor rather than the wheel/touch listener itself
- keep the unrelated cleanup intact

Done when:
- the exact regression source is isolated

### 2. Minimal fix
- restore manifesto progress updates without reopening the rest of the cleanup pass
- keep the rest of the `HeroScene` cleanup intact

Done when:
- manifesto words brighten again without broader behavior drift

### 3. Verification
- rerun the full validation baseline
- add regression coverage for manifesto progress
- leave a note that live browser confirmation still matters for manifesto feel

Done when:
- the regression is fixed and the rest of the cleanup remains intact
