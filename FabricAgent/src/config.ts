
// Centralized runtime configuration using Vite env variables
export const config = {
  apiBase: (import.meta.env.VITE_API_BASE as string) || 'https://api.fabricprompts.com',
  enableExperimental: String(import.meta.env.VITE_ENABLE_EXPERIMENTAL || '').toLowerCase() === 'true',
  helpCenterUrl:
    (import.meta.env.VITE_HELP_CENTER_URL as string) ||
    (import.meta.env.VITE_HELP_URL as string) ||
    'https://www.chatbase.co/mnxB5kB3I-JSpdYAEJB2W/help',
  analyticsKey: (import.meta.env.VITE_ANALYTICS_KEY as string) || '',
  
  // Demo Safe Mode - use mock services for reliable demo recording
  // Set VITE_USE_MOCK_SERVICES=true to enable mock Data Agent and RTI services
  useMockServices: String(import.meta.env.VITE_USE_MOCK_SERVICES || '').toLowerCase() === 'true',
  
  // Fabric integration endpoints (only used when useMockServices=false)
  fabricDataAgentEndpoint: (import.meta.env.VITE_FABRIC_DATA_AGENT_ENDPOINT as string) || '',
  fabricEventstreamEndpoint: (import.meta.env.VITE_FABRIC_EVENTSTREAM_ENDPOINT as string) || '',
  fabricEventhouseEndpoint: (import.meta.env.VITE_FABRIC_EVENTHOUSE_ENDPOINT as string) || ''
};
export default config;
