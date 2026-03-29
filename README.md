# Kim Jaegwan Portfolio

Personal portfolio website built with Next.js, GSAP, and Lenis.

Live site:
- https://portfolio-a9b1d.web.app/

## Overview

This project is a portfolio-first brand site focused on:

- clear personal identity
- selected work presentation
- editorial motion and pacing
- responsive reading experience

The home page is built as a motion-aware single-page experience with:

- HOME hero
- slogan section
- self-introduction section
- selected work section

## Stack

- Next.js 16
- React 19
- TypeScript
- GSAP
- Lenis
- Firebase Hosting
- Vitest
- Playwright

## Local Development

```bash
npm install
npm run dev
```

## Scripts

```bash
npm run dev
npm run lint
npm test
npm run typecheck
npm run build
npm run deploy:firebase
```

## Deployment

This repository is configured for static export deployment on Firebase Hosting.

- Firebase project: `portfolio-a9b1d`
- Hosting URL: `https://portfolio-a9b1d.web.app/`

Deploy the current build with:

```bash
npm run deploy:firebase
```

## Project Structure

```text
src/app/          Route entry and global styles
src/components/   Home sections and shared UI
src/content/      Portfolio and copy content
src/lib/          Shared helpers and motion utilities
docs/             Project maps and working notes
.codex/           Task recovery and progress tracking
```

## Notes

- The current Firebase Hosting setup uses static export.
- Self-introduction title line breaks are controlled with explicit `<br/>`.
- Reduced motion behavior is preserved across the main sections.
