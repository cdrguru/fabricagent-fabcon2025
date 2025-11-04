# Power BI Prompt Catalog

## Overview
This directory contains the canonical prompt catalog for Power BI and Microsoft Fabric operations.

## Structure
- `prompt-catalog.json` - Canonical catalog (single source of truth)
- `archive/` - Backup files and migration history
- `README.md` - This file

## Schema
Each prompt must have these required fields:
- `id` (string) - Unique identifier
- `version` (string) - Semantic version
- `name` (string) - Display name
- `persona` (string) - Role or character
- `description` (string) - Purpose description
- `tags` (array) - Classification tags
- `system` (string) - System prompt
- `user_template` (string) - User message template

Optional fields: `few_shots`, `safety`, `categories`

## Validation Commands
```bash
# JSON parse check
python -m json.tool prompts/powerbi/prompt-catalog.json >/dev/null

# Schema check (requires jq)
jq -e 'all(.[]; has("id") and has("version") and has("name") and has("persona") and has("description") and has("tags") and has("system") and has("user_template"))' prompts/powerbi/prompt-catalog.json

# Vendor neutrality check
git grep -nEi 'Cisco|Avaya|Webex|Zoom|Teams|Univerge|Metropolis|Expo\s*XT' -- prompts/powerbi/prompt-catalog.json || echo "OK: vendor-neutral"

# No secrets check
! grep -RniE '\.pbix|password|secret|token|key=' prompts/powerbi/prompt-catalog.json
```

## Cleanup Script
Run `scripts/cleanup_prompts.py` to re-apply normalization, deduplication, and vendor neutralization.

Last updated: 2025-09-05 20:40:07
Total prompts: 72
