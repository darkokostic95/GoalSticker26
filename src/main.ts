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
