/**
 * DataAgentChat.tsx
 * 
 * Conversational interface for Microsoft Fabric Data Agent integration.
 * Enables natural language queries against the prompt catalog.
 * 
 * Competition Note: This component showcases the "Best Use of AI Features"
 * category by demonstrating Fabric Data Agent API integration with clear
 * visual indicators of mock vs. live mode for demo recording reliability.
 * 
 * Refactored to:
 * - Eliminate prop drilling using AppContext
 * - Enforce strict TypeScript (no any)
 * - Add explicit Fabric API call markers for judges
 * - Support demo-safe mock mode
 */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Sparkles, RotateCcw, Send, Zap } from 'lucide-react';
import useDataAgent, { ChatMessage } from '../../hooks/useDataAgent';
import { useAppContext } from '../../contexts/AppContext';

/**
 * Mode descriptions for Fabric Data Agent integration
 * 
 * mock: Demo-safe mode with curated responses (reliable for video recording)
 * live: Production mode connected to Microsoft Fabric Data Agent API
 */
const modeCopy: Record<'mock' | 'live', { label: string; description: string }> = {
  mock: {
    label: '🎬 Demo Safe Mode',
    description: 'Using curated mock responses for recording reliability.'
  },
  live: {
    label: '⚡ Live Fabric Agent',
    description: 'Connected to Microsoft Fabric Data Agent API endpoint.'
  }
};

/**
 * Props are now minimal - context handles prompt map and selection
 */
interface DataAgentChatProps {
  /** Optional: override default container styles */
  className?: string;
}

const scrollToBottom = (container: HTMLDivElement | null) => {
  if (!container) return;
  container.scrollTop = container.scrollHeight;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

/**
 * DataAgentChat Component
 * 
 * Renders conversational UI for Fabric Data Agent integration.
 * Now uses AppContext to access globalPromptMap and showPromptDetails.
 */
export const DataAgentChat: React.FC<DataAgentChatProps> = ({ className }) => {
  // Access shared app state (eliminates prop drilling)
  const { globalPromptMap, showPromptDetails } = useAppContext();
  
  // Fabric Data Agent hook (manages API calls)
  const { messages, isLoading, error, suggestions, mode, ask, reset } = useDataAgent();
  
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollToBottom(scrollRef.current);
  }, [messages]);

  const badge = modeCopy[mode];

  /**
   * Render recommended prompts from Data Agent response
   * 
   * FABRIC API INTEGRATION POINT: These prompts come from Data Agent
   * semantic search against the prompt catalog.
   */
  const renderAssistantPrompts = (message: ChatMessage) => {
    if (!message.prompts?.length) {
      return null;
    }

    return (
      <div className="mt-3 space-y-3">
        <p className="text-xs uppercase font-semibold text-indigo-500 tracking-wide flex items-center gap-1">
          <Zap className="h-3 w-3" aria-hidden="true" />
          Fabric Data Agent Results
        </p>
        <div className="space-y-2">
          {message.prompts.map(prompt => {
            // Resolve prompt from Data Agent result to full Prompt object
            const id = prompt.id.toLowerCase();
            let resolved = globalPromptMap.get(id);
            
            // Fallback: try matching by title if ID doesn't match
            if (!resolved) {
              const targetTitle = (prompt.title || '').toLowerCase();
              for (const candidate of globalPromptMap.values()) {
                if (candidate.id && candidate.id.toLowerCase() === id) {
                  resolved = candidate;
                  break;
                }
                if (targetTitle && (candidate.name || '').toLowerCase() === targetTitle) {
                  resolved = candidate;
                  break;
                }
              }
            }
            
            return (
              <button
                key={prompt.id}
                type="button"
                onClick={() => {
                  if (resolved) {
                    // Use context method (no prop drilling)
                    showPromptDetails(resolved);
                  }
                }}
                disabled={!resolved}
                className="w-full text-left border border-indigo-100 hover:border-indigo-300 hover:bg-indigo-50 rounded-lg p-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex justify-between items-start gap-2">
                <span className="font-semibold text-slate-800">{prompt.title}</span>
                {typeof prompt.relevance_score === 'number' ? (
                  <span className="text-xs text-indigo-600 font-medium">
                    {(prompt.relevance_score * 100).toFixed(0)}% match
                  </span>
                ) : null}
              </div>
              <p className="mt-1 text-sm text-slate-600 line-clamp-2">{prompt.description}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="inline-flex items-center rounded-full bg-indigo-100 text-indigo-700 px-2 py-0.5">
                  {prompt.pillar}
                </span>
                {prompt.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="inline-flex items-center rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 capitalize">
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
                {prompt.source ? (
                  <span className="inline-flex items-center rounded-full bg-slate-200 text-slate-700 px-2 py-0.5">
                    {prompt.source}
                  </span>
                ) : null}
              </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /**
   * System message showing Fabric integration status
   * 
   * COMPETITION NOTE: This badge makes it clear to judges that we're using
   * Microsoft Fabric Data Agents for AI-powered search.
   */
  const systemMessage = useMemo(() => {
    const draftedAt = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    const confidence = messages.find(m => m.role === 'assistant' && m.confidence)?.confidence;

    return (
      <div className="rounded-md border border-dashed border-indigo-200 bg-indigo-50/60 p-3 text-xs text-indigo-700">
        <p className="font-semibold flex items-center gap-2">
          <Sparkles className="h-4 w-4" aria-hidden="true" />
          Microsoft Fabric Data Agent Integration
        </p>
        <p className="mt-1">
          <span className="font-medium">{badge.label}</span> • {badge.description}
        </p>
        <p className="mt-1 text-indigo-600">
          Responses refreshed at {draftedAt}
          {confidence && (
            <span className="ml-2">
              • Confidence: <span className="font-medium uppercase">{confidence}</span>
            </span>
          )}
        </p>
      </div>
    );
  }, [badge, messages]);

  /**
   * Submit question to Fabric Data Agent
   * 
   * FABRIC API INTEGRATION POINT: This triggers the Data Agent query
   * via the configured service (mock or live).
   */
  const submitQuestion = async (evt: React.FormEvent) => {
    evt.preventDefault();
    const value = input.trim();
    if (!value || isLoading) return;
    setInput('');
    await ask(value);
  };

  return (
    <section 
      aria-label="Microsoft Fabric Data Agent conversational search" 
      className={cx(
        "bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col h-full",
        className
      )}
    >
      <header className="border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-800 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-indigo-500" aria-hidden="true" />
            Microsoft Fabric Data Agent
          </p>
          <p className="text-xs text-slate-500">Conversational AI-powered prompt search</p>
        </div>
        <span
          className={cx(
            'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
            mode === 'mock'
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
          )}
          title={badge.description}
        >
          {badge.label}
        </span>
      </header>

      <div className="flex-1 flex flex-col gap-4 px-4 py-3">
        {systemMessage}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3 max-h-72 focus-within:border-indigo-300"
        >
          {messages.length === 0 ? (
            <div className="text-sm text-slate-500 leading-relaxed">
              Ask what Fabric prompts you need next. Try questions like{' '}
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-800"
                onClick={() => ask('real-time data engineering')}
              >
                “real-time data engineering”
              </button>{' '}
              or{' '}
              <button
                type="button"
                className="font-medium text-indigo-600 hover:text-indigo-800"
                onClick={() => ask('power bi optimization')}
              >
                “power bi optimization”
              </button>
              .
            </div>
          ) : (
            messages.map(message => (
              <article
                key={message.id}
                className={cx(
                  'rounded-md px-3 py-2 text-sm shadow-sm',
                  message.role === 'user'
                    ? 'bg-white border border-slate-200 text-slate-800'
                    : 'bg-indigo-100/80 border border-indigo-200 text-slate-800'
                )}
              >
                <p className="font-semibold text-xs uppercase tracking-wide text-slate-500 mb-1">
                  {message.role === 'user' ? 'You' : 'FabricAgent'}
                </p>
                <p className="leading-relaxed">{message.content}</p>
                {message.role === 'assistant' ? renderAssistantPrompts(message) : null}
              </article>
            ))
          )}
        </div>

        {error ? (
          <div className="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-2">
            {error}
          </div>
        ) : null}

        {suggestions.length > 0 ? (
          <div className="flex flex-wrap gap-2 text-xs">
            {suggestions.map(suggestion => (
              <button
                key={suggestion}
                type="button"
                className="px-3 py-1 rounded-full border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
                onClick={() => ask(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <footer className="border-t border-slate-200 px-4 py-3 space-y-2">
        <form onSubmit={submitQuestion} className="flex items-end gap-2">
          <label className="sr-only" htmlFor="data-agent-question">
            Ask a question
          </label>
          <textarea
            id="data-agent-question"
            className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-400 focus:ring-2 focus:ring-indigo-200 transition resize-none"
            placeholder="Ask FabricAgent for prompts…"
            value={input}
            onChange={event => setInput(event.target.value)}
            rows={2}
            disabled={isLoading}
            aria-label="Ask FabricAgent for prompts"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            disabled={isLoading || input.trim().length === 0}
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            Ask
          </button>
        </form>
        <div className="flex justify-between items-center text-xs text-slate-500">
          <span>Responses cite prompt titles, descriptions, and provenance.</span>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-600 transition focus:outline-none"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Reset chat
          </button>
        </div>
      </footer>
    </section>
  );
};

export default DataAgentChat;
