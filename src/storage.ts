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
