import { SEARCH_SYNONYMS } from '../constants';

export type Field = 'name' | 'id' | 'summary' | 'description' | 'pillar';
export interface ParsedQuery {
  must: { field?: Field; value: string }[];
  should: { field?: Field; value: string }[];
  not: { field?: Field; value: string }[];
}

const fieldMap: Record<string, Field> = {
  name: 'name', id: 'id', summary: 'summary', description: 'description', pillar: 'pillar', pillars: 'pillar'
};

export function parseQuery(q: string): ParsedQuery {
  const tokens = q.match(/(?:\w+:)?\S+/g) || [];
  const pq: ParsedQuery = { must: [], should: [], not: [] };
  let mode: 'must' | 'should' = 'must';
  for (let raw of tokens) {
    const t = raw.trim();
    if (!t) continue;
    if (/^AND$/i.test(t)) { mode = 'must'; continue; }
    if (/^OR$/i.test(t)) { mode = 'should'; continue; }
    if (/^NOT$/i.test(t)) { mode = 'must'; continue; }
    let neg = false;
    if (t.startsWith('-')) { neg = true; raw = t.slice(1); }
    const [key, ...rest] = raw.split(':');
    let field: Field | undefined;
    let value: string;
    if (rest.length) { field = fieldMap[key.toLowerCase()]; value = rest.join(':'); }
    else { value = key; }
    const term = { field, value: value.toLowerCase() };
    if (neg) pq.not.push(term);
    else if (mode === 'must') pq.must.push(term);
    else pq.should.push(term);
  }
  return pq;
}

export function matchPrompt(p: any, parsed: ParsedQuery): boolean {
  const textFor = (f?: Field): string[] => {
    if (!f) return [p.name, p.id, p.summary, p.description].map(x => (x || '').toLowerCase());
    if (f === 'pillar') return (p.pillars || []).map((x: string) => (x || '').toLowerCase());
    return [String(p[f] || '').toLowerCase()];
  };
  const expand = (v: string): string[] => {
    const base = (v || '').toLowerCase();
    const syn = SEARCH_SYNONYMS[base] || [];
    return [base, ...syn.map(s => s.toLowerCase())];
  };
  const hasTerm = (term: { field?: Field; value: string }) => {
    const candidates = expand(term.value);
    const fields = textFor(term.field);
    return candidates.some(cv => fields.some(t => t.includes(cv)));
  };
  if (parsed.must.some(t => !hasTerm(t))) return false;
  if (parsed.not.some(t => hasTerm(t))) return false;
  if (parsed.should.length > 0 && !parsed.should.some(t => hasTerm(t))) return false;
  return true;
}

export function extractHighlightTokens(q: string): string[] {
  const base = (q.match(/\b(?!AND|OR|NOT\b)\w{2,}\b/gi) || []).map(t => t.toLowerCase());
  const expanded = new Set<string>();
  for (const tok of base) {
    expanded.add(tok);
    (SEARCH_SYNONYMS[tok] || []).forEach(s => expanded.add(s.toLowerCase()));
  }
  return Array.from(expanded);
}

export type SortMode = 'relevance' | 'newest' | 'name' | 'mostViewed';

export function scorePrompt(p: any, parsed: ParsedQuery): number {
  // field weights favor name/id over description
  const fieldWeight = (f?: Field) => {
    switch (f) {
      case 'name':
      case 'id':
        return 3;
      case 'summary':
      case 'description':
        return 2;
      case 'pillar':
        return 1.5;
      default:
        return 1;
    }
  };
  const textFor = (f?: Field): string[] => {
    if (!f) return [p.name, p.id, p.summary, p.description].map(x => (x || '').toLowerCase());
    if (f === 'pillar') return (p.pillars || []).map((x: string) => (x || '').toLowerCase());
    return [String(p[f] || '').toLowerCase()];
  };
  const termScore = (term: { field?: Field; value: string }) => {
    const fields = textFor(term.field);
    const candidates = [term.value.toLowerCase(), ...((SEARCH_SYNONYMS[term.value.toLowerCase()] || []).map(s => s.toLowerCase()))];
    let best = 0;
    for (const cv of candidates) {
      for (const t of fields) {
        if (!cv) continue;
        if (t === cv) best = Math.max(best, 5);
        else if (t.startsWith(cv)) best = Math.max(best, 3.5);
        else if (t.includes(cv)) best = Math.max(best, 1.5);
      }
    }
    return best * fieldWeight(term.field);
  };

  const mustScore = parsed.must.reduce((s, term) => s + termScore(term), 0);
  const shouldScore = parsed.should.reduce((s, term) => s + termScore(term), 0) * 0.6;
  const recency = (() => {
    const ts = (p.updated_at || p.created_at) ? Date.parse(p.updated_at || p.created_at) : 0;
    if (!ts) return 0;
    const days = (Date.now() - ts) / (1000 * 60 * 60 * 24);
    // light bonus for newer content (<= 180 days)
    return Math.max(0, 10 - Math.min(10, days / 18));
  })();
  return mustScore + shouldScore + recency;
}
