# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start local dev server (hot reload) |
| `npm run build` | TypeScript check + Vite production build → `dist/` |
| `npm test` | Run Vitest test suite (jsdom) |
| `npm run preview` | Preview production build locally |

Run a single test file: `npx vitest run src/storage.test.ts`

## Architecture

Single-page vanilla TypeScript app, no UI framework. Vite build. Deployed to GitHub Pages via GitHub Actions on push to `main`.

**Data flow:** `src/data/sections.ts` → `src/state.ts` → `src/ui/*.ts` → DOM

- **`src/data/sections.ts`** — 49 hard-coded sections: one FWC (special stickers) and 48 national teams. Each section has a `stickers: string[]` array of display labels (`"1"`–`"20"` for teams, `"00"` / `"FWC1"`–`"FWC19"` for the FWC section).
- **`src/storage.ts`** — localStorage read/write. Key: `goalsticker26`. Shape: `Record<sectionCode, boolean[]>`.
- **`src/state.ts`** — `createState()` hydrates from localStorage. `toggleSticker()` mutates in-place and persists immediately.
- **`src/ui/grid.ts`** — builds a 5-column grid of `<button>` circles. `updateCircle()` toggles `owned` class and sets `backgroundColor` inline.
- **`src/ui/sectionEl.ts`** — wraps heading + grid, uses event delegation on the grid for tap-to-toggle.
- **`src/ui/header.ts`** — sticky header with `<select>` dropdown; `scrollIntoView` on change.
- **`src/main.ts`** — entry: `createState()`, build header + all section elements, append to `#app`.

## Deployment

Push to `main` → GitHub Actions → GitHub Pages.
Live URL: `https://darkokostic95.github.io/GoalSticker26/`
Pages source is set to GitHub Actions (configured 2026-05-23 via API).
