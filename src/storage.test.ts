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
