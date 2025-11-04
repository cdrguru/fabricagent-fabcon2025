# Fabric Agent — Assistant Guide

This guide is the minimal, high‑signal context for working on this repository with AI coding assistants (Codex, Copilot, Gemini). It focuses on what you need to read first and the exact commands to run.

## Quick Facts

- Language/Framework: TypeScript + React (Vite)
- App package: `src/package.json:1`
- Build tool: `vite.config.ts:1`
- Entrypoints: `src/index.tsx:1`, `src/App.tsx:1`
- Inventory: `.reports/INVENTORY.jsonl:1` (regenerate via Make target below)

## Read These First

- Project overview: `README.md:1`, `Executive_Briefing.md:1`
- Frontend core: `src/App.tsx:1`, `src/index.tsx:1`, `src/config.ts:1`
- Data sources: `src/comprehensive_giac_catalog.json:1`, `src/data/refined_giac_prompts.jsonl:1`, `src/public/dag_full.json:1`
- Services/hooks: `src/services/promptService.ts:1`, `src/hooks/useData.ts:1`
- Inventory tooling: `scripts/inventory/README.md:1`, `scripts/inventory/generate_inventory.py:1`
- Validation: `scripts/validate_fabric_agent.py:1`, `scripts/comprehensive_validation.py:1`, `verify_fabricagent.sh:1`

## Common Commands (Make targets)

- Install deps: `make install`
- Run dev server: `make dev`
- Build production: `make build`
- Preview build: `make preview`
- Regenerate inventory: `make inventory`
- Run validations: `make validate` or `make verify`
- Codex one-shot setup: `make codex-setup`

## How Codex Should Work Here

- Keep changes small and targeted; propose diffs that reference exact files (e.g., `src/App.tsx:1`).
- Prefer updating existing patterns; do not introduce new frameworks or build tools.
- For repo mapping, rely on `.reports/INVENTORY.jsonl` and regenerate with `make inventory` when files change.
- Respect `.gitignore` (this repo ignores `.reports/` and several internal folders). Avoid committing generated artifacts.

## Local Development

1) Install Node deps: `make install`
2) Run dev server: `make dev`
3) Open the app URL printed by Vite (default <http://localhost:5173>)

## Notes

- The web app lives under `src/` (the `package.json:1` is in `src/`). Use `npm -C src ...` or the Make targets.
- Validation scripts in `scripts/` provide deeper repo checks if needed.
