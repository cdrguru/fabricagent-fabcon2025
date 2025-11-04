.PHONY: help install dev build preview inventory validate verify clean userguide userguide-sample userguide-ci-validate api codex-setup codex-maintenance

help:
	@echo "Fabric Agent Makefile"
	@echo "Targets:"
	@echo "  install    Install web app dependencies (under src/)"
	@echo "  dev        Run Vite dev server"
	@echo "  build      Build production bundle"
	@echo "  preview    Preview the production build"
	@echo "  inventory  Generate .reports/INVENTORY.jsonl"
	@echo "  validate   Run Python validation script(s)"
	@echo "  verify     Run repo verification script"
	@echo "  userguide  Run user-guide automation pipeline"
	@echo "  userguide-sample  Run pipeline on sample fixtures"
	@echo "  userguide-ci-validate  Validate CI-friendly automation run"
	@echo "  api        Run HTTP API server for automation"
	@echo "  rewrite-proxy  Run local Azure OpenAI rewrite proxy on :8787"
	@echo "  serve       Run local server for dist + /api/rewrite (uses AZURE_* env)"
	@echo "  codex-setup  Run Codex install + build script"
	@echo "  codex-maintenance  Run Codex maintenance (cached deps health check)"
	@echo "  clean      Remove generated inventory"

install:
	@npm -C src ci

dev:
	@npm -C src run dev

build:
	@npm -C src run build

preview:
	@npm -C src run preview

codex-setup:
	@bash codex/setup.sh

codex-maintenance:
	@bash codex/maintenance.sh

inventory:
	@mkdir -p .reports
	@python3 -c "from scripts.inventory.generate_inventory import generate_inventory; generate_inventory('.reports/INVENTORY.jsonl')"
	@echo "Wrote .reports/INVENTORY.jsonl"

validate:
	@python3 scripts/validate_fabric_agent.py || true

verify:
	@bash ./verify_fabricagent.sh || true

userguide:
	@python3 -m scripts.user_guide_automation.cli --repo .

userguide-sample:
	@python3 -m scripts.user_guide_automation.cli --repo tests/fixtures/fabric_repo_sample

userguide-ci-validate:
	@python3 -m scripts.user_guide_automation.ci_validate

api:
	@python3 -m scripts.user_guide_automation.api

rewrite-proxy:
	@node scripts/rewrite-proxy.mjs

serve:
	@node scripts/server.mjs

ingest:
	@node scripts/ingest/ingest_azure_search.mjs

ingest.dryrun:
	@DRY_RUN=1 node scripts/ingest/ingest_azure_search.mjs

query:
	@node scripts/ingest/query_azure_search.mjs "$(q)" "$(k)" $(opts)

index.create:
	@node scripts/ingest/create_search_index.mjs "$(schema)"

convert.payload:
	@node scripts/ingest/convert_search_response_to_upsert.mjs "$(in)" "$(out)" --action=$(action)

convert.post:
	@node scripts/ingest/convert_search_response_to_upsert.mjs "$(in)" --action=$(action) --post --index=$(index)

clean:
	@rm -f .reports/INVENTORY.jsonl
