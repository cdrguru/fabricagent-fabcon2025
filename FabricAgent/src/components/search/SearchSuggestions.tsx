import React from 'react';
import type { Suggestion } from '../../utils/suggest';

export interface SearchSuggestionsProps {
  items: Suggestion[];
  activeIndex: number;
  onSelect: (s: Suggestion) => void;
  onHoverIndex?: (i: number) => void;
}

const typeLabel: Record<Suggestion['type'], string> = {
  name: 'Name',
  tag: 'Tag',
  pillar: 'Pillar',
  recent: 'Recent',
  id: 'ID',
};

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ items, activeIndex, onSelect, onHoverIndex }) => {
  return (
    <div className="absolute mt-1 w-full bg-white border border-slate-200 rounded-md shadow-lg z-20" role="listbox" aria-label="Search suggestions">
      <ul className="max-h-64 overflow-auto">
        {items.map((s, i) => (
          <li
            key={`${s.type}-${s.value}-${i}`}
            role="option"
            aria-selected={i === activeIndex}
            className={`px-3 py-2 cursor-pointer flex items-center justify-between ${i === activeIndex ? 'bg-indigo-50' : 'hover:bg-slate-50'}`}
            onMouseEnter={() => onHoverIndex?.(i)}
            onMouseDown={(e) => {
              // prevent input blur before click
              e.preventDefault();
            }}
            onClick={() => onSelect(s)}
          >
            <span className="truncate text-sm text-slate-800">{s.value}</span>
            <span className="ml-3 text-xs px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
              {typeLabel[s.type]}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

