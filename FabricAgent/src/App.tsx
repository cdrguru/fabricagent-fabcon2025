
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useRoutes, Navigate } from "react-router-dom";
import { CatalogueSection } from "./components/sections/CatalogueSection";
import { WorkforceSection } from "./components/sections/WorkforceSection";
import { DagSection } from "./components/sections/DagSection";
import HelpSection from "./HelpSection";
import { Header } from "./components/layout/Header";
import { Footer } from "./components/layout/Footer";
import { Hero } from "./components/ui/Hero";
import { BlockedResourceNotice } from "./components/ui/BlockedResourceNotice";
import { useData } from "./hooks/useData";
import { Prompt } from "./types";
import { incrementViewCount } from './utils/storage';
import { emitTelemetryEvent } from './services/rtiService';
import { PromptDetailsModal } from "./components/tables/PromptDetailsModal";
import { useChatbase } from "./hooks/useChatbase";

export type Section = "catalogue" | "workforce" | "dag" | "help";

const App: React.FC = () => {
  const location = useLocation();
  const { data, loading, error, sourceLabel, downloadLinks, globalPromptMap } = useData();
  const [selectedPrompts, setSelectedPrompts] = useState<Set<string>>(new Set());
  const [modalPrompt, setModalPrompt] = useState<Prompt | null>(null);

  // Map path to section for header state
  const activeSection: Section | null = useMemo(() => {
    const p = location.pathname;
    if (p.startsWith("/workforce")) return "workforce";
    if (p.startsWith("/workflow") || p.startsWith("/dag")) return "dag";
    if (p.startsWith("/help")) return "help";
    if (p === "/" || p.startsWith("/catalogue")) return "catalogue";
    return null;
  }, [location.pathname]);

  // Document title
  useEffect(() => {
    const base = "FabricAgent Prompt Explorer";
    document.title = location.pathname.startsWith("/help") ? `Help • ${base}` : base;
  }, [location.pathname]);

  // Chatbase widget across main routes
  // Avoid loading the Chatbase widget on the Help route if the Help iframe also loads Chatbase content
  useChatbase(["/", "/catalogue", "/workforce", "/workflow", "/dag"]);

  const onShowDetails = (prompt: Prompt) => {
    setModalPrompt(prompt);
    try {
      incrementViewCount(prompt.id);
    } catch {
      // localStorage might be unavailable in some environments; ignore silently
    }
    void emitTelemetryEvent({
      event_type: 'prompt_open',
      prompt_id: prompt.id,
      prompt_title: prompt.name || prompt.summary || prompt.description || '',
      pillar: prompt.pillars?.[0]
    }).catch(() => {
      // Telemetry is non-blocking; ignore demo-safe failures
    });
  };
  const closeModal = () => setModalPrompt(null);

  // Build routes unconditionally to keep hook order stable
  const routes = (data && !loading && !error)
    ? [
    {
      path: "/",
      element: (
        <CatalogueSection
          prompts={data.catalogue}
          downloadUrl={downloadLinks.catalogue}
          selectedPrompts={selectedPrompts}
          setSelectedPrompts={setSelectedPrompts}
          onShowDetails={onShowDetails}
          globalPromptMap={globalPromptMap}
          catalogueCount={data.catalogue.length}
          workforceCount={data.workforce.length}
          dagNodeCount={data.dag?.nodes?.length || 0}
        />
      ),
    },
    {
      path: "/catalogue",
      element: (
        <CatalogueSection
          prompts={data.catalogue}
          downloadUrl={downloadLinks.catalogue}
          selectedPrompts={selectedPrompts}
          setSelectedPrompts={setSelectedPrompts}
          onShowDetails={onShowDetails}
          globalPromptMap={globalPromptMap}
          catalogueCount={data.catalogue.length}
          workforceCount={data.workforce.length}
          dagNodeCount={data.dag?.nodes?.length || 0}
        />
      ),
    },
    {
      path: "/workforce",
      element: (
        <WorkforceSection
          prompts={data.workforce}
          downloadUrl={downloadLinks.workforce}
          selectedPrompts={selectedPrompts}
          setSelectedPrompts={setSelectedPrompts}
          onShowDetails={onShowDetails}
          globalPromptMap={globalPromptMap}
        />
      ),
    },
    {
      path: "/workflow",
      element: (
        <DagSection
          dag={data.dag}
          downloadUrl={downloadLinks.dag}
          onShowDetails={onShowDetails}
          globalPromptMap={globalPromptMap}
        />
      ),
    },
    { path: "/dag", element: <Navigate to="/workflow" replace /> },
    { path: "/help", element: <HelpSection /> },
    {
      path: "/health",
      element: (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center max-w-md mx-auto">
            <div className="text-green-600 text-3xl font-semibold mb-4">✓ System Healthy</div>
            <div className="bg-white rounded-lg shadow-sm border p-6 text-left">
              <h3 className="font-semibold text-slate-800 mb-3">Health Check Details</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <div><strong>Service:</strong> FabricAgent Prompt Explorer</div>
                <div><strong>Status:</strong> <span className="text-green-600">Operational</span></div>
                <div><strong>Version:</strong> 1.0.0</div>
                <div><strong>Environment:</strong> Production</div>
                <div><strong>Timestamp:</strong> {new Date().toISOString()}</div>
                <div><strong>Data Status:</strong> {data ? <span className="text-green-600">Loaded</span> : <span className="text-yellow-600">Loading</span>}</div>
                <div><strong>Catalog Count:</strong> {data?.catalogue?.length || 0}</div>
                <div><strong>Workforce Count:</strong> {data?.workforce?.length || 0}</div>
                <div><strong>DAG Nodes:</strong> {data?.dag?.nodes?.length || 0}</div>
              </div>
            </div>
            <div className="mt-4 text-xs text-slate-500">
              Static endpoints: <a href="/ping" className="text-blue-600 hover:underline">/ping</a> • <a href="/health.json" className="text-blue-600 hover:underline">/health.json</a>
            </div>
          </div>
        </div>
      )
    },
    { path: "*", element: <Navigate to="/" replace /> },
  ]
    : [
      {
        path: "*",
        element: (
          <div className="min-h-[50vh] flex items-center justify-center text-slate-600">
            {loading ? "Loading…" : (error ? error : "Failed to load data")}
          </div>
        )
      }
    ];

  const element = useRoutes(routes);

  // Deep-link: open modal by id after data loads
  useEffect(() => {
    if (!data || loading || error) return;
    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id && globalPromptMap.has(id.toLowerCase())) {
      const p = globalPromptMap.get(id.toLowerCase());
      if (p) setModalPrompt(p);
    }
  }, [data, loading, error, globalPromptMap]);

  const isDagAvailable = Boolean(data && data.dag && data.dag.nodes && data.dag.nodes.length > 0);
  const isHelp = activeSection === "help";

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        activeSection={activeSection}
        onSectionChange={() => {}}
        sourceLabel={sourceLabel}
        isDagAvailable={isDagAvailable}
        isHelp={isHelp}
      />
      <BlockedResourceNotice />
      <a href="#main-content" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 bg-white border border-slate-300 rounded px-3 py-2 z-50">Skip to content</a>
      <main id="main-content" className="max-w-7xl mx-auto px-4 py-8">{element}</main>
      <Footer />
      {modalPrompt && data && (
        <PromptDetailsModal
          prompt={modalPrompt}
          onClose={closeModal}
          context={activeSection === 'workforce' ? 'workforce' : 'catalogue'}
          relatedPool={activeSection === 'workforce' ? data.workforce : data.catalogue}
          onShowPrompt={(p) => setModalPrompt(p)}
        />
      )}
    </div>
  );
};

export default App;
