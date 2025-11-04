import React from 'react';
import type { FilterState } from './FilterBar';

interface FilterPresetsProps {
  namespace: string; // e.g., 'catalogue' or 'workforce'
  value: FilterState;
  onChange: (next: FilterState) => void;
}

type Preset = { id: string; name: string; v: number; state: FilterState };
const STORAGE_KEY = (ns: string) => `fa-presets:${ns}`;

function loadPresets(ns: string): Preset[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY(ns));
    if (!raw) return [];
    const arr = JSON.parse(raw) as Preset[];
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function savePresets(ns: string, presets: Preset[]) {
  localStorage.setItem(STORAGE_KEY(ns), JSON.stringify(presets));
}

function encodePreset(p: FilterState): string {
  return btoa(unescape(encodeURIComponent(JSON.stringify({ v: 1, state: p }))));
}

function decodePreset(code: string): FilterState | null {
  try {
    const obj = JSON.parse(decodeURIComponent(escape(atob(code))));
    if (obj && obj.state) return obj.state as FilterState;
  } catch {}
  return null;
}

export const FilterPresets: React.FC<FilterPresetsProps> = ({ namespace, value, onChange }) => {
  const [presets, setPresets] = React.useState<Preset[]>(() => loadPresets(namespace));
  const [name, setName] = React.useState('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('preset');
    if (code) {
      const st = decodePreset(code);
      if (st) onChange(st);
    }
  }, [onChange]);

  const add = () => {
    const id = `${Date.now()}`;
    const next = [...presets, { id, name: name || `Preset ${presets.length + 1}`, v: 1, state: value }];
    setPresets(next); savePresets(namespace, next); setName('');
  };
  const load = (id: string) => {
    const p = presets.find(x => x.id === id); if (p) onChange(p.state);
  };
  const del = (id: string) => { const next = presets.filter(x => x.id !== id); setPresets(next); savePresets(namespace, next); };
  const share = () => {
    const code = encodePreset(value);
    const url = new URL(window.location.href);
    url.searchParams.set('preset', code);
    navigator.clipboard.writeText(url.toString());
    alert('Preset link copied to clipboard');
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-2">
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Preset name" className="border border-slate-300 rounded px-2 py-1 text-sm" />
      <button onClick={add} className="text-sm bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-100">Save Preset</button>
      <button onClick={share} className="text-sm bg-white border border-slate-300 rounded px-2 py-1 hover:bg-slate-100">Share Link</button>
      <div className="relative">
        <select aria-label="Load preset" onChange={(e) => e.target.value && load(e.target.value)} className="text-sm border border-slate-300 rounded px-2 py-1 bg-white">
          <option value="">Load preset…</option>
          {presets.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
        </select>
      </div>
      {presets.length > 0 && (
        <button onClick={() => { if (presets.length) del(presets[presets.length-1].id); }} className="text-sm text-red-700 bg-white border border-slate-300 rounded px-2 py-1 hover:bg-red-50">Delete Last</button>
      )}
    </div>
  );
};
