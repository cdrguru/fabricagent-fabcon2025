import React from 'react';

interface ProcessingStatusProps {
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export const ProcessingStatus: React.FC<ProcessingStatusProps> = ({
  loading = false,
  error = null,
  onRetry
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8" data-testid="loading">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2 text-gray-600">Loading prompts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg" data-testid="error">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-red-800 font-medium">Failed to load prompts</h3>
            <p className="text-red-600 text-sm mt-1">{error}</p>
          </div>
          {onRetry && (
            <button
              onClick={onRetry}
              className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return null;
};
