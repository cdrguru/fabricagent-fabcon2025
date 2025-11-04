# FabricAgent Reproduction Playbook

This guide walks FabCon judges and reviewers through reproducing the FabricAgent experience locally or in their own Fabric workspace. It covers environment setup, demo-safe mode, and validation checks so every integration can be verified quickly.

## 1. Clone & Install

```bash
git clone https://github.com/fabricagent/FabricAgent.git
cd FabricAgent
make install      # runs npm ci inside src/
```

Node 20.x and npm 10.x are required; see `src/package.json` for the supported versions. If you are using Codespaces or GitHub Codespaces, the provided `.devcontainer` image already matches this toolchain.

## 2. Choose Your Mode

FabricAgent supports two execution modes:

| Mode | How | When to use | Notes |
| --- | --- | --- | --- |
| **Demo Safe Mode** | `VITE_USE_MOCK_SERVICES=true` | Reproduce the 3–5 minute recorded demo with zero external dependencies | Uses curated mock services for Fabric Data Agents and RTI |
| **Live Fabric Mode** | Leave the flag unset and provide real Fabric endpoints | Validate end-to-end Fabric integrations in your workspace | Requires Data Agent + Eventstream/Eventhouse resources |

Create `src/.env.local` with one of the following templates:

```bash
# Demo Safe Mode (recommended starting point)
VITE_USE_MOCK_SERVICES=true

# Optional analytics/help overrides
# VITE_ANALYTICS_KEY=
# VITE_HELP_CENTER_URL=
```

```bash
# Live Fabric mode
VITE_FABRIC_DATA_AGENT_ENDPOINT="https://<your-workspace>.fabric.microsoft.com/dataagent/<id>"
VITE_FABRIC_EVENTSTREAM_ENDPOINT="https://<your-region>.eventstream.fabric.microsoft.com/ingest"
VITE_FABRIC_EVENTHOUSE_ENDPOINT="https://<your-region>.eventhouse.fabric.microsoft.com/query"
VITE_USE_MOCK_SERVICES=false
```

See `docs/APP_SETTINGS.md` for the full list of environment variables.

## 3. Start the Application

```bash
make dev
# or npm run dev from src/
```

Navigate to `http://localhost:5173`. Upon load you should see:

- The curated prompt catalogue with search, filter, and favorites
- Fabric Data Agent chat panel (left) with mock or live responses
- RTI dashboard (right) with top searches, most opened prompts, and recent activity

## 4. Verify Mock Mode Behaviour

With `VITE_USE_MOCK_SERVICES=true`, confirm:

1. **Conversation:** Ask “real-time data engineering” → Data Agent returns three highlighted prompts with `confidence: high`.
2. **Suggestions:** Follow-up buttons appear (e.g., “Which prompts use Python notebooks?”).
3. **RTI Metrics:** Searching or opening prompts updates the dashboard within ~5 seconds.

These behaviours rely on:

- `src/hooks/useDataAgent.ts` for conversational state management.
- `src/components/chat/DataAgentChat.tsx` for the UI.
- `src/components/sections/RTIDashboard.tsx` for real-time telemetry display.
- `src/services/ServiceFactory.ts` to select mock vs. live implementations.

## 5. Wire Up Live Fabric (Optional)

If you want to validate the Fabric workspace integrations:

1. **Data Agent:** Follow `docs/FABRIC_INTEGRATIONS.md` and the guidance in `docs/UPSTREAM_PIPELINE.md` to publish the prompt catalog into OneLake and register it with a Fabric Data Agent. Update the `.env.local` endpoint accordingly.
2. **Real-Time Intelligence:** Use `docs/FABRIC_RTI_INTEGRATION.md` to configure Eventstream → Eventhouse pipelines and Power BI visuals. Replace the Eventstream/Eventhouse URLs in `.env.local`.
3. **Open Mirroring:** `docs/MIRRORING_SETUP.md` documents the mirrored governance datasets referenced in the workflow DAG (`src/dag.json` nodes with `"source": "mirrored"`).

Restart the dev server after updating environment variables.

## 6. Run Validation Scripts

Before recording or submitting, execute the guardrail scripts from the repo root:

```bash
./verify_fabricagent.sh
./validate_publication_readiness.sh
```

Both scripts should exit with status `0`. They lint the dataset exports, confirm mock/live services compile, and ensure documentation links resolve.

## 7. Demo Checklist

- Fabric services explicitly referenced: Data Agents, Eventstream/Eventhouse (RTI), Open Mirroring.
- Data Agent chat and RTI dashboard visible within the same catalogue view.
- Help center (`src/public/help/index.html`) links to `docs/FABRIC_INTEGRATIONS.md` and this reproduction playbook.
- README includes the unlisted 3–5 minute video link once recorded.

## 8. Troubleshooting

- **No chat responses:** Verify `VITE_USE_MOCK_SERVICES` or Fabric endpoint settings. Check console logs for `[ServiceFactory]` messages.
- **RTI dashboard not updating:** Ensure telemetry events are emitted by searching or opening prompts. In live mode, inspect Eventstream diagnostics.
- **Build failures:** Run `npm ci` inside `src/` to refresh node modules. Confirm Node 20.x is active (`node -v`).
- **Doc alignment:** Update `conversation.compact.md` with any changes to demo narrative or risk mitigations.

With these steps you can reproduce the end-to-end experience judges see in the official demo, validate Fabric integrations, and explore extensions in your own environment.
