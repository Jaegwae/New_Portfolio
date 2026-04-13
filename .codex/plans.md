# Plan

## Goal
Add denser AI-readable comments across the current codebase.

## Current status
- not started
- in progress
- blocked
- ready for verification
- done

Current: done

## Checklist
- [x] keep the existing regression coverage as the behavior lock
- [x] add detailed AI-readable comments across meaningful source/style files
- [x] keep behavior unchanged under tests
- [x] keep behavior unchanged under tests
- [x] rerun local validation
- [x] update `next.md`
- [x] append `worklog`

## Checkpoints

### 1. Behavior lock
- rely on the current validation suite before the docs cleanup pass

Done when:
- the current home/portfolio behavior is already covered before the docs edits

### 2. File split
- annotate the meaningful source/style logic boundaries so future AI edits can navigate the code faster

Done when:
- future AI edits can rely on the source comments for role/boundary context without changing behavior

### 3. Validation
- rerun repo checks locally and record the local-only refactor pass in repo docs

Done when:
- the refactor is validated and recorded
