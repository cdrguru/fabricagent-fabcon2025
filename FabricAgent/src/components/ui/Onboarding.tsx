import React from 'react';
import { getFavorites } from '../../utils/storage';

interface OnboardingProps {
  onDismiss?: () => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onDismiss }) => {
  const [hidden, setHidden] = React.useState<boolean>(() => {
    try { return localStorage.getItem('fa:onboarding:hidden') === '1'; } catch { return false; }
  });

  if (hidden) return null;
  const favoritesCount = getFavorites().size;

  const dismiss = () => {
    try { localStorage.setItem('fa:onboarding:hidden', '1'); } catch {}
    setHidden(true);
    onDismiss?.();
  };

  return (
    <div className="mb-4 p-3 border border-indigo-200 bg-indigo-50 rounded-lg flex items-start gap-3">
      <div className="flex-1 text-sm text-indigo-900">
        <strong>Welcome!</strong> Get started by searching or filtering by pillars. Tip: star your favorite prompts to build a quick list{favoritesCount ? ` (${favoritesCount} saved)` : ''}.
      </div>
      <button onClick={dismiss} className="text-indigo-700 hover:text-indigo-900 text-sm font-medium">Dismiss</button>
    </div>
  );
};

