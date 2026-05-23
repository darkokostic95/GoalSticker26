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

**Total: 980 stickers** across two types of sections:

### Special section — FWC (20 stickers)

Appears first in the album. All stickers are FOIL.

| Code | Description |
|------|-------------|
| `00` | Panini Logo |
| `FWC1` | Official Emblem |
| `FWC2` | Official Emblem |
| `FWC3` | Official Mascots |
| `FWC4` | Official Slogan |
| `FWC5` | Official Ball |
| `FWC6` | Host Country — Canada |
| `FWC7` | Host Country — Mexico |
| `FWC8` | Host Country — USA |
| `FWC9` | FIFA Museum — Italy 1934 |
| `FWC10` | FIFA Museum — Uruguay 1950 |
| `FWC11` | FIFA Museum — West Germany 1954 |
| `FWC12` | FIFA Museum — Brazil 1962 |
| `FWC13` | FIFA Museum — West Germany 1974 |
| `FWC14` | FIFA Museum — Argentina 1986 |
| `FWC15` | FIFA Museum — Brazil 1994 |
| `FWC16` | FIFA Museum — Brazil 2002 |
| `FWC17` | FIFA Museum — Italy 2006 |
| `FWC18` | FIFA Museum — Germany 2014 |
| `FWC19` | FIFA Museum — Argentina 2022 |

### National team sections — 48 teams (960 stickers)

Each team has exactly 20 stickers using Panini team codes (e.g. `ARG1`–`ARG20`).

Teams: MEX, RSA, KOR, CZE, CAN, BIH, QAT, SUI, BRA, MAR, HAI, SCO, USA, PAR, AUS, TUR, GER, CUW, CIV, ECU, NED, JPN, SWE, TUN, BEL, EGY, IRN, NZL, ESP, CPV, KSA, URU, FRA, SEN, IRQ, NOR, ARG, ALG, AUT, JOR, POR, COD, UZB, COL, ENG, CRO, GHA, PAN

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
    │   └── sections.ts      # all 49 sections (1 FWC + 48 teams): code, name, color, stickers[]
    ├── storage.ts           # localStorage read/write
    ├── state.ts             # in-memory app state
    ├── ui/
    │   ├── header.ts        # sticky top bar with section quick-select dropdown
    │   ├── grid.ts          # renders one section's sticker grid
    │   └── sectionEl.ts     # combines section heading + grid into a page section
    └── style.css
```

## Data Model

### Section definition (`src/data/sections.ts`)

```typescript
interface Section {
  code: string;      // "ARG", "FWC"
  name: string;      // "Argentina", "FIFA World Cup"
  color: string;     // team primary color, or gold (#D4AF37) for FWC
  stickers: string[]; // ["1","2",...,"20"] for teams; ["00","FWC1",...,"FWC19"] for FWC
}
```

The `stickers` array holds the display label for each sticker cell. This handles both the simple `1–20` numbering for teams and the mixed codes (`00`, `FWC1`–`FWC19`) for the special section. The grid renders whatever labels are in the list.

All 49 sections hard-coded in `sections.ts` — the FWC section first, followed by 48 national teams in album order.

### Sticker ownership (`src/storage.ts`)

```typescript
// localStorage key: "goalsticker26"
// Shape: Record<sectionCode, boolean[]>
// e.g. { "ARG": [true, false, false, true, ...] }
//       "FWC": [false, true, false, ...]
// index maps directly to stickers[] position
```

Missing sections default to an array of `false` on load. Writes are synchronous on every tap — no debouncing needed at 980 booleans total.

### In-memory state (`src/state.ts`)

```typescript
interface AppState {
  owned: Record<string, boolean[]>;  // hydrated from localStorage on boot
  activeSection: string;             // section code currently scrolled into view
}
```

State mutates in place. Only the affected sticker circle gets a CSS class toggled on tap — no full re-renders.

## UI Layout

### Sticky header

- App name "GoalSticker26" (left)
- `<select>` dropdown listing all 49 sections — FWC first, then all 48 teams (right)
- Selecting a section calls `scrollIntoView({ behavior: 'smooth', block: 'start' })` on that section element

### Section list (scrollable, one after another)

Order: FWC section first, then 48 national team sections in album order.

Each section:
- Section name + flag emoji as heading (🌍 for FWC)
- Grid of sticker circles — 5 columns, rows as needed (FWC: 4 rows of 5 = 20; teams: 4 rows of 5 = 20)
- Each cell: a circle element displaying the sticker label

### Sticker circle states

| State | Visual |
|-------|--------|
| Not owned | Circle outline only, no fill |
| Owned | Full circle filled with section color, light/dark number text for contrast |

Single tap toggles state → updates CSS class → persists to localStorage.

### Mobile viewport sizing

The sticky header + first section (FWC) is sized to fill exactly `100dvh` — fully visible without scrolling on a phone. Subsequent sections reached by scrolling down.

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
| `stickers: string[]` instead of `count: number` | FWC section has non-numeric codes; generalising to labels covers both cases cleanly |
| Vanilla TS, no framework | App is small enough; no reactive framework overhead |
| Vite build | Modern DX, static output, trivial GitHub Pages CI |
| Hard-coded section data | Album structure is fixed; a typed config file is easier than a data-entry UI |
| No routing | Single scrollable document; dropdown jumps to section |
| FWC section first | Matches physical album order |
