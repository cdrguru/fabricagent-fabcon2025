
import React from 'react';
import { Prompt } from '../../types';
import { SectionCard } from '../ui/SectionCard';
import { PromptTable } from '../tables/PromptTable';
import { Typography } from '../ui/Typography';
import { FilterBar, FilterState } from '../filters/FilterBar';
import { FilterPresets } from '../filters/FilterPresets';
import { useMemo } from 'react';
import { useQueryState } from '../../hooks/useQueryState';
import { parseQuery, matchPrompt, extractHighlightTokens } from '../../utils/search';
import { buildSuggestionIndex, getSuggestions } from '../../utils/suggest';

interface WorkforceSectionProps {
    prompts: Prompt[];
    downloadUrl: string;
    selectedPrompts: Set<string>;
    setSelectedPrompts: React.Dispatch<React.SetStateAction<Set<string>>>;
    onShowDetails: (prompt: Prompt) => void;
    globalPromptMap: Map<string, Prompt>;
}

export const WorkforceSection: React.FC<WorkforceSectionProps> = ({
    prompts,
    downloadUrl,
    selectedPrompts,
    setSelectedPrompts,
    onShowDetails,
    globalPromptMap
}) => {
    const [filters, setFilters] = useQueryState<FilterState>('workforceFilters', { q: '', source: 'all', pillars: [], tags: [] });
    const allPillars = useMemo(() => {
        const s = new Set<string>();
        prompts.forEach(p => (p.pillars || []).forEach(x => s.add(x)));
        return Array.from(s).sort();
    }, [prompts]);
    const allTags = useMemo(() => {
        const s = new Set<string>();
        prompts.forEach(p => (p.tags || []).forEach(x => x && s.add(x)));
        return Array.from(s).sort();
    }, [prompts]);

    const giacCount = prompts.filter(p => p.provenance === 'giac').length;
    const customCount = prompts.filter(p => p.provenance !== 'giac').length;

    const filtered = useMemo(() => {
        const parsed = parseQuery(filters.q || '');
        return prompts.filter(p => {
            const matchSearch = (filters.q.length === 0) || matchPrompt(p, parsed);
            const matchSrc = filters.source === 'all' || (filters.source === 'giac' ? p.provenance === 'giac' : p.provenance !== 'giac');
            const pp = p.pillars || [];
            const mode = filters.pillarsMode || 'any';
            const matchPillars = filters.pillars.length === 0 || (mode === 'any' ? pp.some(x => filters.pillars.includes(x)) : filters.pillars.every(x => pp.includes(x)));
            const tsel = filters.tags || [];
            const ptags = p.tags || [];
            const matchTags = tsel.length === 0 || ptags.some(x => tsel.includes(x));
            return matchSearch && matchSrc && matchPillars && matchTags;
        });
    }, [prompts, filters]);

    const highlightTokens = useMemo(() => extractHighlightTokens(filters.q || ''), [filters.q]);
    const suggestIndex = React.useMemo(() => buildSuggestionIndex(prompts), [prompts]);
    const didYouMean = React.useMemo(() => {
        try { return getSuggestions(filters.q || '', suggestIndex, 6); } catch { return []; }
    }, [filters.q, suggestIndex]);

    React.useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent<any>).detail || {};
            setFilters(prev => ({ ...prev, ...detail }));
        };
        window.addEventListener('fa:apply-preset', handler as any);
        return () => window.removeEventListener('fa:apply-preset', handler as any);
    }, [setFilters]);

    // Grouped pillars matching spec
    const groupedPillars = useMemo(() => {
        const groups: Record<string, string[]> = {
            'Governance & Security': [],
            'Performance & Modeling': [],
            'Visualization & Docs': [],
            'Other': [],
        };
        const map: Record<string, keyof typeof groups> = {
            governance: 'Governance & Security', security: 'Governance & Security', compliance: 'Governance & Security', 'ai-safety': 'Governance & Security', rls: 'Governance & Security',
            performance: 'Performance & Modeling', dax: 'Performance & Modeling', modeling: 'Performance & Modeling', 'semantic-model': 'Performance & Modeling',
            visualization: 'Visualization & Docs', documentation: 'Visualization & Docs',
        };
        const s = new Set(allPillars);
        for (const p of s) {
            const key = (p || 'other').toLowerCase();
            const g = map[key] || 'Other';
            groups[g].push(p);
        }
        return Object.fromEntries(Object.entries(groups).filter(([_, list]) => list.length > 0));
    }, [prompts]);
    return (
        <SectionCard>
            <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-8">
                <div className="flex-grow">
                    <Typography as="h2" className="flex items-center gap-3">
                        <i className="fas fa-users-cog text-teal-500"></i>
                        Workforce Prompt Library
                    </Typography>
                    <Typography as="subtle" className="mt-2 max-w-2xl">
                        Explore specific, production-ready prompts used in the automated governance orchestration workflow.
                        <a href={downloadUrl} target="_blank" download rel="noopener noreferrer" className="text-teal-600 hover:text-teal-800 font-semibold ml-2">
                            Download JSON
                        </a>
                    </Typography>
                </div>
                      <div className="hidden md:flex items-center justify-center p-2">
                          <img src="/assets/diagrams/workflow-pipeline.svg" alt="Workflow pipeline diagram" className="h-32 w-auto" />
                </div>
            </div>
            <FilterBar
                allPillars={allPillars}
                value={filters}
                onChange={setFilters}
                counts={{ total: prompts.length, giac: giacCount, custom: customCount }}
                groupedPillars={groupedPillars}
                downloadUrl={downloadUrl}
                allTags={allTags}
            />
            <FilterPresets namespace="workforce" value={filters} onChange={setFilters} />
            <div className="mb-2 text-sm text-slate-600" aria-live="polite">
              Showing {filtered.length} of {prompts.length} prompts
            </div>
            <PromptTable
                prompts={filtered}
                onShowDetails={onShowDetails}
                selectedPrompts={selectedPrompts}
                setSelectedPrompts={setSelectedPrompts}
                globalPromptMap={globalPromptMap}
                highlightTokens={highlightTokens}
                filters={filters}
                onUpdateFilters={setFilters}
                suggestions={didYouMean}
            />
        </SectionCard>
    );
};
