/**
 * AppContext.tsx
 * 
 * Global application context to eliminate prop drilling.
 * Provides shared state for prompts, selections, and modal interactions.
 * 
 * Competition Note: This context makes Fabric integration points clearer
 * by centralizing state management and avoiding deep prop chains.
 */

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import type { Prompt } from '../types';

/**
 * Application state interface (strict TypeScript, no any)
 */
interface AppContextState {
  // Prompt data
  globalPromptMap: Map<string, Prompt>;
  
  // Selection state
  selectedPrompts: Set<string>;
  setSelectedPrompts: (prompts: Set<string>) => void;
  togglePromptSelection: (promptId: string) => void;
  clearSelection: () => void;
  
  // Modal state
  modalPrompt: Prompt | null;
  showPromptDetails: (prompt: Prompt) => void;
  closePromptDetails: () => void;
  
  // Metadata
  catalogueCount: number;
  workforceCount: number;
  dagNodeCount: number;
}

const AppContext = createContext<AppContextState | null>(null);

/**
 * Props for AppProvider (strict typing)
 */
interface AppProviderProps {
  children: React.ReactNode;
  globalPromptMap: Map<string, Prompt>;
  catalogueCount: number;
  workforceCount: number;
  dagNodeCount: number;
}

/**
 * Application Context Provider
 * 
 * Wraps the app to provide shared state without prop drilling.
 * All Fabric integration components access this context instead of
 * receiving deep prop chains.
 */
export const AppProvider: React.FC<AppProviderProps> = ({
  children,
  globalPromptMap,
  catalogueCount,
  workforceCount,
  dagNodeCount,
}) => {
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [modalPrompt, setModalPrompt] = useState<Prompt | null>(null);

  const togglePromptSelection = useCallback((promptId: string) => {
    setSelectedPrompts((prev) => {
      const next = new Set(prev);
      if (next.has(promptId)) {
        next.delete(promptId);
      } else {
        next.add(promptId);
      }
      return next;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedPrompts(new Set());
  }, []);

  const showPromptDetails = useCallback((prompt: Prompt) => {
    setModalPrompt(prompt);
  }, []);

  const closePromptDetails = useCallback(() => {
    setModalPrompt(null);
  }, []);

  const value = useMemo<AppContextState>(
    () => ({
      globalPromptMap,
      selectedPrompts,
      setSelectedPrompts,
      togglePromptSelection,
      clearSelection,
      modalPrompt,
      showPromptDetails,
      closePromptDetails,
      catalogueCount,
      workforceCount,
      dagNodeCount,
    }),
    [
      globalPromptMap,
      selectedPrompts,
      togglePromptSelection,
      clearSelection,
      showPromptDetails,
      closePromptDetails,
      catalogueCount,
      workforceCount,
      dagNodeCount,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

/**
 * Hook to access app context
 * 
 * Throws if used outside AppProvider to catch integration errors early.
 */
export const useAppContext = (): AppContextState => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};

export default AppContext;
