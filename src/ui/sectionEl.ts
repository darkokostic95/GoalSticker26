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
