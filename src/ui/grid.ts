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
  circle.style.backgroundColor = color;
  circle.style.color = contrastColor(color);
}
