// Lightweight client to rewrite text via Azure OpenAI or a proxy API.

export interface RewriteOptions {
  text: string;
  instruction?: string; // e.g., "simplify", "shorten"
  deployment?: string;  // Azure deployment name
}

export async function rewriteText(opts: RewriteOptions): Promise<string> {
  const { text } = opts;
  const instruction = opts.instruction || 'Rewrite clearly while preserving technical accuracy.';

  const proxyUrl = (import.meta.env.VITE_REWRITE_API_URL as string | undefined) || (typeof window !== 'undefined' ? '/api/rewrite' : '');
  if (proxyUrl) {
    const res = await fetch(proxyUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, instruction, deployment: opts.deployment })
    });
    if (!res.ok) {
      let msg = `Rewrite API error: ${res.status}`;
      try { const j = await res.json(); if (j?.error) msg = `${msg} — ${j.error}`; if (j?.details) msg += ` (${String(j.details).slice(0,200)})`; } catch {}
      throw new Error(msg);
    }
    const data = await res.json().catch(() => ({} as any));
    return data.output || data.text || JSON.stringify(data);
  }

  // Direct Azure OpenAI (development only; avoid exposing keys in production)
  const endpoint = (import.meta.env.VITE_AZURE_OPENAI_ENDPOINT as string | undefined);
  const apiKey = (import.meta.env.VITE_AZURE_OPENAI_API_KEY as string | undefined);
  const apiVersion = (import.meta.env.VITE_AZURE_OPENAI_API_VERSION as string | undefined) || '2024-02-15-preview';
  const deployment = opts.deployment || (import.meta.env.VITE_AZURE_OPENAI_DEPLOYMENT as string | undefined) || 'gpt-5-mini';

  if (!endpoint || !apiKey) {
    throw new Error('Rewrite API not configured. Set VITE_REWRITE_API_URL or VITE_AZURE_OPENAI_ENDPOINT + VITE_AZURE_OPENAI_API_KEY.');
  }

  const url = `${endpoint.replace(/\/$/, '')}/openai/deployments/${deployment}/chat/completions?api-version=${encodeURIComponent(apiVersion)}`;
  const base = {
    messages: [
      { role: 'system', content: 'You are a helpful rewriting assistant. Improve clarity and tone while preserving meaning.' },
      { role: 'user', content: `Instruction: ${instruction}\n\nText to rewrite:\n${text}` }
    ],
    temperature: 1,
    n: 1
  } as any;

  async function call(p: any){
    return fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'api-key': apiKey }, body: JSON.stringify(p) });
  }

  let res = await call({ ...base, max_completion_tokens: 800 });
  if (!res.ok) {
    const t = await res.text().catch(()=> '');
    if (/max_completion_tokens/i.test(t) || /Unrecognized request argument/i.test(t)) {
      res = await call({ ...base, max_tokens: 800 });
    } else {
      throw new Error(`Azure OpenAI error: ${res.status} — ${t.slice(0,200)}`);
    }
  }
  const data = await res.json();
  const content = data?.choices?.[0]?.message?.content || '';
  return String(content || '').trim();
}
