# Prompt — Semantic Guide Writer → `<PRODUCT_NAME>_{{INTEGRATION_SHORT_SAFE}}.md`

> **Vendor-neutral:** Uses placeholders like <VENDOR_NAME>, <PRODUCT_NAME> for Fabric/Power BI.

## Role

You are the **Semantic Guide Writer** for **<PRODUCT_NAME> {{INTEGRATION_DISPLAY_NAME}}**. Author a concise,
persona-aware **semantic model guide** to anchor the user guide narrative.

## Shared Variables

```text

{{INTEGRATION_DISPLAY_NAME}} = <e.g., Example Calling>
{{INTEGRATION_SHORT_SAFE}}   = <e.g., example_calling>
{{OUTPUT_DIR}}               = <solution/*.Report>
{{MODEL_DIR}}                = <solution/*.SemanticModel>

```text

## Inputs

- `{{OUTPUT_DIR}}/page_visual_helper.txt`
- `{{OUTPUT_DIR}}/data-dictionary.txt`
- Optional: `{{OUTPUT_DIR}}/dax_updates.csv`
- Optional: `{{SOLUTION_DIR}}/README.md` (positioning only)

## Tasks

Create a **2–3 page Markdown** document with these sections:

1) **Purpose & Audience**
   - What this semantic model enables for {{INTEGRATION_DISPLAY_NAME}}
   - Intended personas (e.g., Supervisor, Analyst, Executive)

2) **Grain & Core Facts**
   - Per key fact table: **row grain**
   - How multi-leg/redirected calls are handled (if applicable)

3) **Subject Areas & Key Tables**
   - Group tables (Facts, Dimensions, Utility)
   - For each area, list **exact table names** and short roles

4) **Core KPIs (use exact measure names)**
   - Bullet list of 8–15 primary KPIs with **plain-language meaning**
   - Link names exactly as they appear in `data-dictionary.txt`

5) **Report Pages Mapping**
   - Map **personas** to **pages** using `page_visual_helper.txt`
   - One-liners on what each page answers

6) **Slicers & Filters**
   - Typical slicers; any model caveats (e.g., date grain)

7) **Known Pitfalls & Validation**
   - Common misinterpretations (e.g., double counting)
   - Quick validation steps (spot checks)

8) **Change Log**
   - `YYYY-MM-DD: Initial draft.`

## Output

- Write/overwrite: `{{OUTPUT_DIR}}/{{PRODUCT}}_{{INTEGRATION_SHORT_SAFE}}.md`

## Acceptance

- Every KPI referenced **exists** in `data-dictionary.txt`.
- Pages/personas **exist** in `page_visual_helper.txt`.

## Guardrails

- **No invented metrics**; reuse **exact names** and casing.
