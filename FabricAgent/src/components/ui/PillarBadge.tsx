
import React from 'react';
import { GROUP_COLORS, PILLAR_ALIASES, PILLAR_DESCRIPTIONS } from '../../constants';

interface PillarBadgeProps {
  pillar: string;
}

const PILLAR_ICONS: { [key: string]: string } = {
  'dax': 'assets/icons/badge-dax.svg',
  'power-query': 'assets/icons/badge-power-query.svg',
  'deployment-governance': 'assets/icons/badge-deployment-governance.svg',
  'governance': 'assets/icons/badge-governance.svg',
  'ai-safety': 'assets/icons/badge-ai-safety.svg',
  'modeling-tmdl': 'assets/icons/badge-modeling-tmdl.svg',
  'performance-bpa': 'assets/icons/badge-performance.svg',
  'prompt-engineering': 'assets/icons/badge-prompt-engineering.svg',
  'documentation': 'assets/icons/badge-documentation.svg',
  'other': 'assets/icons/badge-other.svg',
  // Extended
  'fabric': 'assets/icons/badge-fabric.svg',
  'architecture': 'assets/icons/badge-architecture.svg',
  'lakehouse': 'assets/icons/badge-lakehouse.svg',
  'warehouse': 'assets/icons/badge-warehouse.svg',
  'semantic-model': 'assets/icons/badge-semantic-model.svg',
  'spark': 'assets/icons/badge-spark.svg',
  'rls': 'assets/icons/badge-rls.svg',
  'incremental-refresh': 'assets/icons/badge-incremental-refresh.svg',
  'directquery': 'assets/icons/badge-directquery.svg',
  'direct-lake': 'assets/icons/badge-direct-lake.svg',
  'ci-cd': 'assets/icons/badge-ci-cd.svg',
  'devops': 'assets/icons/badge-devops.svg',
  'gitops': 'assets/icons/badge-gitops.svg',
  'monitoring': 'assets/icons/badge-monitoring.svg',
  'optimization': 'assets/icons/badge-optimization.svg',
  'compliance': 'assets/icons/badge-compliance.svg',
  'capacity': 'assets/icons/badge-capacity.svg',
};

export const PillarBadge: React.FC<PillarBadgeProps> = ({ pillar }) => {
  const rawKey = pillar.toLowerCase();
  const key = PILLAR_ALIASES[rawKey] || rawKey;
  const color = GROUP_COLORS[key] || GROUP_COLORS['other'];
  const iconUrl = PILLAR_ICONS[key];
  const [iconLoaded, setIconLoaded] = React.useState(false);
  const [iconError, setIconError] = React.useState(false);

  const handleIconLoad = () => setIconLoaded(true);
  const handleIconError = () => setIconError(true);

  const title = PILLAR_DESCRIPTIONS[key] || `Pillar: ${pillar.replace(/-/g, ' ')}`;
  return (
    <span
      className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap capitalize border bg-white text-slate-700"
      style={{ borderColor: color }}
      aria-label={`Pillar: ${pillar}`}
      title={title}
    >
      {iconUrl && !iconError ? (
         <img
           src={iconUrl}
           alt=""
           className="h-4 w-4 mr-1.5"
           aria-hidden="true"
           onLoad={handleIconLoad}
           onError={handleIconError}
           style={{ display: iconLoaded ? 'block' : 'none' }}
         />
      ) : null}
      {(!iconUrl || iconError || !iconLoaded) && (
         <span className="h-2.5 w-2.5 rounded-full mr-1.5" style={{ backgroundColor: color }} aria-hidden="true"></span>
      )}
      {pillar.replace(/-/g, ' ')}
    </span>
  );
};
