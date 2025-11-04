import { useState, useEffect, useMemo } from 'react';
import { Prompt, DagData } from '../types';
import { GROUP_COLORS, PILLAR_ALIASES } from '../constants';

interface AppData {
  catalogue: Prompt[];
  workforce: Prompt[];
  dag: DagData | null;
}

const getLocalConfig = (initialAlert: string | null = null) => ({
  mode: 'local',
  base: '',
  catalogue: 'prompt-catalog.json',
  workforce: 'workforce_prompts.json',
  dag: 'dag.json',
  label: 'Local files',
  initialAlert: initialAlert,
});

const getRemoteConfig = (owner: string, repo: string, ref: string) => {
    const base = `https://raw.githubusercontent.com/${owner}/${repo}/${ref}`;
    return {
      mode: 'remote',
      base,
      catalogue: `${base}/prompts/powerbi/prompt-catalog.json`,
      workforce: `${base}/prompts/workforce/workforce_prompts.json`,
      dag: `${base}/prompts/workforce/dag.json`,
      label: `${owner}/${repo}@${ref}`,
      initialAlert: null,
    };
};

const getConfig = () => {
    const params = new URLSearchParams(window.location.search);
    const source = params.get('source');
    const owner = params.get('owner');
    const repo = params.get('repo');
    const ref = params.get('ref') || 'main';

    if ((owner && repo) || source === 'remote') {
        if (!owner || !repo) {
            console.warn("Remote mode requires 'owner' and 'repo' parameters.");
            return getLocalConfig("Remote parameters missing, defaulting to local.");
        }
        return getRemoteConfig(owner, repo, ref);
    }
    return getLocalConfig();
};

const normalizeData = (data: any): Prompt[] => {
    if (Array.isArray(data)) return data;
    if (typeof data === 'object' && data !== null) {
        const flatData: Prompt[] = [];
        for (const category in data) {
            if (typeof data[category] === 'object' && data[category] !== null) {
                for (const promptId in data[category]) {
                    const prompt = data[category][promptId];
                    if (typeof prompt === 'object' && prompt !== null) {
                        if (!prompt.category) prompt.category = category;
                        if (!prompt.id) prompt.id = promptId;
                        flatData.push(prompt);
                    }
                }
            }
        }
        return flatData;
    }
    return [];
};

const deriveFields = (prompt: Prompt): Prompt => {
  const derived = { ...prompt };

  // 1. Derive/normalize pillars from tags and aliases
  const aliasCandidates = new Set<string>();
  (derived.tags || []).forEach(t => {
    const key = String(t || '').toLowerCase();
    const mapped = PILLAR_ALIASES[key];
    if (mapped) aliasCandidates.add(mapped);
    if (GROUP_COLORS[key]) aliasCandidates.add(key);
  });
  // If pillars absent or only 'other', prefer alias candidates
  const current = (derived.pillars || []).map(x => String(x || '').toLowerCase());
  const onlyOther = current.length === 0 || (current.length === 1 && current[0] === 'other');
  if (onlyOther && aliasCandidates.size > 0) {
    derived.pillars = Array.from(aliasCandidates).slice(0, 3);
  }
  // Still missing? apply lightweight heuristics
  if (!derived.pillars || derived.pillars.length === 0) {
    derived.pillars = (derived.tags || []).filter(t => GROUP_COLORS[t] || String(t).includes('powerquery') || String(t).includes('dax') || String(t).includes('governance'));
  }
  if (!derived.pillars || derived.pillars.length === 0) {
    derived.pillars = ['other'];
  }


  // 2. Derive Category if missing from pillars
  if (!derived.category) {
    derived.category = derived.pillars[0] || 'other';
  }

  // 3. Derive Actions if missing
  if (!derived.actions || derived.actions.length === 0) {
    const systemText = [derived.system, derived.description, derived.summary].join(' ').toLowerCase();
    const derivedActions: string[] = [];
    const actionPatterns: [string, string][] = [
      ['analyze', 'Analyze requirements'],
      ['audit', 'Audit for compliance'],
      ['review', 'Review and validate'],
      ['optimize', 'Optimize performance'],
      ['diagnose', 'Diagnose issues'],
      ['generate', 'Generate artifacts'],
      ['design', 'Design solution'],
      ['validate', 'Validate outputs'],
      ['implement', 'Implement changes'],
      ['assess', 'Assess state'],
      ['document', 'Document findings'],
      ['test', 'Test functionality'],
      ['monitor', 'Monitor metrics'],
      ['configure', 'Configure settings'],
      ['deploy', 'Deploy solution'],
    ];

    for (const [pattern, action] of actionPatterns) {
      if (systemText.includes(pattern)) {
        derivedActions.push(action);
      }
    }

    derived.actions = derivedActions.length > 0
      ? Array.from(new Set(derivedActions)).slice(0, 5)
      : ['Review requirements', 'Run safely', 'Document outcome'];
  }

  // 4. Derive Provenance
  // @ts-ignore
  derived.provenance = prompt.provenance || 'custom';

  return derived;
};


export const useData = () => {
  const [data, setData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [sourceLabel, setSourceLabel] = useState<string>('');
  const [downloadLinks, setDownloadLinks] = useState({catalogue: '#', workforce: '#', dag: '#'});

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const config = getConfig();
        setSourceLabel(config.label);
        setDownloadLinks({
            catalogue: config.catalogue,
            workforce: config.workforce,
            dag: config.dag
        });

        const fetchJson = async (url: string): Promise<any | null> => {
          try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (!res.ok) return null;
            const ct = res.headers.get('content-type') || '';
            if (!ct.includes('application/json')) {
              console.warn(`Unexpected content-type for ${url}: ${ct}`);
              return null;
            }
            return await res.json();
          } catch (e) {
            console.warn(`Error fetching ${url}:`, (e as Error).message);
            return null;
          }
        };

        // Try configured endpoints first, then fallback to public runtime copies
        const [catalogueDataRaw, workforceDataRaw] = await Promise.all([
          fetchJson(config.catalogue).then(d => d ?? fetchJson('/prompt-catalog.json')),
          fetchJson(config.workforce).then(d => d ?? fetchJson('/workforce_prompts.json')),
        ]);

        if (!catalogueDataRaw) console.warn(`Catalogue not available from ${config.catalogue} or local fallback.`);
        if (!workforceDataRaw) console.warn(`Workforce not available from ${config.workforce} or local fallback.`);

        const catalogueData = catalogueDataRaw ?? [];
        const workforceData = workforceDataRaw ?? [];

        const normalizedCatalogue = normalizeData(catalogueData).map(deriveFields);
        const normalizedWorkforce = normalizeData(workforceData).map(deriveFields);

        let dagData: DagData | null = null;
        let dagSourceSuffix = '';

        const loadDag = async (path: string) => {
          const data = await fetchJson(path);
          if (data && data.nodes && data.nodes.length > 0) return data;
          return null;
        };

        dagData = await loadDag(config.dag);
        if (!dagData) {
          console.info('Attempting public DAG fallback…');
          dagData = await loadDag('/dag.json');
          if (dagData) dagSourceSuffix = ' (DAG: public fallback)';
        }

        if (dagSourceSuffix) {
            setSourceLabel(prev => prev + dagSourceSuffix);
        }

        // Simple audit for 'other' pillars remaining
        try {
          const countOther = (list: any[]) => list.filter(p => (p.pillars || []).includes('other')).length;
          const cOther = countOther(normalizedCatalogue);
          const wOther = countOther(normalizedWorkforce);
          if (cOther || wOther) console.warn('[audit] prompts with pillar "other" — catalogue:', cOther, 'workforce:', wOther);
        } catch {}

        setData({ catalogue: normalizedCatalogue, workforce: normalizedWorkforce, dag: dagData });

      } catch (err) {
        setError((err as Error).message);
        console.error("Initialization error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const globalPromptMap = useMemo(() => {
    const map = new Map<string, Prompt>();
    if (data?.catalogue) {
      data.catalogue.forEach(p => p.id && map.set(p.id.toLowerCase(), p));
    }
    if (data?.workforce) {
      data.workforce.forEach(p => p.id && map.set(p.id.toLowerCase(), p));
    }
    return map;
  }, [data]);


  return { data, loading, error, sourceLabel, downloadLinks, globalPromptMap };
};
