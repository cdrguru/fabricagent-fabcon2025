# Prompt Sequence — Vendor Neutral

This sequence produces an accurate, publishable user guide for each discovered Report + SemanticModel
pair in a Fabric/Power BI repository. It is agnostic to any vendor or product branding.

---

## Repository discovery

Given a repository root `{{REPO_ROOT}}`:

- Reports: `reports/<ReportName>.Report/definition.json`
- Semantic models: `semantic_models/<ModelName>.SemanticModel/definition/**/*.tmdl`
- Optional assets: place any guide outputs next to the report by default, or in `docs/guides/` if preferred.

Agent must support one or many integrations:

- If multiple reports are present, run the sequence independently per report.
- Match a semantic model by name proximity to the report name. If multiple candidates exist,
  pick the model whose measures/columns are most referenced by the report.

---

## Shared variables (set per report-model pair)

```bash
{{REPO_ROOT}}=.
{{REPORT_DIR}}=reports/<ReportName>.Report
{{MODEL_DIR}}=semantic_models/<ModelName>.SemanticModel
{{OUTPUT_DIR}}={{REPORT_DIR}}     # fallback: docs/guides
{{USER_GUIDE_BASENAME}}="User Guide_ <Solution> <Product>"
{{USER_GUIDE_PATH}}={{OUTPUT_DIR}}/{{USER_GUIDE_BASENAME}}_v1.1.md
{{CAPTIONS_TMDL}}={{MODEL_DIR}}/definition/cultures/en-US.tmdl  # optional
```

Notes

- Use exact repo-relative paths. Do not access external sources.
- Prefer `.pbip`/TMDL assets; never modify or add `.pbix`.

---

## Prompt 1 — Report Inventory Agent -> page\_visual\_helper.txt

Role

- Extract a lossless map of pages, visuals, and bindings from the report definition.

Inputs

- `{{REPORT_DIR}}/definition.json`
- Optional: `{{CAPTIONS_TMDL}}` for localized captions

Tasks

1. Enumerate pages in display order.
2. For each visual, capture:

   - `VisualName`, `VisualType`
   - For each binding role (Axis, Legend, Values, Tooltip, Group, Filters): `Table`, `FieldOrMeasure`
   - Extras: drillthrough targets, tooltip page, bookmark id/name if present.
3. Resolve captions from cultures when available; otherwise keep technical names. Do not invent names.

Output

- `{{OUTPUT_DIR}}/page_visual_helper.txt` (UTF-8, pipe-delimited)
- Header: `Page | VisualName | VisualType | Table | FieldOrMeasure | BindingRole | Extra`

Acceptance

- Every page/visual in the report appears at least once.
- Visuals without bound fields include one row with `FieldOrMeasure=None` and `BindingRole=None`.

---

## Prompt 2 — Semantic Dictionary Agent -> data-dictionary.txt

Role

- Produce a canonical dictionary of tables, columns, and measures.

Inputs

- `{{MODEL_DIR}}/definition/**/*.tmdl`
- Optional: `{{CAPTIONS_TMDL}}`

Tasks

1. Emit one row per table, column, and measure using captions (cultures first, else technical).
2. Include data types and format strings; for measures include full DAX when present.
3. Add unit guidance in `Notes` (e.g., durations, conversions, display formats).

Output

- `{{OUTPUT_DIR}}/data-dictionary.txt` (UTF-8, pipe-delimited)
- Header: `EntityType | Table | Name | DataTypeOrReturn | Format | Description | Notes`

Acceptance

- 100 percent of measures included.
- Names match localized captions where available.
- Duration unit notes present where applicable.

---

## Prompt 3 — DAX Hygiene Agent -> dax\_updates.csv (optional)

Role

- Suggest safe, minimal naming/logic cleanups for KPIs.

Inputs

- Measures from `{{MODEL_DIR}}/definition/**/*.tmdl`
- `{{OUTPUT_DIR}}/data-dictionary.txt`

Tasks

1. Detect duplicate or near-duplicate KPI names; flag unit mismatches; normalize inconsistent prefixes/suffixes.
2. Propose new names only when unambiguous; never change business meaning.
3. Provide logic changes only when a concrete defect is found (cite the original).

Output

- `{{OUTPUT_DIR}}/dax_updates.csv`
- Header: `measure_name,current_name,proposed_name,change_type,reason,proposed_dax`

Acceptance

- No name collisions; logic changes backed by evidence.

---

## Prompt 4 — Dimension Metadata Agent -> dimMetadata-template.csv

Role

- Generate a template covering dimension/lookup columns for glossary and lineage.

Inputs

- `{{MODEL_DIR}}/definition/tables/*.tmdl`

Tasks

1. Identify dimension-like tables (prefix `dim*`, small-cardinality lookups, or 1-side of relationships).
2. List columns with data types; mark keys; add relationship hints when discoverable.

Output

- `{{OUTPUT_DIR}}/dimMetadata-template.csv`
- Header: `table,column,data_type,is_key,relationship_hint,description`

Acceptance

- Includes `dim*`/lookup tables; excludes facts except for relationships. No invented descriptions.

---

## Prompt 5 — Semantic Guide Writer -> semantic\_guide.md

Role

- Write a concise semantic guide covering subject areas, grain, key tables, and core KPIs using exact names.

Inputs

- `{{OUTPUT_DIR}}/page_visual_helper.txt`
- `{{OUTPUT_DIR}}/data-dictionary.txt`
- Optional: `{{OUTPUT_DIR}}/dax_updates.csv`
- `{{MODEL_DIR}}` TMDL

Tasks

1. Summarize the model: areas, grains, core relationships.
2. Map personas to pages using the inventory.
3. Describe KPIs and units using exact measure names; apply `dax_updates` where present.

Output

- `{{OUTPUT_DIR}}/semantic_guide.md`

Acceptance

- Every KPI mentioned exists in the dictionary; persona/page references exist in the inventory.

---

## Prompt 6 — Final Guide Writer -> v1.1 user guide

Role

- BI documentation specialist. Produce a publish-ready user guide that precisely reflects the actual report.

Inputs (precedence)

1. `{{OUTPUT_DIR}}/page_visual_helper.txt`
2. `{{OUTPUT_DIR}}/data-dictionary.txt`
3. `{{OUTPUT_DIR}}/dax_updates.csv` (optional)
4. `{{OUTPUT_DIR}}/dimMetadata-template.csv`
5. `{{OUTPUT_DIR}}/semantic_guide.md` (optional)

Objective

- Write `{{USER_GUIDE_PATH}}`. Lock naming and units. Describe only what exists.

Constraints

- No invented visuals, data, or formulas.
- Use exact names from inputs; apply `dax_updates` overrides.
- Units explicit and consistent (e.g., seconds vs HH\:MM\:SS).
- If a Microsoft-only feature is not present in the report, list it in an appendix as Not Implemented with a short rationale.

Method (condensed)

1. If a v1 scaffold exists, collect `[Placeholder: ...]` markers into a Gap Log; else scaffold.
2. Align TOC to page order in the report; enumerate visuals per page.
3. Crosswalk appendix: page/visual/field inventory.
4. Glossary appendix: every referenced metric with one-line definitions from the dictionary.
5. Not Implemented appendix: list unsupported features detected during inventory.
6. Versioning: set Version=1.1 and Last Updated=YYYY-MM-DD; add a concise change log.

Acceptance checklist

- Zero placeholders in the main body.
- Inventory and crosswalk cover every item from the inventory file.
- All metric names match the dictionary after `dax_updates`.
- Units consistent and explicit; pages present in correct order.
- Version, Last Updated, and change log present; no PII or secrets.

---

## Orchestration

Role

- Automation copilot for docs generation and CI validation.

Plan

1. Discover report directories; for each, select the best-matching semantic model.
2. Verify presence and non-empty: `page_visual_helper.txt`, `data-dictionary.txt`, `dimMetadata-template.csv`.
3. If `dax_updates.csv` exists, check for collisions and uniqueness of proposed names.
4. Run Final Guide Writer to produce `{{USER_GUIDE_PATH}}` per report.
5. Commit on a feature branch and open a PR; ensure CI validations pass.

CI acceptance

- Schema and safety validations pass.
- No `.pbix` is added; only `.pbip`/TMDL and docs.

---

## How to use

1. Place the MD in `prompts/guides/user-guide-sequence_generic.md` and the JSON alongside it.
2. Run your agent orchestration over the repo. It should iterate reports under `reports/*.Report`
   and pair each with a semantic model under `semantic_models/*.SemanticModel`.
3. Guides will be written next to each report by default; switch `{{OUTPUT_DIR}}` to `docs/guides`
   if you prefer a centralized location.

## Key risks

- Name pairing between reports and models can be ambiguous. Resolve using reported bindings and measure references.
- Localized captions may be missing; fall back to technical names without inventing display text.
- Repos with mixed structures may require a small adapter in discovery to surface the correct pairs.
