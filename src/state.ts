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
