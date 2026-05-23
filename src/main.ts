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

const select = header.querySelector<HTMLSelectElement>('.team-select')!;

const main = document.createElement('main');
for (const section of SECTIONS) {
  main.appendChild(createSectionEl(section, state));
}
app.appendChild(main);

// Sync dropdown to whichever section is at the top of the visible area
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        select.value = entry.target.id.replace('section-', '');
        break;
      }
    }
  },
  { rootMargin: '-56px 0px -70% 0px', threshold: 0 },
);
main.querySelectorAll<HTMLElement>('.team-section').forEach((el) => observer.observe(el));
