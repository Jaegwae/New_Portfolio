# Plan

## Goal
Deploy and commit the home profile age text update to `만 26세`.

## Current status
- not started
- in progress
- blocked
- ready for verification
- done

Current: done

## Checklist
- [x] update the hero profile age text
- [x] rerun validation
- [x] redeploy the site
- [x] commit and push the change
- [x] update `next.md`
- [x] append `worklog`

## Checkpoints

### 1. Content fix
- update only the displayed age value in the hero profile
- keep the birth date string and layout unchanged

Done when:
- the home profile reads `2000.03.30 (만 26세)`

### 2. App safety
- avoid unrelated UI or motion edits
- ensure the app still validates after the text change

Done when:
- the age update integrates cleanly into the home route

### 3. Release
- redeploy the app so the age update is live
- commit and push the age update and related records

Done when:
- the age update is live and synced to GitHub

### 4. Validation
- verify deployment and post-push Git state
- record the age update in repo docs

Done when:
- the age update is validated and recorded
