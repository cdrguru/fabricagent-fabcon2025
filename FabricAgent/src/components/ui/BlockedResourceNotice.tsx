import React from 'react';

export const BlockedResourceNotice: React.FC = () => {
  const [show, setShow] = React.useState(false);
  React.useEffect(() => {
    try {
      if (localStorage.getItem('fa:blocked-dismissed') === '1') return;
    } catch {}
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 2000);
    // Fetch a harmless 204 endpoint; many blockers interfere with gstatic or similar CDNs
    fetch('https://www.gstatic.com/generate_204', { mode: 'no-cors', signal: controller.signal })
      .then(() => {})
      .catch(() => setShow(true))
      .finally(() => clearTimeout(id));
    return () => clearTimeout(id);
  }, []);

  if (!show) return null;
  return (
    <div className="mx-auto max-w-7xl px-4">
      <div className="mt-3 mb-1 rounded-md border border-amber-200 bg-amber-50 text-amber-900 p-2 text-sm flex items-start justify-between">
        <div>
          Some third‑party content appears blocked by your browser or network. Core features continue to work.
        </div>
        <button
          onClick={() => { try { localStorage.setItem('fa:blocked-dismissed','1'); } catch {}; setShow(false); }}
          className="ml-3 px-2 py-1 rounded bg-white/60 hover:bg-white text-amber-900 border border-amber-300 text-xs"
        >Dismiss</button>
      </div>
    </div>
  );
};

