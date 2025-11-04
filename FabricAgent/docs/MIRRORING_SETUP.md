# Open Mirroring Setup Guide

This guide documents the repeatable steps we use to mirror external knowledge sources into Microsoft Fabric OneLake so FabricAgent always surfaces current governance content. The operational pipeline that executes these steps lives outside this repository; the process below captures the configuration judges need to understand.

## Objectives

- Keep enterprise knowledge bases (SharePoint runbooks, Azure SQL inventories, etc.) synchronized with FabricAgent without manual exports.
- Preserve provenance by tagging mirrored records and propagating metadata into the frontend DAG and prompt catalog.

## Source Systems

| Source | Connector | Refresh Cadence | Target Table |
| --- | --- | --- | --- |
| SharePoint “Governance Wiki” library | Fabric SharePoint connector | Hourly | `OneLake.GovernanceWikiMirrored` |
| Azure SQL `FabricPlaybooks` database | SQL mirroring | Nightly | `OneLake.FabricPlaybooksMirrored` |

## Prerequisites

1. Fabric workspace with Open Mirroring enabled.
2. Credentials with read permission to each source system.
3. OneLake lakehouse named `FabricAgentLake`.

## Setup Workflow

1. **Create Mirrored Tables**
   - In Fabric, open the lakehouse and choose **Mirroring > New mirror**.
   - Select the connector that matches the source (SharePoint or SQL).
   - Map the source lists/tables to destination names listed above.

2. **Configure Schedules**
   - SharePoint: set refresh to hourly with retry count `3`.
   - Azure SQL: set refresh to daily at 02:00 local time.
   - Enable incremental refresh where supported to minimize load.

3. **Tag Metadata**
   - Add a calculated column `source_system` (value `sharepoint` or `sql`) and `last_refreshed` in the mirrored table using a Dataflow or notebook.
   - Expose the tags to downstream consumers.

4. **Propagate to Prompt Catalog**
   - Run the upstream curation pipeline (see `docs/UPSTREAM_PIPELINE.md`) with mirroring sync enabled.
   - The pipeline reads mirrored tables, generates prompt/workflow deltas, and writes to the curated artifacts consumed by FabricAgent (e.g., JSON files under `src/`).
   - Resulting JSON carries a `source: "mirrored"` flag consumed by the FabricAgent UI (`src/dag.json`).

5. **Validate**
   - Execute the mirroring validation routine described in `docs/VALIDATION.md` to confirm schema alignment.
   - In FabricAgent, open the Workflow tab and filter for mirrored nodes to ensure the UI reflects the new content.

## Maintenance

- Monitor Fabric refresh history for failures; configure alerts via Fabric notifications.
- Rotate source credentials monthly; document changes alongside your operational runbook.
- Purge or archive mirrored data older than 180 days to keep lakehouse storage manageable.

## Demo Narrative Cue

When demonstrating mirroring, call out: “These governance workflows refresh automatically through Microsoft Fabric Open Mirroring, so our catalog is always aligned with the latest enterprise checklists.”
