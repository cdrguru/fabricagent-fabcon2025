/**
 * ServiceFactory.ts
 * 
 * Factory pattern for switching between mock and live Fabric services.
 * Controlled by VITE_USE_MOCK_SERVICES environment variable.
 * 
 * This enables demo-safe mode: reliable mock data for video recording
 * vs. live Fabric integration for production deployment.
 */

import config from '../config';
import MockRtiService from './MockRtiService';
import MockDataAgentService from './MockDataAgentService';

// Import live services when implemented
// import LiveRtiService from './LiveRtiService';
// import LiveDataAgentService from './LiveDataAgentService';

/**
 * Get RTI Service instance (mock or live based on config)
 */
export const getRtiService = () => {
  if (config.useMockServices) {
    console.log('[ServiceFactory] Using MockRtiService (demo safe mode)');
    return MockRtiService;
  }
  
  // TODO: Implement LiveRtiService and uncomment
  // console.log('[ServiceFactory] Using LiveRtiService (Fabric integration)');
  // return LiveRtiService;
  
  console.warn('[ServiceFactory] Live RTI service not implemented, falling back to mock');
  return MockRtiService;
};

/**
 * Get Data Agent Service instance (mock or live based on config)
 */
export const getDataAgentService = () => {
  if (config.useMockServices) {
    console.log('[ServiceFactory] Using MockDataAgentService (demo safe mode)');
    return MockDataAgentService;
  }
  
  // TODO: Implement LiveDataAgentService and uncomment
  // console.log('[ServiceFactory] Using LiveDataAgentService (Fabric integration)');
  // return LiveDataAgentService;
  
  console.warn('[ServiceFactory] Live Data Agent service not implemented, falling back to mock');
  return MockDataAgentService;
};

/**
 * Health check for current service configuration
 */
export const getServiceHealth = async (): Promise<{
  mode: 'mock' | 'live';
  rtiStatus: 'healthy' | 'degraded' | 'unavailable';
  dataAgentStatus: 'healthy' | 'degraded' | 'unavailable';
}> => {
  const mode = config.useMockServices ? 'mock' : 'live';
  
  try {
    const rtiService = getRtiService();
    const dataAgentService = getDataAgentService();
    
    const [rtiHealth, dataAgentHealth] = await Promise.all([
      rtiService.healthCheck?.() ?? { status: 'unavailable' },
      dataAgentService.healthCheck?.() ?? { status: 'unavailable' }
    ]);
    
    return {
      mode,
      rtiStatus: rtiHealth.status === 'healthy' ? 'healthy' : 'degraded',
      dataAgentStatus: dataAgentHealth.status === 'healthy' ? 'healthy' : 'degraded'
    };
  } catch (error) {
    console.error('[ServiceFactory] Health check failed:', error);
    return {
      mode,
      rtiStatus: 'unavailable',
      dataAgentStatus: 'unavailable'
    };
  }
};

export default { getRtiService, getDataAgentService, getServiceHealth };
