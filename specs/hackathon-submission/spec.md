# Feature: FabCon 2025 Hackathon Submission

## Problem

Fabric and Power BI teams are overwhelmed by unchecked prompt sprawl—valuable Copilot prompts live in scattered chats, wikis, and transcripts, making it hard to find trusted guidance quickly. Without governance, teams waste time rediscovering prompts, and leaders lack visibility into which guidance is being used. FabricAgent must present a curated, governed catalog that pairs every prompt with provenance, workflow assistance, and clear Fabric integration touchpoints so judges see tangible value.

## User Stories

- As a data engineer, I want to search conversationally for “real-time data engineering prompts” and refine the results so I can reach trusted, Fabric-ready guidance without combing through docs.
- As a team lead, I want a real-time dashboard of top searches and prompt usage so I can double down on the topics my organization needs most.
- As a governance officer, I want mirrored prompts labeled with source provenance so I know which assets are grounded in verified repositories like SharePoint or Guy in a Cube.
- As a FabCon judge, I want reproducible documentation and scripts so I can validate the AI, RTI, and mirroring integrations in my own workspace.

## Requirements

### Functional

- Provide a fast catalog UI with search, filters, GIAC badges, and prompt cards backed by curated JSON datasets.
- Offer Workforce Agent launchers and a conversational chat panel that returns grounded recommendations from the prompt catalog via Microsoft Fabric Data Agents or their mock equivalent.
- Emit usage telemetry for searches, opens, and workflow interactions, feeding a Real-Time Intelligence dashboard that refreshes within five seconds.
- Surface mirrored content indicators in catalog listings and DAG nodes, showing which assets originate from Open Mirroring pipelines curated by the upstream pipeline.

### Non-Functional

- Enforce strict TypeScript (no `any`, React 18 + Vite) and keep initial page load under two seconds in demo mode.
- Maintain demo-safe mock services toggled by `VITE_USE_MOCK_SERVICES` to guarantee a reliable recording when Fabric endpoints are unavailable.
- Ship documentation that cross-links README, Executive Briefing, integration guides, and validation scripts; all verification scripts (`verify_fabricagent.sh`, `validate_publication_readiness.sh`) must pass on Node 20.
- Keep repository structure focused on the FabricAgent app and supporting docs, free of reference-only clutter that could confuse judges.

### Competition-Specific

- Highlight Microsoft Fabric Data Agents, Eventstream/Eventhouse RTI, and Open Mirroring explicitly in UI, narration, and documentation.
- Deliver a 3–5 minute demo video following the agreed script (hook → catalog → Data Agent → RTI → mirroring → impact) with clear callouts of Fabric services.
- Ensure reproducibility by documenting mock vs. live Fabric setups, environment variables, and mirroring pipelines so judges can follow the playbook.
- Prepare fallback plans (demo safe mode, synthetic telemetry) to protect Video Demo scoring if live Fabric services degrade during judging.

## Success Criteria

- **Category Alignment (25%)**: Judges see FabricAgent using Data Agents, RTI, and Open Mirroring in the demo and documentation, reinforced by architecture diagrams and narration.
- **Innovation & Impact (25%)**: The story quantifies prompt governance value (e.g., faster discovery, telemetry insights) and showcases workforce workflows plus mirrored content.
- **Documentation & Reproducibility (25%)**: README, Executive Briefing, integration guides, and verification scripts stay current; spec-kit artifacts trace requirements to implementation.
- **Video Demonstration (25%)**: Final 3–5 minute video runs smoothly in demo-safe mode, includes captions or overlays for Fabric features, and links in README and Devpost alongside the live demo URL.
