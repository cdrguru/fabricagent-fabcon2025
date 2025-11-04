# Technical Plan: FabCon 2025 Submission

## Architecture Overview

FabricAgent runs as a Vite-powered React SPA that loads curated JSON datasets at startup, renders catalog views, and coordinates auxiliary panels (Data Agent chat, RTI dashboard, workflow DAG). A service factory reads environment configuration and selects either real Fabric endpoints or mock providers. When Fabric services are enabled, the SPA communicates with:

- **Microsoft Fabric Data Agent** for conversational search grounded in the prompt catalog stored in OneLake.
- **Fabric Eventstream → Eventhouse** for telemetry ingestion and KQL-backed analytics that feed the RTI dashboard.
- **Open Mirroring** pipelines (maintained in a separate content curation workspace) that hydrate OneLake tables before exporting JSON to the frontend.
Upstream automation remains outside this repo and publishes curated JSON artifacts consumed by FabricAgent.

## Technology Stack

### Frontend

- React 18 with functional components, hooks, and strict TypeScript.
- Vite build tooling with modern bundling and dev server support.
- Component library: in-house styling + Fluent-inspired patterns (no heavy framework swaps).
- State managed via React context/hooks; service layer encapsulated in `src/services`.

### Backend/Services

- No custom backend; instead, thin service clients call Fabric REST endpoints.
- Mock services (`MockDataAgentService.ts`, `MockRtiService.ts`, etc.) provide deterministic responses for demo mode.
- Upstream notebooks/scripts (maintained privately) orchestrate DAG runs, mirroring sync, and Data Agent context publication.

### Fabric Integration Points

- **Data Agents:** `useDataAgent` hook + `dataAgentService` interface target the Fabric Data Agent endpoint specified in `VITE_DATA_AGENT_ENDPOINT`. A setup script publishes the prompt catalog Delta table into the workspace.
- **Real-Time Intelligence:** `telemetryService` batches client events and posts to `VITE_EVENTSTREAM_ENDPOINT`; `RTIDashboard` ingests KQL summaries exposed via `VITE_EVENTHOUSE_QUERY_URL` or mock feed.
- **Open Mirroring:** Mirroring connectors push external governance datasets into OneLake; the curation DAG emits JSON with `source: "mirrored"` flags, displayed throughout the UI.

## Data Models

- `prompt-catalog.json`: array of prompt objects with id, title, description, tags, pillar, provenance badges, optional video URL.
- `workforce_prompts.json`: persona-specific prompt flows and task checklists.
- `dag.json`: node/edge definitions for workflow visualization, including `source` metadata (e.g., `"mirrored"`).
- Telemetry payload schema: `{ eventType, promptId?, filter?, queryText?, timestamp, sessionId }`.
- Data Agent chat request/response: `{ messageHistory: ChatTurn[], filters } → { results: PromptSummary[], confidence, followUps }`.

## API Contracts

- `DataAgentService` interface exposes `query(message: string, context: QueryContext): Promise<DataAgentResult>` with deterministic mocks returning three high-confidence prompts.
- `TelemetryService` interface exposes `record(event: TelemetryEvent)` and `flush()`; production implementation posts to Eventstream REST API, mock buffers to in-memory arrays for dashboard replay.
- `RtiMetricsService` exposes `fetchMetrics(): Promise<RtiSnapshot>` on a polling interval, sourcing KQL results (live) or synthetic data (mock).
- Environment-driven configuration lives in `config.ts` and `.env.example` docs (`VITE_USE_MOCK_SERVICES`, `VITE_DATA_AGENT_ENDPOINT`, `VITE_EVENTSTREAM_ENDPOINT`, `VITE_EVENTHOUSE_QUERY_URL`, `VITE_MIRRORING_BADGE_LABEL`).

## Deployment Strategy

- **Demo Mode:** Default for judging and recording. Set `VITE_USE_MOCK_SERVICES=true`, run `npm run dev` or `npm run preview`. Guarantees Data Agent chat and RTI dashboard respond instantly without Fabric dependencies.
- **Live Mode:** Provide Fabric credentials and endpoints in `.env.local`, rebuild with `npm run build`, and serve via Azure Static Web Apps. Fabric resources are provisioned per `docs/DEPLOYMENT_AZURE.md` and integration guides.
- **Hosting:** Target Azure Static Web Apps (preferred) for static bundle; existing Azure App Service attempt (Linux) is being replaced by SWA deployment to align with SPA hosting requirements.
- **Validation:** Execute `npm ci && npm run build`, `verify_fabricagent.sh`, and `validate_publication_readiness.sh` before any deployment or submission.

## Risk Mitigation

- **Service Instability:** Maintain mock services and synthetic telemetry scripts; fall back to demo mode if Fabric endpoints fail.
- **Video Reliability:** Follow the rehearsed script, disable OS notifications, and keep a clean telemetry slate before recording; use backup footage and captions to emphasize Fabric features.
- **Documentation Drift:** Align README, Executive Briefing, FABRIC_INTEGRATIONS.md, and spec-kit artifacts after every change; validation scripts flag missing assets or broken links.
- **Hosting Misconfiguration:** Switch to Azure Static Web Apps to avoid Node host assumptions; keep rollback zip (`.temp/fabricagent-dist.zip`) ready for redeploy.
- **Time Compression:** Track remaining phases via `.temp/Repo consolidation plan.txt` and `FINAL_SUBMISSION_SEQUENCE.md`, prioritizing demo/video tasks before optional polishing.
