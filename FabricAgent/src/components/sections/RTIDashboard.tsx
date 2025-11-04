import React, { useEffect, useMemo, useState } from 'react';
import { Activity, BarChart2, Clock, Flame } from 'lucide-react';
import { fetchRtiDashboardMetrics } from '../../services/rtiService';
import type { Prompt } from '../../types';
import type { RTIDashboardMetrics } from '../../services/MockRtiService';

interface RTIDashboardProps {
  onSelectPrompt?: (prompt: Prompt) => void;
  promptMap?: Map<string, Prompt>;
}

const REFRESH_INTERVAL_MS = 5000;

const formatTimestamp = (timestamp: string) => {
  try {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return timestamp;
  }
};

export const RTIDashboard: React.FC<RTIDashboardProps> = ({ onSelectPrompt, promptMap }) => {
  const [metrics, setMetrics] = useState<RTIDashboardMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let cancelled = false;

    const loadMetrics = async () => {
      try {
        const result = await fetchRtiDashboardMetrics();
        if (!cancelled) {
          setMetrics(result);
          setError(null);
          setLoading(false);
        }
      } catch (err) {
        console.error('[RTIDashboard] failed to fetch metrics', err);
        if (!cancelled) {
          setError('Unable to load RTI metrics.');
          setLoading(false);
        }
      }
    };

    loadMetrics();
    const interval = window.setInterval(loadMetrics, REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, []);

  const topSearches = useMemo(() => metrics?.topSearches.slice(0, 5) ?? [], [metrics]);
  const topPrompts = useMemo(() => metrics?.mostOpenedPrompts.slice(0, 5) ?? [], [metrics]);
  const trending = useMemo(() => metrics?.trendingPillars.slice(0, 3) ?? [], [metrics]);
  const recentActivity = useMemo(() => metrics?.recentActivity.slice(0, 5) ?? [], [metrics]);

  return (
    <section aria-label="Real-Time Intelligence dashboard" className="bg-white border border-slate-200 rounded-xl shadow-sm h-full flex flex-col">
      <header className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <BarChart2 className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            Real-Time Intelligence Pulse
          </p>
          <p className="text-xs text-slate-500">
            Eventstream → Eventhouse telemetry snapshot
          </p>
        </div>
        <div className="flex items-center gap-1 text-xs text-slate-500">
          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
          {metrics ? `Updated ${formatTimestamp(metrics.lastUpdated)}` : 'Updating…'}
        </div>
      </header>

      <div className="flex-1 px-4 py-4 space-y-4 overflow-y-auto">
        {loading ? (
          <div className="text-sm text-slate-500">Loading RTI metrics…</div>
        ) : null}

        {error ? (
          <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-2">
            {error}
          </div>
        ) : null}

        {metrics ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-lg border border-indigo-100 bg-indigo-50/70 p-3">
                <p className="text-xs uppercase font-semibold text-indigo-700 tracking-wide">
                  Top Searches (last 15 min)
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {topSearches.map(search => (
                    <li key={search.query} className="flex items-center justify-between gap-3">
                      <span className="truncate">{search.query}</span>
                      <span className="font-semibold text-indigo-600">{search.count}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg border border-emerald-100 bg-emerald-50/60 p-3">
                <p className="text-xs uppercase font-semibold text-emerald-700 tracking-wide">
                  Trending Pillars
                </p>
                <ul className="mt-2 space-y-2 text-sm text-slate-700">
                  {trending.map(item => (
                    <li key={item.pillar} className="flex items-center justify-between gap-3">
                      <span className="truncate">{item.pillar}</span>
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <Activity className="h-3.5 w-3.5" aria-hidden="true" />
                        {item.activity_count}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 p-3">
              <div className="flex items-center gap-2 text-xs uppercase font-semibold text-slate-600 tracking-wide">
                <Flame className="h-4 w-4 text-amber-500" aria-hidden="true" />
                Most Opened Prompts (24h)
              </div>
              <ul className="mt-2 space-y-2">
                {topPrompts.map(prompt => (
                  <li
                    key={prompt.id}
                    className="flex items-center justify-between gap-3 text-sm text-slate-700 bg-slate-50 rounded-md px-3 py-2 border border-slate-100"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{prompt.title}</p>
                      <p className="text-xs text-slate-500 truncate">{prompt.pillar}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-slate-500">{prompt.opens}</span>
                      {onSelectPrompt && promptMap ? (
                        <button
                          type="button"
                          className="text-xs text-indigo-600 hover:text-indigo-800 font-semibold focus:outline-none"
                          onClick={() => {
                            const id = prompt.id.toLowerCase();
                            let resolved = promptMap.get(id);
                            if (!resolved) {
                              const title = (prompt.title || '').toLowerCase();
                              for (const candidate of promptMap.values()) {
                                if (candidate.id && candidate.id.toLowerCase() === id) {
                                  resolved = candidate;
                                  break;
                                }
                                if (title && (candidate.name || '').toLowerCase() === title) {
                                  resolved = candidate;
                                  break;
                                }
                              }
                            }
                            if (resolved) {
                              onSelectPrompt(resolved);
                            }
                          }}
                        >
                          View
                        </button>
                      ) : null}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {recentActivity.length ? (
              <div className="rounded-lg border border-slate-200 p-3">
                <p className="text-xs uppercase font-semibold text-slate-600 tracking-wide mb-2">
                  Recent Activity
                </p>
                <ul className="space-y-2 text-xs text-slate-600">
                  {recentActivity.map(activity => (
                    <li key={activity.timestamp + activity.event_type} className="flex items-center justify-between gap-3">
                      <span className="capitalize">{activity.event_type.replace('_', ' ')}</span>
                      {activity.search_query ? (
                        <span className="truncate text-slate-500">{activity.search_query}</span>
                      ) : activity.prompt_title ? (
                        <span className="truncate text-slate-500">{activity.prompt_title}</span>
                      ) : null}
                      <span className="text-slate-400">{formatTimestamp(activity.timestamp)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </>
        ) : null}
      </div>
    </section>
  );
};

export default RTIDashboard;
