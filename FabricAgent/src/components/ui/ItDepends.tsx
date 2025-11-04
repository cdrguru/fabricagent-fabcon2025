import React from 'react';
import { DONATION_URL } from '../../constants';
import { rewriteText } from '../../services/rewriteService';

export const ItDepends: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [count, setCount] = React.useState<number>(() => {
    try { return parseInt(localStorage.getItem('fa:depends-count') || '0', 10) || 0; } catch { return 0; }
  });
  const [preset, setPreset] = React.useState<string>('newest');
  const [limitFav, setLimitFav] = React.useState<boolean>(false);
  const [rwOpen, setRwOpen] = React.useState<boolean>(false);
  const [rwInput, setRwInput] = React.useState<string>('');
  const [rwStyle, setRwStyle] = React.useState<string>('simplify');
  const [rwModel, setRwModel] = React.useState<string>((import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT as string) || 'gpt-5-mini');
  const [rwBusy, setRwBusy] = React.useState<boolean>(false);
  const [rwOut, setRwOut] = React.useState<string>('');
  const [rwErr, setRwErr] = React.useState<string>('');

  const increment = () => {
    const next = count + 1;
    setCount(next);
    try { localStorage.setItem('fa:depends-count', String(next)); } catch {}
  };

  const applyPreset = () => {
    const patch: any = {};
    if (preset === 'newest') patch.sort = 'newest';
    else if (preset === 'mostViewed') patch.sort = 'mostViewed';
    else if (preset === 'career') patch.pillars = ['career-soft-skills'];
    else if (preset === 'governance') patch.pillars = ['deployment-governance','ai-safety','compliance','rls'];
    else if (preset === 'performance') patch.pillars = ['performance-bpa','optimization','dax','semantic-model'];
    if (limitFav) patch.favorites = true;
    try {
      window.dispatchEvent(new CustomEvent('fa:apply-preset', { detail: patch }));
    } catch {}
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(o => !o); increment(); }}
        className="text-xs bg-white border border-slate-300 rounded-full px-2 py-1 hover:bg-slate-50 inline-flex items-center gap-1"
        title="Click for a smile 😊"
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <span>It depends</span>
        <span aria-hidden className="text-slate-400">🎲</span>
      </button>
      {open && (
        <div role="dialog" aria-label="It depends panel" className="absolute right-0 mt-2 w-80 bg-white border border-slate-200 rounded-lg shadow-lg p-3 z-40">
          <div className="text-sm text-slate-800 font-medium">It depends…</div>
          <div className="text-xs text-slate-600 mt-1">On your goals, your data, and the friends we made along the way.</div>
          <div className="mt-2 text-xs text-slate-500">Clicks so far: <span className="font-semibold text-slate-700">{count}</span></div>
          <div className="mt-3">
            <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Quick shuffle</div>
            <select
              value={preset}
              onChange={(e) => setPreset(e.target.value)}
              className="w-full border border-slate-300 rounded-md text-sm p-1 bg-white"
              aria-label="Choose preset"
            >
              <option value="newest">Newest first</option>
              <option value="mostViewed">Most viewed</option>
              <option value="career">Career & soft-skills</option>
              <option value="governance">Governance & safety</option>
              <option value="performance">Performance & modeling</option>
            </select>
            <label className="mt-2 inline-flex items-center gap-2 text-xs text-slate-700">
              <input type="checkbox" checked={limitFav} onChange={(e) => setLimitFav(e.target.checked)} />
              Only favorites
            </label>
          </div>
          <div className="mt-3">
            <button onClick={() => setRwOpen(o => !o)} className="text-xs underline text-indigo-700">AI rewrite (Azure OpenAI)</button>
            {rwOpen && (
              <div className="mt-2 border border-slate-200 rounded-md p-2">
                <textarea
                  placeholder="Paste text to rewrite"
                  value={rwInput}
                  onChange={(e) => setRwInput(e.target.value)}
                  className="w-full border border-slate-300 rounded p-2 text-sm"
                  rows={3}
                />
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <select value={rwStyle} onChange={e => setRwStyle(e.target.value)} className="text-xs border border-slate-300 rounded px-2 py-1 bg-white">
                    <option value="simplify">Simplify</option>
                    <option value="shorten">Shorten</option>
                    <option value="professional">Professional tone</option>
                    <option value="friendly">Friendly tone</option>
                  </select>
                  <select value={rwModel} onChange={e => setRwModel(e.target.value)} className="text-xs border border-slate-300 rounded px-2 py-1 bg-white">
                    <option value="gpt-5-mini">gpt-5-mini</option>
                    <option value="gpt-5">gpt-5</option>
                  </select>
                  <button
                    disabled={rwBusy || !rwInput.trim()}
                    onClick={async () => {
                      setRwBusy(true); setRwErr(''); setRwOut('');
                      try {
                        const instruction = rwStyle === 'shorten'
                          ? 'Rewrite with fewer words while preserving key meaning.'
                          : rwStyle === 'professional'
                          ? 'Rewrite with a concise, professional tone for executive stakeholders.'
                          : rwStyle === 'friendly'
                          ? 'Rewrite in a friendly, approachable tone.'
                          : 'Rewrite for clarity; remove fluff; preserve technical details.';
                        const out = await rewriteText({ text: rwInput, instruction, deployment: rwModel });
                        setRwOut(out || '');
                      } catch (e: any) {
                        setRwErr(e?.message || String(e));
                      } finally { setRwBusy(false); }
                    }}
                    className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 disabled:opacity-50"
                  >
                    {rwBusy ? 'Rewriting…' : 'Rewrite'}
                  </button>
                </div>
                {rwErr && <div className="mt-2 text-xs text-red-600">{rwErr}</div>}
                {rwOut && (
                  <div className="mt-2">
                    <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Output</div>
                    <div className="relative">
                      <pre className="text-sm whitespace-pre-wrap break-words border border-slate-200 rounded p-2 bg-slate-50">{rwOut}</pre>
                      <div className="mt-2 flex items-center gap-2">
                        <button onClick={() => { navigator.clipboard.writeText(rwOut); }} className="text-xs px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-100">Copy</button>
                        <button onClick={() => { try { window.dispatchEvent(new CustomEvent('fa:apply-preset', { detail: { q: rwOut } })); } catch {} }} className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100">Use as search</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <button onClick={applyPreset} className="text-xs px-2 py-1 rounded-md bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100">Apply</button>
            <a href={DONATION_URL} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 inline-flex items-center gap-1">
              <i className="fas fa-hand-holding-heart" aria-hidden="true"></i>
              Donate $1
            </a>
            <button onClick={() => setOpen(false)} className="text-xs px-2 py-1 rounded-md bg-white border border-slate-300 hover:bg-slate-100">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};
