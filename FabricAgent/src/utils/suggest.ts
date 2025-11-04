import type { Prompt } from '../types';

export type SuggestionType = 'name' | 'tag' | 'pillar' | 'recent' | 'id';
export interface Suggestion {
  value: string;
  type: SuggestionType;
  score: number;
}

export interface SuggestIndex {
  names: Map<string, number>; // value -> freq
  ids: Map<string, number>;
  tags: Map<string, number>;
  pillars: Map<string, number>;
}

function inc(map: Map<string, number>, key: string) {
  map.set(key, (map.get(key) || 0) + 1);
}

export function buildSuggestionIndex(prompts: Prompt[]): SuggestIndex {
  const idx: SuggestIndex = { names: new Map(), ids: new Map(), tags: new Map(), pillars: new Map() };
  for (const p of prompts) {
    if (p.name) inc(idx.names, p.name);
    if (p.id) inc(idx.ids, p.id);
    (p.tags || []).forEach(t => t && inc(idx.tags, t));
    (p.pillars || []).forEach(t => t && inc(idx.pillars, t));
  }
  return idx;
}

function recentQueries(): string[] {
  try {
    const raw = localStorage.getItem('fa:recent-queries');
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? (arr as string[]) : [];
  } catch {
    return [];
  }
}

export function recordRecentQuery(q: string) {
  try {
    const norm = (q || '').trim().toLowerCase();
    if (!norm) return;
    const prev = recentQueries().filter(x => x !== norm);
    const next = [norm, ...prev].slice(0, 15);
    localStorage.setItem('fa:recent-queries', JSON.stringify(next));
  } catch {}
}

function toSuggestions(map: Map<string, number>, type: SuggestionType, q: string): Suggestion[] {
  const t = (q || '').toLowerCase();
  const out: Suggestion[] = [];
  for (const [value, freq] of map.entries()) {
    const v = value.toLowerCase();
    const exact = v === t;
    const prefix = v.startsWith(t);
    const contains = !exact && !prefix && v.includes(t);
    if (!t || exact || prefix || contains) {
      const score = (exact ? 100 : prefix ? 70 : contains ? 40 : 10) + Math.min(30, freq);
      out.push({ value, type, score });
    }
  }
  return out;
}

export function getSuggestions(q: string, index: SuggestIndex, limit = 8): Suggestion[] {
  const base: Suggestion[] = [
    ...toSuggestions(index.names, 'name', q),
    ...toSuggestions(index.tags, 'tag', q),
    ...toSuggestions(index.pillars, 'pillar', q),
    ...toSuggestions(index.ids, 'id', q),
  ];

  // Recent queries are surfaced for empty q
  if (!q.trim()) {
    const rec = recentQueries().map<Suggestion>((v, i) => ({ value: v, type: 'recent', score: 50 - i }));
    base.push(...rec);
  }

  // Deduplicate by value/type
  const seen = new Set<string>();
  const unique = base
    .sort((a, b) => b.score - a.score)
    .filter(s => {
      const k = `${s.type}|${s.value.toLowerCase()}`;
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });

  return unique.slice(0, limit);
}

