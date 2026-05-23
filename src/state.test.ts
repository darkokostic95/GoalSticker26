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
