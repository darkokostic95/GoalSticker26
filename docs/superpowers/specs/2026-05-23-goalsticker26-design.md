# GoalSticker26 — Design Spec

**Date:** 2026-05-23
**Status:** Approved

## Overview

A single-page web app to track Panini FIFA World Cup 2026 sticker duplicates. Primary use case: standing at a swap meet, quickly checking which stickers you already own for a given national team.

## Tech Stack

- **Language:** TypeScript
- **Build:** Vite (static output to `dist/`)
- **Styling:** Plain CSS (no framework)
- **Deployment:** GitHub Actions → GitHub Pages at `https://darkokostic95.github.io/GoalSticker26/`
- **Data:** localStorage only — no backend, works offline

## Album Data

48 national teams, each with exactly 20 stickers identified by team code + number (e.g. `ARG1`–`ARG20`). Total: 960 team stickers. Real Panini codes used throughout (ARG, BRA, FRA, etc.).

Teams defined in `src/data/teams.ts` — a static typed array, easy to update if the album data changes.

## File Structure

```
GoalSticker26/
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
├── .github/
│   └── workflows/
│       └── deploy.yml
└── src/
    ├── main.ts              # entry point: bootstraps app, wires up events
    ├── data/
    │   └── teams.ts         # 48 teams: code, name, primary color, sticker count
    ├── storage.ts           # localStorage read/write
    ├── state.ts             # in-memory app state
    ├── ui/
    │   ├── header.ts        # sticky top bar with team quick-select dropdown
    │   ├── grid.ts          # renders one team's 5×4 sticker number grid
    │   └── teamSection.ts   # combines team heading + grid into a page section
    └── style.css
```

## Data Model

### Team definition (`src/data/teams.ts`)

```typescript
interface Team {
  code: string;    // "ARG" — matches Panini album code
  name: string;    // "Argentina"
  color: string;   // "#75AADB" — primary color for filled sticker circles
  count: number;   // 20 for all teams
}
```

All 48 teams hard-coded with real Panini codes and a primary color derived from each nation's kit/flag palette.

### Sticker ownership (`src/storage.ts`)

```typescript
// localStorage key: "goalsticker26"
// Shape: Record<teamCode, boolean[]>
// e.g. { "ARG": [true, false, false, true, ...] }
// index 0 = sticker #1, index 19 = sticker #20
```

Missing teams default to an array of `false` on load. Writes are synchronous on every tap — no debouncing needed at 960 booleans total.

### In-memory state (`src/state.ts`)

```typescript
interface AppState {
  owned: Record<string, boolean[]>;  // hydrated from localStorage on boot
  activeTeam: string;                // team code currently scrolled into view
}
```

State mutates in place. Only the affected sticker circle gets a CSS class toggled on tap — no full re-renders.

## UI Layout

### Sticky header

- App name "GoalSticker26" (left)
- `<select>` dropdown listing all 48 teams (right)
- Selecting a team calls `scrollIntoView({ behavior: 'smooth', block: 'start' })` on that section

### Team sections (scrollable, one after another)

Each section:
- Team name + flag emoji as heading
- 5-column × 4-row grid (5×4 = 20 stickers)
- Each cell: a circle element containing the sticker number

### Sticker circle states

| State | Visual |
|-------|--------|
| Not owned | Circle outline only, no fill |
| Owned | Full circle filled with team color, light/dark number text for contrast |

Single tap toggles state → updates class → persists to localStorage.

### Mobile viewport sizing

The sticky header + first team section is sized to fill exactly `100dvh` — the first team is fully visible without scrolling on a phone screen. Subsequent teams are reached by scrolling down.

## CI/CD

### GitHub Actions (`.github/workflows/deploy.yml`)

Trigger: push to `main`

Steps:
1. `actions/checkout`
2. `actions/setup-node` (Node 20)
3. `npm ci`
4. `npm run build`
5. `actions/configure-pages`
6. `actions/upload-pages-artifact` (uploads `dist/`)
7. `actions/deploy-pages`

### Vite config

```typescript
export default defineConfig({
  base: '/GoalSticker26/',
  build: { outDir: 'dist' }
})
```

### GitHub Pages

Already configured to source from GitHub Actions (set via API on 2026-05-23).
Live URL: `https://darkokostic95.github.io/GoalSticker26/`

## Constraints & Decisions

| Decision | Rationale |
|----------|-----------|
| localStorage only | Zero infrastructure, works offline at swap meets |
| Binary have/don't have | Fastest interaction, sufficient for the use case |
| Vanilla TS, no framework | App is small enough; no reactive framework overhead |
| Vite build | Modern DX, static output, trivial GitHub Pages CI |
| Hard-coded team data | Album structure is fixed; a config file is easier than a data-entry UI |
| No routing | Single scrollable document; dropdown jumps to section |
