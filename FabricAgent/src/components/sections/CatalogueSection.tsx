
import React from 'react';
import { Prompt } from '../../types';
import { SectionCard } from '../ui/SectionCard';
import { PromptTable } from '../tables/PromptTable';
import { Hero } from '../ui/Hero';
import { Typography } from '../ui/Typography';
import { FilterBar, FilterState } from '../filters/FilterBar';
import { FilterPresets } from '../filters/FilterPresets';
import { useMemo, useRef } from 'react';
import { useQueryState } from '../../hooks/useQueryState';
import { parseQuery, matchPrompt, extractHighlightTokens, scorePrompt } from '../../utils/search';
import { getViewCount, getFavorites } from '../../utils/storage';
import { buildSuggestionIndex, getSuggestions, Suggestion } from '../../utils/suggest';
import { Onboarding } from '../ui/Onboarding';
import { useDebounce } from '../../hooks/useDebounce';
import { emitTelemetryEvent } from '../../services/rtiService';
import DataAgentChat from '../chat/DataAgentChat';
import RTIDashboard from './RTIDashboard';

interface CatalogueSectionProps {
    prompts: Prompt[];
    downloadUrl: string;
    selectedPrompts: Set<string>;
    setSelectedPrompts: React.Dispatch<React.SetStateAction<Set<string>>>;
    onShowDetails: (prompt: Prompt) => void;
    globalPromptMap: Map<string, Prompt>;
    catalogueCount: number;
    workforceCount: number;
    dagNodeCount: number;
}

export const CatalogueSection: React.FC<CatalogueSectionProps> = ({
    prompts,
    downloadUrl,
    selectedPrompts,
    setSelectedPrompts,
    onShowDetails,
    globalPromptMap,
    catalogueCount,
    workforceCount,
    dagNodeCount,
}) => {
    const giacCount = prompts.filter(p => p.provenance === 'giac').length;
    const customCount = prompts.filter(p => p.provenance !== 'giac').length;

    const [filters, setFilters] = useQueryState<FilterState>('catalogueFilters', { q: '', source: 'all', pillars: [], tags: [], sort: 'relevance', favorites: false });
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

    // react to favorites changes when favorites filter is active
    const [favTick, setFavTick] = React.useState(0);
    React.useEffect(() => {
      const handler = () => setFavTick(t => t + 1);
      window.addEventListener('fa:favorites-changed', handler as any);
      return () => window.removeEventListener('fa:favorites-changed', handler as any);
    }, []);

    const filtered = useMemo(() => {
        const parsed = parseQuery(filters.q || '');
        const base = prompts.filter(p => {
            const matchSearch = filters.q.length === 0 || matchPrompt(p, parsed);
            const matchSrc = filters.source === 'all' || (filters.source === 'giac' ? p.provenance === 'giac' : p.provenance !== 'giac');
            const pp = p.pillars || [];
            const mode = filters.pillarsMode || 'any';
            const matchPillars = filters.pillars.length === 0 || (mode === 'any' ? pp.some(x => filters.pillars.includes(x)) : filters.pillars.every(x => pp.includes(x)));
            // tags OR logic
            const tsel = filters.tags || [];
            const ptags = p.tags || [];
            const matchTags = tsel.length === 0 || ptags.some(x => tsel.includes(x));
            // favorites filter
            const matchFav = !filters.favorites || (() => {
              try {
                const favRaw = localStorage.getItem('fa:favorites');
                if (!favRaw) return false;
                const set = new Set<string>(JSON.parse(favRaw));
                return set.has(p.id);
              } catch { return false; }
            })();
            return matchSearch && matchSrc && matchPillars && matchTags && matchFav;
        });
        const mode = filters.sort || 'relevance';
        const sorted = [...base];
        if (mode === 'relevance') {
            sorted.sort((a, b) => scorePrompt(b, parsed) - scorePrompt(a, parsed));
        } else if (mode === 'newest') {
            const ts = (x: any) => (x.updated_at || x.created_at) ? Date.parse(x.updated_at || x.created_at) : 0;
            sorted.sort((a, b) => ts(b) - ts(a));
        } else if (mode === 'name') {
            sorted.sort((a, b) => String(a.name || a.id).localeCompare(String(b.name || b.id)));
        } else if (mode === 'mostViewed') {
            sorted.sort((a, b) => getViewCount(b.id) - getViewCount(a.id));
        }
        return sorted;
    }, [prompts, filters, favTick]);

    const highlightTokens = useMemo(() => extractHighlightTokens(filters.q || ''), [filters.q]);

    const suggestIndex = useMemo(() => buildSuggestionIndex(prompts), [prompts]);
    const didYouMean: Suggestion[] = useMemo(() => {
        try { return getSuggestions(filters.q || '', suggestIndex, 6); } catch { return []; }
    }, [filters.q, suggestIndex]);

    // Emit telemetry for debounced search terms to drive RTI dashboards
    const debouncedSearch = useDebounce(filters.q, 600);
    const lastSearchRef = useRef<string>('');
    React.useEffect(() => {
      const term = (debouncedSearch || '').trim();
      if (!term || term === lastSearchRef.current) return;
      lastSearchRef.current = term;
      void emitTelemetryEvent({ event_type: 'search', search_query: term }).catch(() => {
        // Non-blocking telemetry; ignore failures for demo reliability.
      });
    }, [debouncedSearch]);

    // Listen for global preset patches (from the "It Depends" widget)
    React.useEffect(() => {
        const handler = (e: Event) => {
            const detail = (e as CustomEvent<any>).detail || {};
            setFilters(prev => ({ ...prev, ...detail }));
        };
        window.addEventListener('fa:apply-preset', handler as any);
        return () => window.removeEventListener('fa:apply-preset', handler as any);
    }, [setFilters]);

    // Grouped pillars as per spec
    const groupedPillars = useMemo(() => {
        const groups: Record<string, string[]> = {
            'Governance & Security': [],
            'Performance & Modeling': [],
            'Visualization & Docs': [],
            'Career & Soft‑Skills': [],
            'Other': [],
        };
        const map: Record<string, keyof typeof groups> = {
            governance: 'Governance & Security', security: 'Governance & Security', compliance: 'Governance & Security', 'ai-safety': 'Governance & Security', rls: 'Governance & Security',
            performance: 'Performance & Modeling', dax: 'Performance & Modeling', modeling: 'Performance & Modeling', 'semantic-model': 'Performance & Modeling', 'optimization': 'Performance & Modeling',
            visualization: 'Visualization & Docs', documentation: 'Visualization & Docs',
            'career-soft-skills': 'Career & Soft‑Skills',
        };
        for (const p of allPillars) {
            const key = (p || 'other').toLowerCase();
            const g = map[key] || 'Other';
            groups[g].push(p);
        }
        // prune empties
        return Object.fromEntries(Object.entries(groups).filter(([_, list]) => list.length > 0));
    }, [allPillars]);

    return (
        <>
            <Hero
                catalogueCount={catalogueCount}
                workforceCount={workforceCount}
                dagNodeCount={dagNodeCount}
                giacCount={giacCount}
                customCount={customCount}
                compact
            />
            <SectionCard>
             <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6">
                <div className="flex-grow">
                    <Typography as="h2" className="flex items-center gap-3">
                        <i className="fas fa-book text-indigo-500"></i>
                        Curated Prompt Catalogue
                    </Typography>
                    <Typography as="subtle" className="mt-2 max-w-2xl">
                        Browse general-purpose, curated Power BI and Fabric prompts. Search by keyword or filter by pillars. Click a prompt to view details.
                        <a href={downloadUrl} target="_blank" download rel="noopener noreferrer" className="text-indigo-600 hover:text-indigo-800 font-semibold ml-2">
                           Download JSON
                        </a>
                    </Typography>
                </div>
                      <div className="hidden md:flex items-center justify-center p-2">
                          <img src="/assets/illustrations/prompt-engineering-concept.svg" alt="Prompt validation process illustration" className="h-32 w-auto" />
                </div>
            </div>
            <Onboarding />
            <FilterBar
                allPillars={allPillars}
                value={filters}
                onChange={setFilters}
                counts={{ total: prompts.length, giac: giacCount, custom: customCount }}
                groupedPillars={groupedPillars}
                downloadUrl={downloadUrl}
                suggestIndex={suggestIndex}
                allTags={allTags}
            />
            <FilterPresets namespace="catalogue" value={filters} onChange={setFilters} />
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
                topTags={computeTopTags(prompts)}
                suggestions={didYouMean}
            />
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">
              <DataAgentChat
                onSelectPrompt={onShowDetails}
                promptMap={globalPromptMap}
              />
              <RTIDashboard
                onSelectPrompt={onShowDetails}
                promptMap={globalPromptMap}
              />
            </div>
        </SectionCard>
        </>
    );
};

function computeTopTags(prompts: Prompt[]): string[] {
  const map = new Map<string, number>();
  for (const p of prompts) {
    (p.tags || []).forEach(t => { if (!t) return; map.set(t, (map.get(t) || 0) + 1); });
  }
  return Array.from(map.entries()).sort((a,b)=>b[1]-a[1]).map(([k])=>k).slice(0,50);
}
