# Demo Narration & Caption Script

This script guides the 3–5 minute FabCon demo video and provides caption text aligned with the four judging pillars. Italicized text represents recommended on-screen captions.

## 0:00–0:15 — Hook (Problem Statement)

- **Narration:** “Fabric teams juggle dozens of prompts with no governance—FabricAgent fixes that by centralizing curated, Fabric-native prompts.”
- *Caption:* “Problem: Prompt sprawl slows Fabric teams.”

## 0:15–0:45 — Overview & Navigation

- **Narration:** “FabricAgent is a React app backed by Microsoft Fabric. We organize 110 prompts by source, pillar, and provenance.”
- Highlight catalogue filters, GIAC badge, and YouTube link.
- *Caption:* “Catalogue: 110 prompts • GIAC provenance.”

## 0:45–1:30 — AI Features (Data Agents)

- **Narration:** “Let’s ask Fabric’s Data Agent: ‘Show prompts for real-time data engineering.’ Fabric returns grounded answers with provenance.”
- Follow-up query: “Filter to Power BI governance.”
- Point out prompt titles, tags, and GIAC icons in the response.
- *Caption:* “AI Features: Microsoft Fabric Data Agent.”

## 1:30–2:15 — Real-Time Intelligence

- Trigger searches and open prompt cards to generate telemetry.
- **Narration:** “Every interaction streams through Fabric Eventstream into Eventhouse. Watch the dashboard refresh in under five seconds.”
- Show RTI panel or Power BI visual.
- *Caption:* “RTI: Eventstream ➜ Eventhouse ➜ Live dashboard.”

## 2:15–2:45 — Open Mirroring + Workflow

- **Narration:** “Governance runbooks mirror into OneLake automatically. Mirrored nodes feed our workflow DAG so teams execute the latest playbooks.”
- Highlight DAG nodes tagged as mirrored.
- *Caption:* “Open Mirroring: External runbooks stay current.”

## 2:45–3:30 — Impact & Innovation

- **Narration:** “FabricAgent standardizes prompts, delivers real-time insight, and keeps governance evergreen. Teams spend less time searching and more time shipping.”
- Call out architecture diagram (`docs/FABRIC_INTEGRATIONS.md`) briefly.
- *Caption:* “Innovation: Governance-first Fabric workspace.”

## 3:30–3:45 — Call to Action

- **Narration:** “Explore the live demo at fabricprompts.com. The repo includes full setup guides so you can reproduce every Fabric integration.”
- *Caption:* “Live Demo + Docs: fabricprompts.com.”

## Caption Export Notes

- Burn-in captions should appear slightly below lower-third callouts.
- Keep caption line length under 42 characters; split long phrases.
- Highlight Fabric services (Data Agents, Eventstream, Eventhouse, Open Mirroring) exactly as named to reinforce judging criteria.

## Rehearsal Checklist

- [ ] Validate Data Agent endpoints before recording.
- [ ] Run the synthetic telemetry helper described in `docs/FABRIC_RTI_INTEGRATION.md` to pre-seed RTI charts if needed.
- [ ] Open mirroring status page to confirm latest refresh succeeded.
- [ ] Keep `FabricAgent/docs/FABRIC_INTEGRATIONS.md` open for quick reference during Q&A.
