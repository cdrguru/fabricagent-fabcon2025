// Namespaced localStorage helpers for favorites, view counts, and ratings

const NS = 'fa';
const key = (k: string) => `${NS}:${k}`;

function emit(type: string, detail?: any) {
  try {
    window.dispatchEvent(new CustomEvent(`fa:${type}`, { detail }));
  } catch {}
}

function getJSON<T>(k: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key(k));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function setJSON<T>(k: string, v: T) {
  try { localStorage.setItem(key(k), JSON.stringify(v)); } catch {}
}

// Favorites
export function getFavorites(): Set<string> {
  const arr = getJSON<string[]>('favorites', []);
  return new Set(arr);
}

export function isFavorite(id: string): boolean {
  return getFavorites().has(id);
}

export function toggleFavorite(id: string): boolean {
  const favs = getFavorites();
  if (favs.has(id)) favs.delete(id); else favs.add(id);
  setJSON('favorites', Array.from(favs));
  emit('favorites-changed', { id, value: favs.has(id) });
  return favs.has(id);
}

// View counts
export function incrementViewCount(id: string): number {
  const map = getJSON<Record<string, number>>('view-counts', {});
  map[id] = (map[id] || 0) + 1;
  setJSON('view-counts', map);
  emit('view-count-changed', { id, value: map[id] });
  return map[id];
}

export function getViewCount(id: string): number {
  const map = getJSON<Record<string, number>>('view-counts', {});
  return map[id] || 0;
}

// Ratings 1-5
export function setRating(id: string, rating: number) {
  const clamped = Math.max(1, Math.min(5, Math.round(rating)));
  const map = getJSON<Record<string, number>>('ratings', {});
  map[id] = clamped;
  setJSON('ratings', map);
  emit('rating-changed', { id, value: clamped });
}

export function getRating(id: string): number | undefined {
  const map = getJSON<Record<string, number>>('ratings', {});
  return map[id];
}

// Feedback comment per id
export function setComment(id: string, comment: string) {
  const map = getJSON<Record<string, string>>('comments', {});
  map[id] = comment;
  setJSON('comments', map);
  emit('comment-changed', { id });
}

export function getComment(id: string): string | undefined {
  const map = getJSON<Record<string, string>>('comments', {});
  return map[id];
}

export function clearAllStorage() {
  try {
    ['favorites', 'view-counts', 'ratings'].forEach(k => localStorage.removeItem(key(k)));
  } catch {}
}
