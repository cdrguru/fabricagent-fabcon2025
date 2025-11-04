import React, { useState } from 'react';
import { PromptRecord } from '../services/promptService';

interface PromptCardProps {
  record: PromptRecord;
}

export const PromptCard: React.FC<PromptCardProps> = ({ record }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(record.prompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy prompt:', err);
    }
  };

  const snippet = record.prompt.length > 200
    ? record.prompt.substring(0, 200) + '...'
    : record.prompt;

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
      data-testid={`prompt-card-${record.video_id}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-medium text-gray-900 mb-1">
            {record.title || `Prompt ${record.video_id}`}
          </h3>
          <div className="flex items-center text-sm text-gray-500 space-x-2">
            <span>{record.category || 'Uncategorized'}</span>
            {record.created_at && (
              <>
                <span>•</span>
                <span>{new Date(record.created_at).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
          aria-label="Copy prompt to clipboard"
        >
          Copy
        </button>
      </div>

      <p className="text-gray-700 text-sm leading-relaxed mb-3">
        {snippet}
      </p>

      {record.tags && record.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {record.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
            >
              {tag}
            </span>
          ))}
          {record.tags.length > 3 && (
            <span className="text-xs text-gray-500">
              +{record.tags.length - 3} more
            </span>
          )}
        </div>
      )}

      {copied && (
        <div
          role="status"
          aria-live="polite"
          className="mt-2 text-green-600 text-sm"
          data-testid="copy-status"
        >
          Copied to clipboard!
        </div>
      )}
    </div>
  );
};
