export type PromptRecord = {
  video_id: string;
  title?: string;
  prompt: string;
  status: string;
  created_at?: string;
  updated_at?: string;
  category?: string;
  tags?: string[];
  file_path?: string;
};

// Injectable fetcher for testing
let indexFetcher: () => Promise<string> = async () => {
  const response = await fetch('/prompts/library/index.jsonl');
  if (!response.ok) {
    throw new Error(`Failed to fetch index: ${response.status}`);
  }
  return response.text();
};

export function setIndexFetcher(fetcher: () => Promise<string>) {
  indexFetcher = fetcher;
}

export async function fetchIndex(): Promise<PromptRecord[]> {
  try {
    const text = await indexFetcher();
    const lines = text.split('\n').filter(line => line.trim());
    const records: PromptRecord[] = [];

    for (const line of lines) {
      try {
        const record = JSON.parse(line);
        if (record && typeof record === 'object') {
          records.push(record);
        }
      } catch (e) {
        console.warn('Failed to parse index line:', line, e);
      }
    }

    // Deduplicate by video_id, keeping latest (by created_at or file order)
    const deduped = new Map<string, PromptRecord>();
    for (const record of records) {
      if (record.video_id) {
        deduped.set(record.video_id, record);
      }
    }

    // Sort by created_at desc, fallback to reverse order
    return Array.from(deduped.values()).sort((a, b) => {
      const aTime = a.created_at ? new Date(a.created_at).getTime() : 0;
      const bTime = b.created_at ? new Date(b.created_at).getTime() : 0;
      return bTime - aTime;
    });
  } catch (error) {
    console.error('Error fetching prompt index:', error);
    throw error;
  }
}
