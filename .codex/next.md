# Next

## Resume point
Resume after the temporary ABOUT deactivation pass:
- `hero-scene.tsx` no longer shows ABOUT in the home section nav
- the final ABOUT section is no longer rendered on the home page
- the underlying ABOUT-related home state was left mostly dormant for easier restoration later

## Next actions
1. if the user wants ABOUT restored later, decide whether to re-enable only the home finale or also rethink its content and placement
2. if dormant ABOUT-related hero state starts feeling unnecessary, do a separate cleanup pass instead of mixing it into layout work
3. keep future home changes focused on the now-visible sections: HOME, slogan, self-introduction, and portfolio

## Before editing again
- reread `AGENTS.md`
- reread `docs/file-map.md`
- reread `.codex/spec.md`
- reread `.codex/plans.md`
- check latest `docs/worklog.md`

## Last known concerns
- [ ] if ABOUT stays disabled for a while, a later cleanup pass can remove the dormant home-scene state that still references it internally
