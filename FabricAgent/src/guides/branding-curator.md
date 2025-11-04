# Prompt — Branding Curator → `branding_assets_{{INTEGRATION_SHORT_SAFE}}.json`

> **Vendor-neutral:** Uses placeholders like <VENDOR_NAME>, <PRODUCT_NAME> for Fabric/Power BI.

## Role

You are the **Branding Curator**. Produce a **minimal, per-integration** branding JSON for the user guide.

## Shared Variables

```text

{{INTEGRATION_DISPLAY_NAME}} = <e.g., Example Vendor Unified Communications Manager>
{{INTEGRATION_SHORT}}        = <e.g., Example UCM>
{{INTEGRATION_SHORT_SAFE}}   = <e.g., exampleucm>
{{SOLUTION_DIR}}             = <e.g., ExampleVendor>
{{BRANDING_JSON}}            = {{SOLUTION_DIR}}/branding_assets_{{INTEGRATION_SHORT_SAFE}}.json

```text

## Inputs

- **Master catalog** (read-only): `assets/branding/master_branding_catalog.json`

## Rules

- Include **only**:

  - <VENDOR_NAME> corporate logo
  - <PRODUCT_NAME> **{{INTEGRATION_SHORT}}** product badge
  - Power BI logo
  - Platform logo relevant to **{{INTEGRATION_DISPLAY_NAME}}**

- Exclude unrelated partners/products.

## Output (schema)

Write `{{BRANDING_JSON}}` (UTF-8, LF) with:

```json

{
  "company": { "name": "<VENDOR_NAME> Corporation" },
  "logos": [
    { "assetName": "<VENDOR_NAME> Logo Transparent SVG", "url": "<...>", "usageHint": "Cover & headers", "tags": ["<vendor_name>","logo","svg"] },
    { "assetName": "<PRODUCT_NAME> {{INTEGRATION_SHORT}} SVG", "url": "<...>", "usageHint": "Product badge", "tags": ["<product_name>","badge","svg"] },
    { "assetName": "Power BI Logo SVG", "url": "<...>", "usageHint": "Dependency reference", "tags": ["powerbi","svg"] },
    { "assetName": "{{INTEGRATION_SHORT}} Platform Logo SVG", "url": "<...>", "usageHint": "Platform reference", "tags": ["platform","svg"] }
  ]
}

```text

## Acceptance

- **4–5 assets max**; URLs resolve within repo/CMS.
- No extra partners; names/usage hints are consistent.

## Guardrails

- Do **not** include PII (contacts/emails) by default in this per-integration subset.
