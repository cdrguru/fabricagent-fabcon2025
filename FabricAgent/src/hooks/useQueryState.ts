import { useCallback, useEffect, useState } from 'react';

export function useQueryState<T>(key: string, initial: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    const params = new URLSearchParams(window.location.search);
    const raw = params.get(key);
    if (raw == null) return initial;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return (raw as unknown as T) ?? initial;
    }
  });

  const set = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const next = typeof value === 'function' ? (value as (p: T) => T)(prev) : value;
      const params = new URLSearchParams(window.location.search);
      const encoded = typeof next === 'string' ? next : JSON.stringify(next);
      params.set(key, encoded);
      const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
      window.history.replaceState({}, '', newUrl);
      return next;
    });
  }, [key]);

  useEffect(() => {
    // Sync when back/forward
    const onPop = () => {
      const params = new URLSearchParams(window.location.search);
      const raw = params.get(key);
      if (raw == null) return setState(initial);
      try { setState(JSON.parse(raw) as T); }
      catch { setState(raw as unknown as T); }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [initial, key]);

  return [state, set];
}

