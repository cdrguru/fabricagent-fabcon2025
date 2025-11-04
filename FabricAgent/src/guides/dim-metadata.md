# Prompt — Dim Metadata Agent → `dimMetadata-template.csv`

## Role

You are the **Dim Metadata Agent**. Generate a concise template describing **dimension/lookup columns**
and relationship hints for glossary/lineage.

## Shared Variables

```text

{{MODEL_DIR}}  = <solution/*.SemanticModel>
{{OUTPUT_DIR}} = <solution/*.Report>

```text

## Scope

- Read tables under `{{MODEL_DIR}}/definition/tables/*.tmdl`

## Tasks

1) Identify **dimension-like** tables:
   - Prefix `dim*` or common lookups (e.g., `d*`)
   - On the **1-side** of relationships (when discoverable in `relationships.tmdl`)
2) For each selected table, list **columns** with:
   - `data_type`, `is_key` (when modeled), and brief `relationship_hint` (e.g., `joins fExampleCDR on DeviceKey`)
3) Emit CSV with **exact header**:

```text

table,column,data_type,is_key,relationship_hint,description

```text

- Leave `description` **blank** unless present in model annotations.

## Output

- `{{OUTPUT_DIR}}/dimMetadata-template.csv` (UTF-8, LF)

## Acceptance

- All **dim*/lookup** tables included; facts are excluded except for relationship hints.
- No invented descriptions; only what the model provides.

## Guardrails

- Maintain exact table/column **casing and spacing**.
