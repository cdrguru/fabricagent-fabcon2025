import React from 'react';

type Variant = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'subtle';

const classes: Record<Variant, string> = {
  h1: 'font-extrabold text-slate-900 text-4xl sm:text-5xl',
  h2: 'font-bold text-slate-800 text-2xl sm:text-3xl',
  h3: 'font-semibold text-slate-800 text-xl sm:text-2xl',
  h4: 'font-semibold text-slate-700 text-lg',
  h5: 'font-medium text-slate-700 text-base',
  h6: 'font-medium text-slate-600 text-sm uppercase tracking-wide',
  p: 'text-slate-700 text-base',
  subtle: 'text-slate-500 text-sm',
};

export const Typography: React.FC<React.PropsWithChildren<{ as?: Variant; className?: string }>> = ({ as = 'p', className = '', children }) => {
  const Tag = (as === 'p' || as === 'subtle') ? 'p' : (as as any);
  return <Tag className={`${classes[as]} ${className}`.trim()}>{children}</Tag>;
};

