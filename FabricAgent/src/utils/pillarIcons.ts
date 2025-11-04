export const PILLAR_ICON_MAP: Record<string, string> = {
  governance: 'fa-shield-check',
  security: 'fa-user-shield',
  quality: 'fa-check-circle',
  performance: 'fa-gauge-high',
  modeling: 'fa-cubes',
  visualization: 'fa-chart-bar',
  dax: 'fa-function',
  telemetry: 'fa-wave-square',
  documentation: 'fa-book',
  other: 'fa-tag',
};

export function pillarIcon(pillar?: string): string {
  if (!pillar) return 'fa-tag';
  const key = pillar.toLowerCase();
  return PILLAR_ICON_MAP[key] || 'fa-tag';
}

