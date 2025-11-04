/**
 * rtiService.ts
 * 
 * Facade for Microsoft Fabric Real-Time Intelligence (RTI) integration.
 * Routes telemetry events to Eventstream via MockRtiService or LiveRtiService.
 * 
 * Competition Note: RTI integration showcases "Best Use of Real-Time Intelligence"
 * secondary category. Telemetry flows: React app → Eventstream → Eventhouse → Power BI.
 * 
 * Refactored to use strict types from services/types.ts
 */

import { getRtiService } from './ServiceFactory';
import type { RtiTelemetryEvent, RTIDashboardMetrics, ServiceHealthStatus } from './types';

// Re-export types for convenience
export type { RtiTelemetryEvent, RTIDashboardMetrics, ServiceHealthStatus } from './types';

/**
 * Telemetry payload (timestamp and session_id auto-generated)
 */
export type TelemetryPayload = Omit<RtiTelemetryEvent, 'timestamp' | 'session_id'>;

/**
 * Emit a telemetry event to Microsoft Fabric Eventstream.
 * 
 * FABRIC RTI INTEGRATION POINT: Routes to configured service (mock or live).
 * Events are captured in Eventhouse for real-time Power BI dashboards.
 * 
 * @param event - Telemetry event (timestamp/session auto-generated if not provided)
 */
export async function emitTelemetryEvent(event: TelemetryPayload): Promise<void> {
  const service = getRtiService();

  if (typeof service.emitEvent !== 'function') {
    throw new Error('RTI service does not provide an emitEvent implementation');
  }

  await service.emitEvent(event);
}

/**
 * Retrieve dashboard metrics from Microsoft Fabric Eventhouse.
 * 
 * FABRIC RTI INTEGRATION POINT: Queries aggregated metrics from Eventhouse
 * for real-time Power BI dashboards.
 * 
 * @returns Dashboard metrics including top searches, opened prompts, trends
 */
export async function fetchRtiDashboardMetrics(): Promise<RTIDashboardMetrics> {
  const service = getRtiService();

  if (typeof service.getDashboardMetrics !== 'function') {
    throw new Error('RTI service does not provide a getDashboardMetrics implementation');
  }

  return service.getDashboardMetrics();
}

/**
 * Clear the telemetry queue when supported by the implementation.
 * Useful for resetting state during testing or demo preparation.
 */
export function clearTelemetryQueue(): void {
  const service = getRtiService();
  service.clearQueue?.();
}

/**
 * Run a health check against the active RTI service.
 * 
 * @returns Health status including mode (mock/live) and latency
 */
export async function checkRtiHealth(): Promise<ServiceHealthStatus> {
  const service = getRtiService();

  if (typeof service.healthCheck !== 'function') {
    return { status: 'unavailable' };
  }

  try {
    const result = await service.healthCheck();
    return result;
  } catch (error) {
    console.error('[RTI Service] Health check failed:', error);
    return { 
      status: 'unavailable',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
