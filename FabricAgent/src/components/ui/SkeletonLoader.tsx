import React from 'react';

type Variant = 'table-row' | 'card' | 'text' | 'graph';

export const SkeletonLoader: React.FC<{ variant?: Variant; lines?: number } & React.HTMLAttributes<HTMLDivElement>> = ({ variant = 'text', lines = 3, className = '', ...rest }) => {
  if (variant === 'table-row') {
    return (
      <tr className="animate-pulse">
        <td className="p-3" colSpan={4}>
          <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </td>
      </tr>
    );
  }
  if (variant === 'graph') {
    return <div className={`h-[50vh] bg-slate-200/60 rounded ${className}`} {...rest} />;
  }
  return (
    <div className={`animate-pulse space-y-2 ${className}`} {...rest}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="h-4 bg-slate-200 rounded"></div>
      ))}
    </div>
  );
};

