import { useState, useEffect, useCallback } from 'react';
import { fetchIndex, PromptRecord } from '../services/promptService';

interface UsePromptPollingOptions {
  intervalMs?: number;
}

interface UsePromptPollingResult {
  data: PromptRecord[] | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function usePromptPolling({
  intervalMs = 3000
}: UsePromptPollingOptions = {}): UsePromptPollingResult {
  const [data, setData] = useState<PromptRecord[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const records = await fetchIndex();
      setData(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch prompts');
      console.error('Prompt polling error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refresh = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling
    const interval = setInterval(fetchData, intervalMs);

    // Cleanup
    return () => clearInterval(interval);
  }, [fetchData, intervalMs]);

  return { data, loading, error, refresh };
}
