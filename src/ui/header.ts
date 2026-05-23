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
