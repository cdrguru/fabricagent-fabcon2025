
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';
import { AppProvider } from './contexts/AppContext';
import { useData } from './hooks/useData';

// Wrapper to load data before AppProvider
const Root: React.FC = () => {
  const { data, loading, error, globalPromptMap } = useData();

  if (loading) return <div>Loading...</div>;
  if (error || !data) return <div>Failed to load data: {String(error)}</div>;

  return (
    <AppProvider
      globalPromptMap={globalPromptMap}
      catalogueCount={data.catalogue.length}
      workforceCount={data.workforce.length}
      dagNodeCount={data.dag?.nodes?.length || 0}
    >
      <App />
    </AppProvider>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <ErrorBoundary>
        <Root />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);
