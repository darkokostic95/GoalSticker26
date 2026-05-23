# GoalSticker26 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a single-page mobile-friendly TypeScript web app that tracks which Panini FIFA World Cup 2026 stickers you own, deployed automatically to GitHub Pages.

**Architecture:** Vite + vanilla TypeScript, no UI framework. All 49 sections (1 FWC + 48 teams) are hard-coded in `src/data/sections.ts`. Sticker ownership is stored as `Record<sectionCode, boolean[]>` in localStorage. The DOM is built once on load; toggling a sticker only updates one button's CSS class.

**Tech Stack:** TypeScript 5, Vite 5, Vitest 2 (jsdom), GitHub Actions, GitHub Pages.

---

## File Map

| File | Responsibility |
|------|---------------|
| `package.json` | Scripts and dev dependencies |
| `vite.config.ts` | Base path `/GoalSticker26/`, Vitest jsdom env |
| `tsconfig.json` | Strict TypeScript, bundler resolution |
| `index.html` | Shell HTML with `<div id="app">` |
| `.github/workflows/deploy.yml` | CI: build → upload → deploy to Pages |
| `src/data/sections.ts` | `Section` interface + all 49 sections array |
| `src/utils/color.ts` | `contrastColor(hex)` — white or black text on a color |
| `src/storage.ts` | `loadOwned()` / `saveOwned()` via localStorage |
| `src/state.ts` | `AppState`, `createState()`, `toggleSticker()`, `isOwned()` |
| `src/ui/grid.ts` | `createGrid()` — DOM grid of circle buttons; `updateCircle()` |
| `src/ui/sectionEl.ts` | `createSectionEl()` — section heading + grid + click wiring |
| `src/ui/header.ts` | `createHeader()` — sticky bar with dropdown |
| `src/main.ts` | Bootstrap: build DOM from state + sections |
| `src/style.css` | All styles: header, sections, grid, circles |
| `src/storage.test.ts` | Unit tests for storage |
| `src/state.test.ts` | Unit tests for state |

---

## Task 1: Scaffold project files

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `index.html`

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "goalsticker26",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "typescript": "^5.4.0",
    "vite": "^5.4.0",
    "vitest": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create `vite.config.ts`**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/GoalSticker26/',
  build: {
    outDir: 'dist',
  },
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "module": "ESNext",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 4: Create `index.html`**

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#1a1a2e" />
    <title>GoalSticker26</title>
  </head>
  <body>
    <div id="app"></div>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
```

- [ ] **Step 5: Install dependencies**

```bash
npm install
```

Expected: `node_modules/` created, no errors.

- [ ] **Step 6: Verify Vite starts**

```bash
npm run dev
```

Expected: server running at `http://localhost:5173/GoalSticker26/` (blank page is fine).

Stop the dev server (`Ctrl+C`).

- [ ] **Step 7: Commit**

```bash
git add package.json vite.config.ts tsconfig.json index.html package-lock.json
git commit -m "chore: scaffold Vite + TypeScript project"
```

---

## Task 2: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      - run: npm ci
      - run: npm run build
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: Commit and push to trigger first deploy**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: add GitHub Actions deploy workflow"
git push origin main
```

Expected: GitHub Actions starts a run. It will fail (no `src/` yet) — that's fine for now. Verify the workflow file is picked up at `https://github.com/darkokostic95/GoalSticker26/actions`.

---

## Task 3: Section data

**Files:**
- Create: `src/data/sections.ts`

- [ ] **Step 1: Create `src/data/sections.ts`**

```typescript
export interface Section {
  code: string;
  name: string;
  flag: string;
  color: string;
  stickers: string[];
}

function teamStickers(): string[] {
  return Array.from({ length: 20 }, (_, i) => String(i + 1));
}

export const SECTIONS: Section[] = [
  {
    code: 'FWC',
    name: 'FIFA World Cup',
    flag: '🏆',
    color: '#D4AF37',
    stickers: ['00','FWC1','FWC2','FWC3','FWC4','FWC5','FWC6','FWC7','FWC8',
               'FWC9','FWC10','FWC11','FWC12','FWC13','FWC14','FWC15','FWC16',
               'FWC17','FWC18','FWC19'],
  },
  { code: 'MEX', name: 'Mexico',              flag: '🇲🇽', color: '#006847', stickers: teamStickers() },
  { code: 'RSA', name: 'South Africa',        flag: '🇿🇦', color: '#007A4D', stickers: teamStickers() },
  { code: 'KOR', name: 'South Korea',         flag: '🇰🇷', color: '#CD2E3A', stickers: teamStickers() },
  { code: 'CZE', name: 'Czechia',             flag: '🇨🇿', color: '#D7141A', stickers: teamStickers() },
  { code: 'CAN', name: 'Canada',              flag: '🇨🇦', color: '#FF0000', stickers: teamStickers() },
  { code: 'BIH', name: 'Bosnia & Herzegovina',flag: '🇧🇦', color: '#002395', stickers: teamStickers() },
  { code: 'QAT', name: 'Qatar',               flag: '🇶🇦', color: '#8D1B3D', stickers: teamStickers() },
  { code: 'SUI', name: 'Switzerland',         flag: '🇨🇭', color: '#FF0000', stickers: teamStickers() },
  { code: 'BRA', name: 'Brazil',              flag: '🇧🇷', color: '#009C3B', stickers: teamStickers() },
  { code: 'MAR', name: 'Morocco',             flag: '🇲🇦', color: '#C1272D', stickers: teamStickers() },
  { code: 'HAI', name: 'Haiti',               flag: '🇭🇹', color: '#00209F', stickers: teamStickers() },
  { code: 'SCO', name: 'Scotland',            flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', color: '#005EB8', stickers: teamStickers() },
  { code: 'USA', name: 'USA',                 flag: '🇺🇸', color: '#002868', stickers: teamStickers() },
  { code: 'PAR', name: 'Paraguay',            flag: '🇵🇾', color: '#D52B1E', stickers: teamStickers() },
  { code: 'AUS', name: 'Australia',           flag: '🇦🇺', color: '#00843D', stickers: teamStickers() },
  { code: 'TUR', name: 'Türkiye',             flag: '🇹🇷', color: '#E30A17', stickers: teamStickers() },
  { code: 'GER', name: 'Germany',             flag: '🇩🇪', color: '#DD0000', stickers: teamStickers() },
  { code: 'CUW', name: 'Curaçao',             flag: '🇨🇼', color: '#003DA5', stickers: teamStickers() },
  { code: 'CIV', name: 'Ivory Coast',         flag: '🇨🇮', color: '#F77F00', stickers: teamStickers() },
  { code: 'ECU', name: 'Ecuador',             flag: '🇪🇨', color: '#FFD100', stickers: teamStickers() },
  { code: 'NED', name: 'Netherlands',         flag: '🇳🇱', color: '#FF4F00', stickers: teamStickers() },
  { code: 'JPN', name: 'Japan',               flag: '🇯🇵', color: '#BC002D', stickers: teamStickers() },
  { code: 'SWE', name: 'Sweden',              flag: '🇸🇪', color: '#006AA7', stickers: teamStickers() },
  { code: 'TUN', name: 'Tunisia',             flag: '🇹🇳', color: '#E70013', stickers: teamStickers() },
  { code: 'BEL', name: 'Belgium',             flag: '🇧🇪', color: '#EF3340', stickers: teamStickers() },
  { code: 'EGY', name: 'Egypt',               flag: '🇪🇬', color: '#C8102E', stickers: teamStickers() },
  { code: 'IRN', name: 'Iran',                flag: '🇮🇷', color: '#239F40', stickers: teamStickers() },
  { code: 'NZL', name: 'New Zealand',         flag: '🇳🇿', color: '#00247D', stickers: teamStickers() },
  { code: 'ESP', name: 'Spain',               flag: '🇪🇸', color: '#AA151B', stickers: teamStickers() },
  { code: 'CPV', name: 'Cape Verde',          flag: '🇨🇻', color: '#003893', stickers: teamStickers() },
  { code: 'KSA', name: 'Saudi Arabia',        flag: '🇸🇦', color: '#165D31', stickers: teamStickers() },
  { code: 'URU', name: 'Uruguay',             flag: '🇺🇾', color: '#5EB6E4', stickers: teamStickers() },
  { code: 'FRA', name: 'France',              flag: '🇫🇷', color: '#002395', stickers: teamStickers() },
  { code: 'SEN', name: 'Senegal',             flag: '🇸🇳', color: '#00853F', stickers: teamStickers() },
  { code: 'IRQ', name: 'Iraq',                flag: '🇮🇶', color: '#007A3D', stickers: teamStickers() },
  { code: 'NOR', name: 'Norway',              flag: '🇳🇴', color: '#EF2B2D', stickers: teamStickers() },
  { code: 'ARG', name: 'Argentina',           flag: '🇦🇷', color: '#74ACDF', stickers: teamStickers() },
  { code: 'ALG', name: 'Algeria',             flag: '🇩🇿', color: '#006233', stickers: teamStickers() },
  { code: 'AUT', name: 'Austria',             flag: '🇦🇹', color: '#ED2939', stickers: teamStickers() },
  { code: 'JOR', name: 'Jordan',              flag: '🇯🇴', color: '#007A3D', stickers: teamStickers() },
  { code: 'POR', name: 'Portugal',            flag: '🇵🇹', color: '#006600', stickers: teamStickers() },
  { code: 'COD', name: 'Congo DR',            flag: '🇨🇩', color: '#007FFF', stickers: teamStickers() },
  { code: 'UZB', name: 'Uzbekistan',          flag: '🇺🇿', color: '#1EB53A', stickers: teamStickers() },
  { code: 'COL', name: 'Colombia',            flag: '🇨🇴', color: '#FCD116', stickers: teamStickers() },
  { code: 'ENG', name: 'England',             flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: '#CF081F', stickers: teamStickers() },
  { code: 'CRO', name: 'Croatia',             flag: '🇭🇷', color: '#FF0000', stickers: teamStickers() },
  { code: 'GHA', name: 'Ghana',               flag: '🇬🇭', color: '#006B3F', stickers: teamStickers() },
  { code: 'PAN', name: 'Panama',              flag: '🇵🇦', color: '#DA121A', stickers: teamStickers() },
];
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/data/sections.ts
git commit -m "feat: add all 49 album sections (FWC + 48 teams)"
```

---

## Task 4: Storage module + tests

**Files:**
- Create: `src/storage.ts`
- Create: `src/storage.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/storage.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import { loadOwned, saveOwned } from './storage';

describe('loadOwned', () => {
  beforeEach(() => localStorage.clear());

  it('returns empty object when nothing stored', () => {
    expect(loadOwned()).toEqual({});
  });

  it('returns parsed data from localStorage', () => {
    localStorage.setItem('goalsticker26', JSON.stringify({ ARG: [true, false] }));
    expect(loadOwned()).toEqual({ ARG: [true, false] });
  });

  it('returns empty object when stored value is invalid JSON', () => {
    localStorage.setItem('goalsticker26', 'not-json');
    expect(loadOwned()).toEqual({});
  });
});

describe('saveOwned', () => {
  beforeEach(() => localStorage.clear());

  it('persists the owned map to localStorage', () => {
    const owned = { ARG: [true, false, true] };
    saveOwned(owned);
    expect(JSON.parse(localStorage.getItem('goalsticker26')!)).toEqual(owned);
  });

  it('overwrites previously saved data', () => {
    saveOwned({ ARG: [true] });
    saveOwned({ ARG: [false] });
    expect(JSON.parse(localStorage.getItem('goalsticker26')!)).toEqual({ ARG: [false] });
  });
});
```

- [ ] **Step 2: Run to confirm they fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module './storage'`.

- [ ] **Step 3: Implement `src/storage.ts`**

```typescript
const KEY = 'goalsticker26';

export function loadOwned(): Record<string, boolean[]> {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Record<string, boolean[]>) : {};
  } catch {
    return {};
  }
}

export function saveOwned(owned: Record<string, boolean[]>): void {
  localStorage.setItem(KEY, JSON.stringify(owned));
}
```

- [ ] **Step 4: Run tests — expect pass**

```bash
npm test
```

Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/storage.ts src/storage.test.ts
git commit -m "feat: add storage module with localStorage persistence"
```

---

## Task 5: State module + tests

**Files:**
- Create: `src/state.ts`
- Create: `src/state.test.ts`

- [ ] **Step 1: Write the failing tests**

Create `src/state.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createState, toggleSticker, isOwned } from './state';

vi.mock('./storage', () => ({
  loadOwned: () => ({}),
  saveOwned: vi.fn(),
}));

describe('createState', () => {
  it('initialises FWC section with 20 false entries', () => {
    const state = createState();
    expect(state.owned['FWC']).toHaveLength(20);
    expect(state.owned['FWC'].every((v) => v === false)).toBe(true);
  });

  it('initialises all 49 sections', () => {
    const state = createState();
    expect(Object.keys(state.owned)).toHaveLength(49);
  });

  it('sets activeSection to FWC', () => {
    const state = createState();
    expect(state.activeSection).toBe('FWC');
  });
});

describe('toggleSticker', () => {
  beforeEach(() => localStorage.clear());

  it('flips false to true', () => {
    const state = createState();
    toggleSticker(state, 'ARG', 0);
    expect(state.owned['ARG'][0]).toBe(true);
  });

  it('flips true back to false', () => {
    const state = createState();
    toggleSticker(state, 'ARG', 0);
    toggleSticker(state, 'ARG', 0);
    expect(state.owned['ARG'][0]).toBe(false);
  });

  it('does not affect other stickers in the same section', () => {
    const state = createState();
    toggleSticker(state, 'ARG', 3);
    expect(state.owned['ARG'][0]).toBe(false);
    expect(state.owned['ARG'][3]).toBe(true);
  });
});

describe('isOwned', () => {
  it('returns false for an untouched sticker', () => {
    const state = createState();
    expect(isOwned(state, 'ARG', 5)).toBe(false);
  });

  it('returns true after toggling once', () => {
    const state = createState();
    toggleSticker(state, 'ARG', 5);
    expect(isOwned(state, 'ARG', 5)).toBe(true);
  });

  it('returns false after toggling twice', () => {
    const state = createState();
    toggleSticker(state, 'ARG', 5);
    toggleSticker(state, 'ARG', 5);
    expect(isOwned(state, 'ARG', 5)).toBe(false);
  });
});
```

- [ ] **Step 2: Run to confirm they fail**

```bash
npm test
```

Expected: FAIL — `Cannot find module './state'`.

- [ ] **Step 3: Implement `src/state.ts`**

```typescript
import { SECTIONS } from './data/sections';
import { loadOwned, saveOwned } from './storage';

export interface AppState {
  owned: Record<string, boolean[]>;
  activeSection: string;
}

export function createState(): AppState {
  const stored = loadOwned();
  const owned: Record<string, boolean[]> = {};
  for (const section of SECTIONS) {
    owned[section.code] = stored[section.code] ?? new Array(section.stickers.length).fill(false);
  }
  return { owned, activeSection: SECTIONS[0].code };
}

export function toggleSticker(state: AppState, sectionCode: string, index: number): void {
  state.owned[sectionCode][index] = !state.owned[sectionCode][index];
  saveOwned(state.owned);
}

export function isOwned(state: AppState, sectionCode: string, index: number): boolean {
  return state.owned[sectionCode]?.[index] ?? false;
}
```

- [ ] **Step 4: Run all tests — expect pass**

```bash
npm test
```

Expected: all 13 tests pass.

- [ ] **Step 5: Commit**

```bash
git add src/state.ts src/state.test.ts
git commit -m "feat: add state module with toggle and ownership logic"
```

---

## Task 6: Color utility

**Files:**
- Create: `src/utils/color.ts`

- [ ] **Step 1: Create `src/utils/color.ts`**

```typescript
export function contrastColor(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/utils/color.ts
git commit -m "feat: add contrastColor utility for circle text legibility"
```

---

## Task 7: Grid UI component

**Files:**
- Create: `src/ui/grid.ts`

- [ ] **Step 1: Create `src/ui/grid.ts`**

```typescript
import type { Section } from '../data/sections';
import type { AppState } from '../state';
import { contrastColor } from '../utils/color';

export function createGrid(section: Section, state: AppState): HTMLElement {
  const grid = document.createElement('div');
  grid.className = 'sticker-grid';

  section.stickers.forEach((label, index) => {
    const circle = document.createElement('button');
    circle.type = 'button';
    circle.className = 'sticker-circle';
    circle.textContent = label;
    circle.dataset.index = String(index);
    circle.setAttribute('aria-label', `Sticker ${label}`);
    circle.setAttribute('aria-pressed', String(state.owned[section.code][index]));

    if (state.owned[section.code][index]) {
      applyOwned(circle, section.color);
    }

    grid.appendChild(circle);
  });

  return grid;
}

export function updateCircle(circle: HTMLButtonElement, owned: boolean, color: string): void {
  if (owned) {
    applyOwned(circle, color);
    circle.setAttribute('aria-pressed', 'true');
  } else {
    circle.classList.remove('owned');
    circle.style.backgroundColor = '';
    circle.style.color = '';
    circle.setAttribute('aria-pressed', 'false');
  }
}

function applyOwned(circle: HTMLElement, color: string): void {
  circle.classList.add('owned');
  (circle as HTMLElement).style.backgroundColor = color;
  (circle as HTMLElement).style.color = contrastColor(color);
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/ui/grid.ts
git commit -m "feat: add grid UI component with owned/unowned circle states"
```

---

## Task 8: Section element UI component

**Files:**
- Create: `src/ui/sectionEl.ts`

- [ ] **Step 1: Create `src/ui/sectionEl.ts`**

```typescript
import type { Section } from '../data/sections';
import type { AppState } from '../state';
import { toggleSticker } from '../state';
import { createGrid, updateCircle } from './grid';

export function createSectionEl(section: Section, state: AppState): HTMLElement {
  const el = document.createElement('section');
  el.className = 'team-section';
  el.id = `section-${section.code}`;

  const heading = document.createElement('h2');
  heading.className = 'section-heading';
  heading.textContent = `${section.flag} ${section.name}`;
  el.appendChild(heading);

  const grid = createGrid(section, state);

  grid.addEventListener('click', (e) => {
    const target = e.target as HTMLElement;
    const circle = target.closest<HTMLButtonElement>('.sticker-circle');
    if (!circle) return;
    const index = Number(circle.dataset.index);
    toggleSticker(state, section.code, index);
    updateCircle(circle, state.owned[section.code][index], section.color);
  });

  el.appendChild(grid);
  return el;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/ui/sectionEl.ts
git commit -m "feat: add section element UI with click-to-toggle wiring"
```

---

## Task 9: Header UI component

**Files:**
- Create: `src/ui/header.ts`

- [ ] **Step 1: Create `src/ui/header.ts`**

```typescript
import type { Section } from '../data/sections';

export function createHeader(
  sections: Section[],
  onSelect: (code: string) => void
): HTMLElement {
  const header = document.createElement('header');
  header.className = 'app-header';

  const title = document.createElement('span');
  title.className = 'app-title';
  title.textContent = 'GoalSticker26';
  header.appendChild(title);

  const select = document.createElement('select');
  select.className = 'team-select';
  select.setAttribute('aria-label', 'Jump to section');

  for (const section of sections) {
    const option = document.createElement('option');
    option.value = section.code;
    option.textContent = `${section.flag} ${section.name}`;
    select.appendChild(option);
  }

  select.addEventListener('change', () => onSelect(select.value));
  header.appendChild(select);

  return header;
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add src/ui/header.ts
git commit -m "feat: add sticky header with section jump dropdown"
```

---

## Task 10: Main entry point + CSS

**Files:**
- Create: `src/main.ts`
- Create: `src/style.css`

- [ ] **Step 1: Create `src/main.ts`**

```typescript
import { SECTIONS } from './data/sections';
import { createState } from './state';
import { createHeader } from './ui/header';
import { createSectionEl } from './ui/sectionEl';
import './style.css';

const state = createState();
const app = document.getElementById('app')!;

const header = createHeader(SECTIONS, (code) => {
  document.getElementById(`section-${code}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});
app.appendChild(header);

const main = document.createElement('main');
for (const section of SECTIONS) {
  main.appendChild(createSectionEl(section, state));
}
app.appendChild(main);
```

- [ ] **Step 2: Create `src/style.css`**

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background: #0a0a0a;
  color: #f0f0f0;
  overscroll-behavior-y: contain;
}

#app {
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
}

/* ── Header ── */
.app-header {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  height: 56px;
  background: #1a1a2e;
  border-bottom: 1px solid #2a2a4a;
  flex-shrink: 0;
}

.app-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #D4AF37;
  letter-spacing: 0.02em;
}

.team-select {
  font-size: 0.875rem;
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #444;
  background: #2a2a3e;
  color: #f0f0f0;
  max-width: 190px;
  cursor: pointer;
}

/* ── Sections ── */
main {
  flex: 1;
}

.team-section {
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid #1a1a1a;
}

.section-heading {
  font-size: 1.1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* ── Grid ── */
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: clamp(4px, 1.5vw, 8px);
}

/* ── Circle ── */
.sticker-circle {
  aspect-ratio: 1;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.35);
  background: transparent;
  color: rgba(255, 255, 255, 0.6);
  font-size: clamp(8px, 2.8vw, 13px);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  transition: transform 0.1s ease, border-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  line-height: 1;
}

.sticker-circle:active {
  transform: scale(0.88);
}

.sticker-circle.owned {
  border-color: transparent;
  /* background-color and color set inline by updateCircle() */
}
```

- [ ] **Step 3: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: no errors.

- [ ] **Step 4: Run the dev server and test in browser**

```bash
npm run dev
```

Open `http://localhost:5173/GoalSticker26/` on your phone or in browser DevTools mobile view (375×812).

Verify:
- Header is sticky with title and dropdown
- FWC section is first, shows 5×4 grid with labels `00`, `FWC1`–`FWC19`
- All 48 team sections follow, each with a 5×4 numbered grid
- Tapping a circle fills it with the team's color
- Tapping it again removes the fill
- Refreshing the page preserves toggled state (localStorage)
- Dropdown scrolls to the selected section

Stop the dev server.

- [ ] **Step 5: Run all tests**

```bash
npm test
```

Expected: all 13 tests pass.

- [ ] **Step 6: Build for production**

```bash
npm run build
```

Expected: `dist/` folder created with `index.html`, `assets/`, no errors.

- [ ] **Step 7: Commit and push**

```bash
git add src/main.ts src/style.css
git commit -m "feat: add main entry point, CSS, complete app"
git push origin main
```

Expected: GitHub Actions picks up the push and deploys to `https://darkokostic95.github.io/GoalSticker26/`.

- [ ] **Step 8: Verify live deployment**

Visit `https://darkokostic95.github.io/GoalSticker26/` once the Actions run completes (~1 min). Confirm the app loads and works identically to local.

- [ ] **Step 9: Update CLAUDE.md**

Replace the contents of `CLAUDE.md` with:

```markdown
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
```

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with commands and architecture"
git push origin main
```

---

## Self-Review

**Spec coverage check:**
- ✅ Vite + TypeScript → Tasks 1, 10
- ✅ GitHub Actions → GitHub Pages → Task 2, Step 7–8 of Task 10
- ✅ localStorage persistence → Task 4
- ✅ Binary have/don't have → Task 5 (`toggleSticker`)
- ✅ 48 teams + FWC section (980 stickers total) → Task 3
- ✅ `stickers: string[]` for mixed codes → Task 3 (`Section` interface)
- ✅ Sticky header with dropdown → Task 9
- ✅ 5×4 grid, colored circles, owned vs unowned → Tasks 7, 10
- ✅ Contrast color for text on circles → Task 6
- ✅ Mobile-first, tap interaction, `touch-action: manipulation` → Task 10
- ✅ FWC section first → Task 3 (first entry in SECTIONS)

**Type consistency check:**
- `Section.stickers: string[]` defined in Task 3, consumed in Tasks 7, 8
- `AppState.owned: Record<string, boolean[]>` defined in Task 5, consumed in Tasks 7, 8
- `toggleSticker(state, sectionCode, index)` defined in Task 5, called in Task 8
- `updateCircle(circle, owned, color)` defined in Task 7, called in Task 8
- `createGrid(section, state)` defined in Task 7, called in Task 8
- `createSectionEl(section, state)` defined in Task 8, called in Task 10
- `createHeader(sections, onSelect)` defined in Task 9, called in Task 10

All consistent. ✅
