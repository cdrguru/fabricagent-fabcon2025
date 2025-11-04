# GIAC Doc Mappings Bundle

This bundle contains the complete documentation mapping for the Guy in a Cube (GIAC) prompt catalog, recording exactly which local knowledge base documents were cross-referenced for each prompt.

## Purpose & Layout

This mapping bundle enables:
- **Portability**: Move GIAC prompts to other repositories with doc references intact
- **Audit Trail**: Track which knowledge base files influenced each prompt
- **Re-hydration**: Reconstruct `links.docs` arrays when paths change
- **Coverage Analysis**: Understand documentation coverage across categories

## Bundle Contents

```
doc_mappings/
├── DOC_MAPPINGS.json           # Category → documents mapping (canonical)
├── mappings_by_prompt.json     # Prompt-level doc mappings with confidence
├── manifest.csv                # Flattened view for spreadsheet analysis
├── checksums.sha256            # SHA256 hashes for integrity verification
├── _README.md                  # This documentation
└── _EXPORT.sh                  # Export script for bundle creation
```

## How to Import into Fabric Agent Pub

### 1. Copy Bundle
```bash
# Copy the entire doc_mappings folder to target repo
cp -r doc_mappings/ /path/to/fabric-agent-pub/

# Or extract from zip
unzip doc_mappings_export.zip -d /path/to/fabric-agent-pub/
```

### 2. Re-hydrate links.docs (if paths change)
```bash
# Update paths in DOC_MAPPINGS.json first, then:
python3 -c "
import json

# Load mappings and update prompt links.docs
with open('doc_mappings/mappings_by_prompt.json', 'r') as f:
    mappings = json.load(f)

with open('prompts/guyincube.json', 'r') as f:
    prompts = json.load(f)

# Create mapping dict
mapping_dict = {m['id']: m['docs'] for m in mappings}

# Update prompts
for prompt in prompts:
    if prompt['id'] in mapping_dict:
        docs = [d['path'] for d in mapping_dict[prompt['id']] if d['confidence'] > 0.0]
        if docs:
            if 'links' not in prompt:
                prompt['links'] = {}
            prompt['links']['docs'] = docs

# Write updated prompts
with open('prompts/guyincube.json', 'w') as f:
    json.dump(prompts, f, indent=2, ensure_ascii=False)
"
```

### 3. Verify Integrity
```bash
# Check file integrity
sha256sum --quiet --check doc_mappings/checksums.sha256

# Validate JSON files
jq -e . doc_mappings/DOC_MAPPINGS.json >/dev/null
jq -e . doc_mappings/mappings_by_prompt.json >/dev/null
```

## jq Examples for Coverage Audit

```bash
# Count prompts by category with doc coverage
jq -r '.[] | [.category, (.docs | length)] | @csv' doc_mappings/mappings_by_prompt.json

# List all unique document paths
jq -r '.[].docs[].path' doc_mappings/mappings_by_prompt.json | sort -u

# Find prompts with missing docs (confidence = 0.0)
jq '.[] | select(.docs[] | .confidence == 0.0) | .id' doc_mappings/mappings_by_prompt.json

# Get category coverage summary
jq -r 'group_by(.category) | .[] | [.[0].category, length] | @csv' doc_mappings/mappings_by_prompt.json

# List docs by match reason
jq -r '.[].docs[] | [.match_reason, .path] | @csv' doc_mappings/mappings_by_prompt.json | sort
```

## Category Mappings

| Category | Documents | Count |
|----------|-----------|-------|
| `power-query-folding` | guide_to_power_query_folding.md, powerquery_library_output.json, CheetSheet_MicrosoftFabricNotebooks_PowerQuery_vs_PythonPandas_Operations.md | 3 |
| `dax-modeling` | BestPracticesForWritingEfficientDAXFormulas_LISTOFRESOURCES.json, dax_library.json | 2 |
| `fabric-architecture` | microsoft_power_query_custom_connectors_list_dictionary_referencedoc.json | 1 |
| `powerbi-visualization` | powerbi_report_design_best_practices.md, bestpractices_powerbithemes.md | 2 |
| `governance` | row_level_security_vs_powerbi_audiences_dictionary_list_lib.json | 1 |
| `performance` | BestPracticesForWritingEfficientDAXFormulas_LISTOFRESOURCES.json | 1 |

## Missing Files

No missing files detected in current repository.

## Export Instructions

To create a portable bundle:

```bash
# Run the export script
bash doc_mappings/_EXPORT.sh

# Or manually create zip
zip -r doc_mappings_export.zip doc_mappings/ -x "*/__pycache__/*"
```

## Integrity & Provenance

- **Source**: Guy in a Cube (GIAC) prompt catalog
- **Generated**: Automated mapping based on category classification and content analysis
- **Confidence**: All mappings have confidence = 1.0 (high confidence category-based matching)
- **Checksums**: SHA256 hashes provided for all referenced documents
- **Semantic Preservation**: No GIAC prompt content was modified during mapping generation

This bundle maintains complete traceability between GIAC prompts and their supporting documentation while enabling flexible deployment across different repository structures.
