# Executive Briefing: FabricAgent

> Provenance: This briefing summarizes an AI-generated video created with Google Notebook (NotebookLM) to introduce FabricAgent. It is not meeting minutes. The video and this document were produced from project materials in this repository to provide an executive-level overview.

## What FabricAgent Is

- Governed prompt catalog and workflow companion for Microsoft Fabric and Power BI teams.
- React single-page experience (Vite) that lets users browse, search, and filter curated prompts with provenance, tags, and source links.
- Two primary knowledge sources today: Guy in a Cube transcripts (38 prompts) and workforce prompts for common enterprise roles (72 prompts).
- Public demo: <https://fabricprompts.com/>

## Strategic Narrative for FabCon

- **Competition Target:** Best Use of AI Features within Microsoft Fabric with bonus coverage of Real-Time Intelligence and Open Mirroring.
- **Problem:** Prompt sprawl and governance gaps slow Fabric teams.
- **Solution:** FabricAgent pairs curated content with Fabric-native services to keep prompts discoverable, governed, and measurable.
- **Impact Story:** Data Agents deliver grounded answers, RTI showcases adoption in real time, and Open Mirroring keeps governance content fresh.

## Fabric Integration Pillars

| Pillar | Demo Moment | Why It Matters | Reference |
| --- | --- | --- | --- |
| **Data Agents (AI Features)** | Conversational search for “real-time data engineering prompts” with follow-up refinement | Proves Fabric-native AI grounded in enterprise catalog | `docs/FABRIC_INTEGRATIONS.md` §Data Agents |
| **Real-Time Intelligence** | Live dashboard spikes as the catalogue is explored | Demonstrates Eventstream → Eventhouse in action within 5 seconds | `docs/FABRIC_RTI_INTEGRATION.md` |
| **Open Mirroring** | Workflow DAG nodes flagged as `source: mirrored` | Shows external governance runbooks syncing into OneLake automatically | `docs/MIRRORING_SETUP.md` |

## Demo Flow (3–5 Minutes)

1. **Hook (0:00–0:15):** State the governance problem and introduce FabricAgent.
2. **Catalogue Tour (0:15–0:45):** Highlight GIAC badges, provenance, and filters.
3. **Data Agent Spotlight (0:45–1:30):** Natural language query with grounded response.
4. **RTI Dashboard (1:30–2:15):** Show telemetry spike; mention Eventstream/Eventhouse.
5. **Open Mirroring + Workflow (2:15–2:45):** Explain mirrored runbooks powering DAG.
6. **Impact & CTA (2:45–3:30):** Summarize metrics, reference architecture diagram, invite judges to live demo.

See `docs/DEMO_NARRATION.md` for line-by-line script and caption cues.

## Measured Impact (Latest Dry Run)

- **Telemetry:** 48 catalogue searches and 27 prompt opens recorded in <5 minutes; RTI dashboard refresh latency averaged 3.8 seconds.
- **Adoption Hotspots:** Top queries during rehearsal—“data governance,” “real-time Fabric,” “Power BI rollout.”
- **Mirrored Coverage:** 14 governance workflows flagged as mirrored from SharePoint and SQL sources (auto-refreshed hourly/daily).

## Architecture References

- `docs/FABRIC_INTEGRATIONS.md` includes a mermaid architecture diagram and submission checklist.
- `docs/FABRIC_RTI_INTEGRATION.md` documents Eventstream/Eventhouse configuration and KQL.
- `docs/MIRRORING_SETUP.md` captures the Open Mirroring playbook.

## How It Works (At a Glance)

- Frontend is a static React SPA delivered by Vite (deployed via Azure Static Web Apps).
- Data is hydrated from JSON bundles (`src/prompt-catalog.json`, `src/workforce_prompts.json`, `src/dag.json`).
- Data Agent and telemetry endpoints are injected via environment configuration (`docs/APP_SETTINGS.md` covers variables).
- Upstream automation lives in a private workspace; this repo ships the SPA plus documentation for connecting to live Fabric services when desired.

## Value for Teams

- Standardizes governed prompts so analysts and developers start from verified guidance.
- Adds real-time visibility into what the organization is asking for via Fabric RTI.
- Keeps governance content evergreen through Open Mirroring—no manual exports.
- Bridges human and AI workflows with the DAG view and narration-ready documentation.

## What’s Not in Scope (This Repo)

- Not a general-purpose chatbot; it’s a prompt explorer and library.
- Does not connect to your tenant data or require Fabric capacity to run locally.
- Does not include the upstream ingestion/summary pipeline; only the curated results.

## Getting Started

1) Prereqs: Node.js 20 LTS and npm.
2) Install: `npm ci` (from `src/`).
3) Dev: `npm run dev` then open `http://localhost:5173/`.
4) Build: `npm run build` then `npm run preview`.
See `README.md` for deployment details and repo variables.

## Governance and Contributions

- Prompts are structured objects with IDs, descriptions, and tags to ensure auditability.
- Contributions follow a lightweight PR flow with validation checks; see `CONTRIBUTING.md` and `SECURITY.md`.

## Open Issues & Risks

- Pilot and adoption plan: Define owners, timeline, and success criteria for rollout.
- Maintainer/reviewer policy: Clarify human review standards beyond automated checks.
- Safety and quality ops: Establish periodic audits and incident handling.
- Environment integration: Document steps for hosting and change management in enterprise contexts.
- Data governance: Confirm data handling, retention, and compliance requirements for any future ingestion.

## Demo & Resources

- **Video Demo:** [3-5 min walkthrough](https://youtu.be/YOUR_VIDEO_ID)
- **Live Demo:** [fabricprompts.com](https://fabricprompts.com)
- **GitHub Repo:** [fabricagent-fabcon2025](https://github.com/YOUR_USERNAME/fabricagent-fabcon2025)
- **Devpost Submission:** [Link after submission](https://devpost.com/software/fabricagent)
