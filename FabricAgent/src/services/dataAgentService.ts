/**
 * dataAgentService.ts
 * 
 * Facade for Microsoft Fabric Data Agent API calls.
 * Routes to MockDataAgentService or LiveDataAgentService via ServiceFactory.
 * 
 * Competition Note: This abstraction allows demo-safe mock mode during
 * video recording while preserving the same API surface for live Fabric integration.
 * 
 * Refactored to use strict types from services/types.ts
 */

/**
 * dataAgentService.ts
 * 
 * Facade for Microsoft Fabric Data Agent integration.
 * Routes queries to either MockDataAgentService or LiveDataAgentService.
 * 
 * Competition Note: Data Agent integration showcases "Best Use of AI Features"
 * primary category with conversational semantic search capabilities.
 * 
 * Refactored to use strict types from services/types.ts
 */

import { getDataAgentService } from './ServiceFactory';
import type { DataAgentQuery, DataAgentResponse, ServiceHealthStatus } from './types';

// Re-export types for convenience
export type { DataAgentQuery, DataAgentResponse, ServiceHealthStatus } from './types';

/**
 * Execute a conversational query against Microsoft Fabric Data Agent.
 * 
 * FABRIC API INTEGRATION POINT: Routes to configured service (mock or live).
 * 
 * @param request - Query with natural language question and context
 * @returns Data Agent response with answer and relevant prompts
 * @throws Error if service is not properly configured
 */
export async function queryDataAgent(request: DataAgentQuery): Promise<DataAgentResponse> {
  const service = getDataAgentService();

  if (typeof service.query !== 'function') {
    throw new Error('Data Agent service does not provide a query implementation');
  }

  return service.query(request);
}

/**
 * Fetch follow-up suggestions when the underlying service exposes them.
 * 
 * @param context - Conversation history for context-aware suggestions
 * @returns Array of suggested follow-up questions
 */
export async function getDataAgentSuggestions(context: string[]): Promise<string[]> {
  const service = getDataAgentService();

  if (typeof service.getSuggestions !== 'function') {
    return [];
  }

  return service.getSuggestions(context);
}

/**
 * Run a health check against the active Data Agent service.
 * 
 * @returns Health status including mode (mock/live) and latency
 */
export async function checkDataAgentHealth(): Promise<ServiceHealthStatus> {
  const service = getDataAgentService();

  if (typeof service.healthCheck !== 'function') {
    return { status: 'unavailable' };
  }

  try {
    const result = await service.healthCheck();
    return result;
  } catch (error) {
    console.error('[Data Agent Service] Health check failed:', error);
    return { 
      status: 'unavailable',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
