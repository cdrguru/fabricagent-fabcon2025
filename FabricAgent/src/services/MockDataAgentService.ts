/**
 * MockDataAgentService.ts
 * 
 * Provides mock Data Agent conversational search responses for demo safe mode.
 * Returns realistic responses that demonstrate Fabric AI capabilities without
 * requiring live Fabric Data Agent connectivity.
 * 
 * Enable mock mode by setting VITE_USE_MOCK_SERVICES=true in environment.
 * 
 * Refactored to use centralized types from services/types.ts for consistency.
 */

import type {
  DataAgentQuery,
  DataAgentResponse,
  PromptResult,
  ServiceHealthStatus,
  IDataAgentService
} from './types';

// Re-export types for backward compatibility
export type { DataAgentQuery, DataAgentResponse, PromptResult } from './types';

/**
 * Golden path demo queries and responses
 */
const mockResponses: Record<string, DataAgentResponse> = {
  'real-time data engineering': {
    answer: "For real-time data engineering in Microsoft Fabric, I recommend these prompts that cover Eventstream patterns, KQL optimization, and streaming architectures.",
    prompts: [
      {
        id: 'giac-s01e01-001',
        title: 'Real-Time Data Engineering with Eventstream',
        description: 'Learn how to build scalable real-time data pipelines using Fabric Eventstream and Eventhouse.',
        pillar: 'Data Engineering',
        tags: ['eventstream', 'real-time', 'streaming', 'kql'],
        source: 'GIAC S01E01',
        relevance_score: 0.95
      },
      {
        id: 'giac-s01e03-008',
        title: 'KQL Query Optimization in Eventhouse',
        description: 'Advanced KQL techniques for optimizing real-time analytics queries in Eventhouse.',
        pillar: 'Real-Time Intelligence',
        tags: ['kql', 'eventhouse', 'optimization', 'performance'],
        source: 'GIAC S01E03',
        relevance_score: 0.92
      },
      {
        id: 'workforce-dataops-005',
        title: 'Monitor Streaming Data Quality',
        description: 'Implement real-time data quality checks for streaming pipelines.',
        pillar: 'Data Engineering',
        tags: ['data quality', 'streaming', 'monitoring'],
        source: 'Workforce Catalog',
        relevance_score: 0.87
      }
    ],
    conversational_context: ['real-time data engineering'],
    timestamp: new Date().toISOString(),
    confidence: 'high'
  },
  
  'power bi optimization': {
    answer: "Here are proven techniques for optimizing Power BI reports and semantic models for better performance and user experience.",
    prompts: [
      {
        id: 'workforce-analytics-001',
        title: 'Optimize Power BI Report Performance',
        description: 'Best practices for reducing report load times and improving visual responsiveness.',
        pillar: 'Power BI',
        tags: ['performance', 'optimization', 'dax', 'visuals'],
        source: 'Workforce Catalog',
        relevance_score: 0.96
      },
      {
        id: 'workforce-semantic-002',
        title: 'DAX Performance Best Practices',
        description: 'Write efficient DAX measures and calculated columns for optimal query performance.',
        pillar: 'Power BI',
        tags: ['dax', 'performance', 'optimization', 'measures'],
        source: 'Workforce Catalog',
        relevance_score: 0.94
      },
      {
        id: 'giac-s01e02-003',
        title: 'Semantic Model Design Patterns',
        description: 'Design scalable semantic models that support enterprise reporting needs.',
        pillar: 'Power BI',
        tags: ['semantic model', 'design', 'architecture'],
        source: 'GIAC S01E02',
        relevance_score: 0.89
      }
    ],
    conversational_context: ['power bi optimization'],
    timestamp: new Date().toISOString(),
    confidence: 'high'
  },

  'data quality checks': {
    answer: "Data quality is crucial for reliable analytics. These prompts cover validation patterns, testing frameworks, and monitoring strategies.",
    prompts: [
      {
        id: 'workforce-dataops-003',
        title: 'Implement Data Quality Checks',
        description: 'Comprehensive guide to implementing automated data quality validation in Fabric pipelines.',
        pillar: 'Data Engineering',
        tags: ['data quality', 'validation', 'testing', 'monitoring'],
        source: 'Workforce Catalog',
        relevance_score: 0.97
      },
      {
        id: 'workforce-dataops-007',
        title: 'Data Profiling and Anomaly Detection',
        description: 'Use Fabric capabilities to profile datasets and detect anomalies automatically.',
        pillar: 'Data Engineering',
        tags: ['data profiling', 'anomaly detection', 'data quality'],
        source: 'Workforce Catalog',
        relevance_score: 0.91
      },
      {
        id: 'giac-s01e04-010',
        title: 'Testing Data Pipelines in Fabric',
        description: 'Best practices for unit testing and integration testing Dataflow Gen2 pipelines.',
        pillar: 'Data Engineering',
        tags: ['testing', 'dataflow', 'quality assurance'],
        source: 'GIAC S01E04',
        relevance_score: 0.86
      }
    ],
    conversational_context: ['data quality checks'],
    timestamp: new Date().toISOString(),
    confidence: 'high'
  },

  'fabric lakehouse': {
    answer: "Lakehouse architecture combines the best of data lakes and warehouses. Here are key patterns and implementation guides.",
    prompts: [
      {
        id: 'giac-s01e02-005',
        title: 'Lakehouse Architecture Patterns',
        description: 'Comprehensive guide to designing and implementing lakehouse solutions in Microsoft Fabric.',
        pillar: 'Data Engineering',
        tags: ['lakehouse', 'architecture', 'onelake', 'delta'],
        source: 'GIAC S01E02',
        relevance_score: 0.98
      },
      {
        id: 'workforce-lakehouse-001',
        title: 'Medallion Architecture in Fabric',
        description: 'Implement bronze, silver, and gold data layers for governed data processing.',
        pillar: 'Data Engineering',
        tags: ['medallion', 'bronze', 'silver', 'gold', 'data governance'],
        source: 'Workforce Catalog',
        relevance_score: 0.93
      },
      {
        id: 'giac-s01e02-006',
        title: 'Optimizing Delta Tables in OneLake',
        description: 'Techniques for optimizing Delta table performance and storage in OneLake.',
        pillar: 'Data Engineering',
        tags: ['delta', 'onelake', 'optimization', 'storage'],
        source: 'GIAC S01E02',
        relevance_score: 0.89
      }
    ],
    conversational_context: ['fabric lakehouse'],
    timestamp: new Date().toISOString(),
    confidence: 'high'
  }
};

/**
 * Fallback response for unmatched queries
 */
const generateFallbackResponse = (query: string): DataAgentResponse => {
  return {
    answer: `I found several prompts related to "${query}". While I don't have a specific pre-configured response, these results should help you get started with your task.`,
    prompts: [
      {
        id: 'general-001',
        title: 'Getting Started with Microsoft Fabric',
        description: 'Comprehensive introduction to Microsoft Fabric capabilities and core concepts.',
        pillar: 'General',
        tags: ['getting started', 'fabric', 'overview'],
        source: 'Workforce Catalog',
        relevance_score: 0.65
      }
    ],
    conversational_context: [query],
    timestamp: new Date().toISOString(),
    confidence: 'low'
  };
};

/**
 * Mock Data Agent service
 */
export const MockDataAgentService = {
  /**
   * Query the mock Data Agent with natural language
   */
  query: async (request: DataAgentQuery): Promise<DataAgentResponse> => {
    // Simulate AI processing latency (200-500ms for realism)
    const latency = 200 + Math.random() * 300;
    await new Promise(resolve => setTimeout(resolve, latency));

    const normalizedQuery = request.query.toLowerCase().trim();
    
    // Check for exact or partial matches in mock responses
    for (const [key, response] of Object.entries(mockResponses)) {
      if (normalizedQuery.includes(key) || key.includes(normalizedQuery)) {
        console.log('[MockDataAgentService] Matched query to golden path response:', key);
        return {
          ...response,
          timestamp: new Date().toISOString(),
          conversational_context: [...(request.context || []), request.query]
        };
      }
    }

    // Fallback for unmapped queries
    console.log('[MockDataAgentService] Using fallback response for query:', request.query);
    return generateFallbackResponse(request.query);
  },

  /**
   * Get suggested follow-up queries based on context
   */
  getSuggestions: async (context: string[]): Promise<string[]> => {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const suggestions = [
      "Which prompts use Python notebooks?",
      "Show me prompts for data engineering",
      "What are best practices for real-time data?",
      "Help me optimize my Power BI reports",
      "How do I implement data quality checks?"
    ];

    return suggestions.slice(0, 3);
  },

  /**
   * Health check for mock service
   */
  healthCheck: async (): Promise<ServiceHealthStatus> => {
    return { 
      status: 'healthy', 
      mode: 'mock',
      latency_ms: 50 
    };
  }
};

export default MockDataAgentService;
