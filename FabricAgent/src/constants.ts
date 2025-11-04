
export const GROUP_COLORS: { [key: string]: string } = {
  'power-query': '#ffd966',
  'modeling-tmdl': '#6fa8dc',
  'dax': '#93c47d',
  'performance-bpa': '#e06666',
  'deployment-governance': '#a64d79',
  'documentation': '#8e7cc3',
  'prompt-engineering': '#76a5af',
  'ai-safety': '#ff9900',
  // New pillar for non-technical, career-focused prompts
  'career-soft-skills': '#f39c12',
  // Extended pillars
  'fabric': '#5dade2',
  'architecture': '#45b39d',
  'lakehouse': '#85c1e9',
  'warehouse': '#5499c7',
  'semantic-model': '#bb8fce',
  'spark': '#f39c12',
  'rls': '#f1948a',
  'incremental-refresh': '#58d68d',
  'directquery': '#48c9b0',
  'direct-lake': '#76d7c4',
  'ci-cd': '#7fb3d5',
  'devops': '#73c6b6',
  'gitops': '#85c1e9',
  'monitoring': '#f5b041',
  'optimization': '#f0b27a',
  'compliance': '#d98880',
  'capacity': '#7dcea0',
  'other': '#aaaaaa'
};

// Help Center URL: env override -> Chatbase default -> bundled static page
export const HELP_URL =
  (import.meta.env.VITE_HELP_CENTER_URL as string | undefined) ||
  (import.meta.env.VITE_HELP_URL as string | undefined) ||
  'https://www.chatbase.co/mnxB5kB3I-JSpdYAEJB2W/help' ||
  '/help/index.html';

// Optional donation URL used by the "It Depends" easter egg
export const DONATION_URL =
  (import.meta.env.VITE_DONATION_URL as string | undefined) ||
  'https://www.directrelief.org/donate/';

// Map common aliases/synonyms to canonical pillar keys used above
export const PILLAR_ALIASES: Record<string, string> = {
  // Career & soft skills pillar
  'career': 'career-soft-skills',
  'soft-skills': 'career-soft-skills',
  'softskills': 'career-soft-skills',
  'resume': 'career-soft-skills',
  'cv': 'career-soft-skills',
  'cover-letter': 'career-soft-skills',
  'job-application': 'career-soft-skills',
  // Preferred canonical: documentation
  'docs': 'documentation',
  'user-guide': 'documentation',
  'user-guides': 'documentation',
  'dashboard': 'documentation',
  'report': 'documentation',
  'reporting': 'documentation',
  'visual': 'documentation',
  'summary': 'documentation',
  'support': 'documentation',
  'data-dictionary': 'documentation',
  'json-schema': 'documentation',
  'citations': 'documentation',
  'personas': 'documentation',
  'proposal': 'documentation',
  'vendor-neutral': 'documentation',
  'ui-analysis': 'documentation',
  'user-experience': 'documentation',
  'training': 'documentation',
  'troubleshooting': 'documentation',
  'feature-prioritization': 'documentation',
  'contact-center': 'documentation',

  // Governance
  'governance': 'deployment-governance',
  'ai-governance': 'ai-safety',
  'safety': 'ai-safety',
  'compliance': 'compliance',
  'csdr': 'compliance',

  // Performance
  'performance': 'performance-bpa',
  'bpa': 'performance-bpa',
  'optimization': 'optimization',
  'vertipaq': 'performance-bpa',

  // Modeling
  'tmdl': 'modeling-tmdl',
  'tabular': 'modeling-tmdl',
  'kpi': 'modeling-tmdl',
  'composite-model': 'modeling-tmdl',
  'dataset': 'modeling-tmdl',
  'import-mode': 'modeling-tmdl',
  'field-parameters': 'modeling-tmdl',
  'semantic-guide': 'semantic-model',

  // Power Query
  'm-language': 'power-query',
  'm-query': 'power-query',
  'query-folding': 'power-query',
  'parameterization': 'power-query',
  'dataflows': 'power-query',

  // Security
  'rls': 'rls',
  'ols': 'rls',

  // Connectivity
  'directquery': 'directquery',
  'direct-lake': 'direct-lake',
  'incremental-refresh': 'incremental-refresh',
  'refresh': 'incremental-refresh',

  // Dev lifecycle
  'ci': 'ci-cd',
  'cicd': 'ci-cd',
  'ci-cd': 'ci-cd',
  'devops': 'devops',
  'gitops': 'gitops',
  'testing': 'ci-cd',
  'user-testing': 'ci-cd',
  'validation': 'ci-cd',
  'pbip': 'ci-cd',

  // Architecture
  'architecture': 'architecture',
  'semantic-model': 'semantic-model',
  'lakehouse': 'lakehouse',
  'warehouse': 'warehouse',
  'fabric': 'fabric',
  'powerbi': 'fabric',
  'gateway': 'fabric',
  'data-factory': 'fabric',
  'integration': 'architecture',
  'modernization': 'architecture',

  // Capacity/Monitoring
  'capacity-planning': 'capacity',
  'utilization': 'capacity',
  'monitoring': 'monitoring',

  // DAX/Measures/Calc
  'measure': 'dax',
  'aggregation': 'dax',
  'calculation-groups': 'dax',
  'visualization': 'documentation',

  // AI & Prompting
  'ai': 'prompt-engineering',
  'azure-openai': 'prompt-engineering',
  'azureopenai': 'prompt-engineering',
  'engineering': 'prompt-engineering',
  'sequence': 'prompt-engineering',
  'agent-execution': 'prompt-engineering',
  'analysis': 'optimization',
  'automation': 'ci-cd',
  'export': 'documentation',
  'finops': 'capacity',
  'research': 'documentation',
  'deep-research': 'documentation',
  'workforce': 'documentation',
  'enhancement': 'optimization',
  'refactor': 'optimization',
  'refactoring': 'optimization'
};

// Synonym map for search expansion. All keys/values should be lowercase.
export const SEARCH_SYNONYMS: Record<string, string[]> = {
  // Career discovery
  'resume': ['cv', 'cover letter', 'portfolio', 'career', 'soft skills', 'documentation'],
  'cv': ['resume', 'cover letter', 'portfolio', 'career', 'soft skills', 'documentation'],
  'cover letter': ['resume', 'cv', 'portfolio', 'career', 'documentation'],
  'job application': ['resume', 'cv', 'cover letter', 'portfolio', 'career'],
  'interview': ['soft skills', 'portfolio', 'profile'],
  // General helpful expansions
  'governance': ['deployment', 'compliance'],
  'performance': ['optimization', 'vertipaq', 'speed'],
  'modeling': ['semantic model', 'tmdl'],
  'documentation': ['docs', 'guide', 'help'],
};

// Descriptions for pillar tooltips and accessible labels
export const PILLAR_DESCRIPTIONS: Record<string, string> = {
  'career-soft-skills': 'Career growth, resumes, interviews, and soft skills guidance.',
  'documentation': 'Writing, docs, and knowledge capture for teams.',
  'deployment-governance': 'Workspaces, environments, guardrails, and deployment practices.',
  'ai-safety': 'Responsible AI use, safety clauses, and governance.',
  'performance-bpa': 'Model and report tuning, performance checks, and BPA.',
  'modeling-tmdl': 'Semantic modeling, TMDL, and best practices.',
  'power-query': 'Power Query (M), connectors, and folding.',
  'dax': 'DAX measures, calculations, and patterns.',
  'semantic-model': 'Semantic layer design and metadata.',
  'fabric': 'Microsoft Fabric platform components and orchestration.',
  'architecture': 'Solution architecture and integration patterns.',
  'lakehouse': 'Lakehouse concepts and Delta/Parquet data.',
  'warehouse': 'Data warehouse patterns and SQL.',
  'spark': 'Spark notebooks and data engineering.',
  'rls': 'Row/column level security patterns and guidance.',
  'incremental-refresh': 'Refresh strategies and incremental processing.',
  'directquery': 'DirectQuery connectivity and optimization.',
  'direct-lake': 'Direct Lake connectivity and modeling.',
  'ci-cd': 'Pipelines, testing, validation, and automation.',
  'devops': 'DevOps processes and tooling.',
  'gitops': 'Source control and GitOps workflows.',
  'monitoring': 'Observability, metrics, and health checks.',
  'optimization': 'General optimization strategies and tuning.',
  'compliance': 'Regulatory requirements and compliance operations.',
  'capacity': 'Capacity planning, sizing, and utilization.',
  'other': 'Miscellaneous content not covered elsewhere.'
};
