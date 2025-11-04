import React from 'react';

export const FilterChip: React.FC<{ label: string; onRemove: () => void } & React.HTMLAttributes<HTMLSpanElement>> = ({ label, onRemove, className = '', ...rest }) => {
  return (
    <span {...rest} className={`inline-flex items-center gap-2 px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs border border-indigo-200 transition ${className}`}>
      <span>{label}</span>
      <button aria-label={`Remove ${label}`} onClick={onRemove} className="hover:text-indigo-900 focus:outline-none">
        ×
      </button>
    </span>
  );
};

