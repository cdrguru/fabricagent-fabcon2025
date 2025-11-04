/**
 * MockRtiService.ts
 * 
 * Provides mock Real-Time Intelligence telemetry data for demo safe mode.
 * Returns realistic static JSON data suitable for the 3-5 minute demo video.
 * 
 * Enable mock mode by setting VITE_USE_MOCK_SERVICES=true in environment.
 */

export interface TelemetryEvent {
  timestamp: string;
  event_type: 'search' | 'prompt_open' | 'filter_change' | 'dag_interaction' | 'favorite';
  prompt_id?: string;
  prompt_title?: string;
  search_query?: string;
  pillar?: string;
  session_id: string;
  user_agent?: string;
}

export interface RTIDashboardMetrics {
  topSearches: Array<{ query: string; count: number }>;
  mostOpenedPrompts: Array<{ id: string; title: string; opens: number; pillar: string }>;
  trendingPillars: Array<{ pillar: string; activity_count: number; trend_direction: 'up' | 'stable' | 'down' }>;
  recentActivity: Array<TelemetryEvent>;
  lastUpdated: string;
}

/**
 * Mock telemetry event queue - simulates Eventstream buffer
 */
class MockEventQueue {
  private events: TelemetryEvent[] = [];
  private readonly maxSize = 1000;

  push(event: TelemetryEvent): void {
    this.events.push(event);
    if (this.events.length > this.maxSize) {
      this.events.shift(); // FIFO queue
    }
    console.log('[MockRtiService] Event queued:', event.event_type, event.prompt_id || event.search_query);
  }

  getRecent(limit: number = 20): TelemetryEvent[] {
    return this.events.slice(-limit).reverse();
  }

  clear(): void {
    this.events = [];
  }
}

const mockQueue = new MockEventQueue();

/**
 * Golden path demo data - shows clear insights for judges
 */
const generateMockMetrics = (): RTIDashboardMetrics => {
  return {
    topSearches: [
      { query: 'real-time data engineering', count: 47 },
      { query: 'power bi optimization', count: 38 },
      { query: 'fabric lakehouse', count: 32 },
      { query: 'eventstream patterns', count: 28 },
      { query: 'data quality checks', count: 24 },
      { query: 'dax performance tuning', count: 19 },
      { query: 'semantic model best practices', count: 16 },
      { query: 'kql queries eventhouse', count: 14 },
      { query: 'dataflow gen2', count: 12 },
      { query: 'fabric api automation', count: 10 }
    ],
    mostOpenedPrompts: [
      {
        id: 'giac-s01e01-001',
        title: 'Real-Time Data Engineering with Eventstream',
        opens: 156,
        pillar: 'Data Engineering'
      },
      {
        id: 'workforce-analytics-001',
        title: 'Optimize Power BI Report Performance',
        opens: 142,
        pillar: 'Power BI'
      },
      {
        id: 'giac-s01e02-005',
        title: 'Lakehouse Architecture Patterns',
        opens: 128,
        pillar: 'Data Engineering'
      },
      {
        id: 'workforce-dataops-003',
        title: 'Implement Data Quality Checks',
        opens: 98,
        pillar: 'Data Engineering'
      },
      {
        id: 'giac-s01e03-008',
        title: 'KQL Query Optimization in Eventhouse',
        opens: 87,
        pillar: 'Real-Time Intelligence'
      },
      {
        id: 'workforce-semantic-002',
        title: 'DAX Performance Best Practices',
        opens: 76,
        pillar: 'Power BI'
      },
      {
        id: 'giac-s01e04-012',
        title: 'Dataflow Gen2 Transformation Patterns',
        opens: 64,
        pillar: 'Data Engineering'
      },
      {
        id: 'workforce-fabric-api-001',
        title: 'Automate Fabric Deployments with APIs',
        opens: 52,
        pillar: 'Data Engineering'
      }
    ],
    trendingPillars: [
      { pillar: 'Real-Time Intelligence', activity_count: 243, trend_direction: 'up' },
      { pillar: 'Data Engineering', activity_count: 198, trend_direction: 'up' },
      { pillar: 'Power BI', activity_count: 167, trend_direction: 'stable' },
      { pillar: 'Data Science', activity_count: 89, trend_direction: 'up' },
      { pillar: 'Data Warehouse', activity_count: 76, trend_direction: 'stable' }
    ],
    recentActivity: mockQueue.getRecent(10),
    lastUpdated: new Date().toISOString()
  };
};

/**
 * Mock Eventstream client - simulates sending events to Fabric
 */
export const MockRtiService = {
  /**
   * Emit telemetry event (queues locally in mock mode)
   */
  emitEvent: async (event: Omit<TelemetryEvent, 'timestamp' | 'session_id'>): Promise<void> => {
    const fullEvent: TelemetryEvent = {
      ...event,
      timestamp: new Date().toISOString(),
      session_id: getMockSessionId()
    };

    mockQueue.push(fullEvent);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 50));
    
    console.log('[MockRtiService] Event emitted successfully');
  },

  /**
   * Fetch dashboard metrics (returns golden path demo data)
   */
  getDashboardMetrics: async (): Promise<RTIDashboardMetrics> => {
    // Simulate Eventhouse query latency
    await new Promise(resolve => setTimeout(resolve, 100));
    
    return generateMockMetrics();
  },

  /**
   * Health check for mock service
   */
  healthCheck: async (): Promise<{ status: 'healthy'; mode: 'mock' }> => {
    return { status: 'healthy', mode: 'mock' };
  },

  /**
   * Clear mock queue (useful for testing/demos)
   */
  clearQueue: (): void => {
    mockQueue.clear();
    console.log('[MockRtiService] Event queue cleared');
  }
};

/**
 * Generate or retrieve mock session ID
 */
function getMockSessionId(): string {
  const storageKey = 'mock_session_id';
  let sessionId = sessionStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = `mock_session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
}

export default MockRtiService;
