/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string;
  readonly VITE_ENABLE_EXPERIMENTAL?: string;
  readonly VITE_HELP_CENTER_URL?: string;
  readonly VITE_HELP_URL?: string;
  readonly VITE_ANALYTICS_KEY?: string;
  readonly VITE_USE_MOCK_SERVICES?: string;
  readonly VITE_FABRIC_DATA_AGENT_ENDPOINT?: string;
  readonly VITE_FABRIC_EVENTSTREAM_ENDPOINT?: string;
  readonly VITE_FABRIC_EVENTHOUSE_ENDPOINT?: string;
  // Add additional VITE_ vars here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}


