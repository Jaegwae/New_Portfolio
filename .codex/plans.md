# Plan

## Goal
Temporarily disable the ABOUT section on the home page without disturbing the remaining section flow.

## Current status
- not started
- in progress
- blocked
- ready for verification
- done

Current: done

## Checklist
- [x] remove the ABOUT item from the home section nav
- [x] stop rendering the ABOUT finale on the home page
- [x] rerun validation
- [x] update `next.md`
- [x] append `worklog`

## Checkpoints

### 1. Home deactivation
- keep the change inside the home scene composition
- remove only the visible ABOUT entry points for now

Done when:
- the home nav and rendered section stack no longer expose ABOUT

### 2. Flow safety
- keep manifesto, self-introduction, and portfolio behavior intact
- avoid unnecessary refactors to dormant ABOUT-related state

Done when:
- the remaining home sections behave the same aside from the ABOUT removal

### 3. Validation
- verify lint/test/typecheck/build output
- record the temporary ABOUT deactivation in repo docs

Done when:
- the deactivation pass is validated and recorded
