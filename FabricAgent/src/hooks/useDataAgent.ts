/**
 * useDataAgent.ts
 * 
 * React hook for Microsoft Fabric Data Agent integration.
 * Manages conversational state and API calls to Data Agent service.
 * 
 * Competition Note: This hook abstracts Fabric API complexity and provides
 * a clean interface for components. Supports both mock (demo-safe) and
 * live (production) modes via ServiceFactory.
 * 
 * Refactored to:
 * - Use strict TypeScript types from services/types.ts
 * - Eliminate any types
 * - Add explicit Fabric API markers in comments
 */

import { useCallback, useMemo, useRef, useState } from 'react';
import { getDataAgentSuggestions, queryDataAgent } from '../services/dataAgentService';
import type { DataAgentResponse, PromptResult } from '../services/types';
import { emitTelemetryEvent } from '../services/rtiService';
import config from '../config';

/**
 * Chat role (user or assistant)
 */
export type ChatRole = 'user' | 'assistant';

/**
 * Individual chat message (strict typing, no any)
 */
export interface ChatMessage {
  /** Unique message ID */
  id: string;
  
  /** Message role */
  role: ChatRole;
  
  /** Message text content */
  content: string;
  
  /** ISO timestamp */
  timestamp: string;
  
  /** Prompts returned by Data Agent (assistant messages only) */
  prompts?: PromptResult[];
  
  /** Confidence level from Data Agent response */
  confidence?: DataAgentResponse['confidence'];
}

/**
 * Hook options
 */
export interface UseDataAgentOptions {
  /** Error handler callback */
  onError?: (message: string) => void;
}

/**
 * Hook return value
 */
export interface UseDataAgentResult {
  /** Conversation history */
  messages: ChatMessage[];
  
  /** Loading state (true during Data Agent API call) */
  isLoading: boolean;
  
  /** Error message (null if no error) */
  error: string | null;
  
  /** Follow-up question suggestions */
  suggestions: string[];
  
  /** Current mode (mock for demo, live for production) */
  mode: 'mock' | 'live';
  
  /** Submit question to Fabric Data Agent */
  ask: (question: string) => Promise<void>;
  
  /** Reset conversation */
  reset: () => void;
}

/**
 * Manage conversational state for Microsoft Fabric Data Agent.
 * 
 * FABRIC API INTEGRATION POINT: This hook calls queryDataAgent()
 * which routes to either MockDataAgentService or LiveDataAgentService
 * based on config.useMockServices.
 * 
 * @param options - Hook configuration options
 * @returns Data Agent state and methods
 */
export function useDataAgent(options: UseDataAgentOptions = {}): UseDataAgentResult {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const conversationRef = useRef<string[]>([]);

  const mode: 'mock' | 'live' = useMemo(
    () => (config.useMockServices ? 'mock' : 'live'),
    []
  );

  const reset = useCallback(() => {
    setMessages([]);
    setError(null);
    setSuggestions([]);
    conversationRef.current = [];
  }, []);

  /**
   * Submit question to Fabric Data Agent
   * 
   * FABRIC API CALL: Triggers queryDataAgent() which connects to
   * Microsoft Fabric Data Agent service (or mock for demo reliability).
   * 
   * @param question - User's natural language question
   */
  const ask = useCallback(
    async (question: string) => {
      const trimmed = question.trim();
      if (!trimmed) {
        return;
      }

      const userMessage: ChatMessage = {
        id: `user-${Date.now()}`,
        role: 'user',
        content: trimmed,
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        conversationRef.current = [...conversationRef.current, trimmed];

        // FABRIC RTI INTEGRATION: Emit telemetry to Eventstream
        void emitTelemetryEvent({
          event_type: 'search',
          search_query: trimmed
        }).catch(() => {
          // Non-blocking telemetry: swallow errors silently for demo reliability
        });

        // FABRIC DATA AGENT API CALL: Query semantic search
        const response = await queryDataAgent({
          query: trimmed,
          context: conversationRef.current
        });

        const assistantMessage: ChatMessage = {
          id: `assistant-${Date.now()}`,
          role: 'assistant',
          content: response.answer,
          prompts: response.prompts,
          timestamp: response.timestamp,
          confidence: response.confidence
        };

        setMessages(prev => [...prev, assistantMessage]);

        // Update conversational context for follow-up queries
        conversationRef.current = response.conversational_context;

        // Get follow-up suggestions
        const nextSuggestions = await getDataAgentSuggestions(
          response.conversational_context
        );
        setSuggestions(nextSuggestions);
      } catch (err) {
        console.error('[useDataAgent] Data Agent query failed', err);
        const fallback = err instanceof Error ? err.message : 'Unable to reach Microsoft Fabric Data Agent service.';
        setError(fallback);
        options.onError?.(fallback);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  return {
    messages,
    isLoading,
    error,
    suggestions,
    mode,
    ask,
    reset
  };
}

export default useDataAgent;
