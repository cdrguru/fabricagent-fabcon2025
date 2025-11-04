import React from 'react';
import { usePromptPolling } from '../hooks/usePromptPolling';
import { PromptCard } from './PromptCard';
import { ProcessingStatus } from './ProcessingStatus';

export const PromptList: React.FC = () => {
  const { data, loading, error, refresh } = usePromptPolling();

  if (loading && !data) {
    return <ProcessingStatus loading={true} />;
  }

  if (error && !data) {
    return <ProcessingStatus error={error} onRetry={refresh} />;
  }

  return (
    <div className="space-y-4">
      {error && (
        <ProcessingStatus error={error} onRetry={refresh} />
      )}

      {data && data.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No prompts found. New prompts will appear here automatically.
        </div>
      )}

      {data && data.map((record) => (
        <PromptCard key={record.video_id} record={record} />
      ))}
    </div>
  );
};
