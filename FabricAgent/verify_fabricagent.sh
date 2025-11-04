#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

echo "[verify] Running verification checks in $ROOT_DIR"
FAIL=0

require_file() {
  local f="$1"; shift
  if [ ! -f "$f" ]; then echo "[verify][ERROR] Missing file: $f"; FAIL=$((FAIL+1)); else echo "[verify][OK] Found $f"; fi
}

require_dir() {
  local d="$1"; shift
  if [ ! -d "$d" ]; then echo "[verify][ERROR] Missing dir: $d"; FAIL=$((FAIL+1)); else echo "[verify][OK] Found $d"; fi
}

# A) Required files/dirs
require_file "vite.config.ts"
require_file ".github/workflows/azure-deploy.yml"
require_file "web.config"
require_dir "src"
require_dir "src/public"
require_dir "src/public/prompts"
require_dir "src/public/schemas"

# B) No tracked .env files (except src/.env.example)
if git ls-files | grep -E '\\.env(\\..*)?$' | grep -v '^src/.env.example$' >/dev/null; then
  echo "[verify][ERROR] Tracked .env files exist (other than src/.env.example):"
  git ls-files | grep -E '\\.env(\\..*)?$' | grep -v '^src/.env.example$' || true
  FAIL=$((FAIL+1))
else
  echo "[verify][OK] No tracked .env files besides src/.env.example"
fi

# C) No tracked secrets/keys
if git ls-files | grep -E '\\.(pem|pfx|key)$' >/dev/null; then
  echo "[verify][ERROR] Tracked credential files found (.pem/.pfx/.key)"; FAIL=$((FAIL+1))
else
  echo "[verify][OK] No tracked credential files"
fi

# D) Workflow checks
if ! grep -q "working-directory: ./src" .github/workflows/azure-deploy.yml; then echo "[verify][ERROR] Workflow missing working-directory ./src"; FAIL=$((FAIL+1)); else echo "[verify][OK] Workflow uses ./src working-directory"; fi
if ! grep -q "package: src/dist" .github/workflows/azure-deploy.yml; then echo "[verify][ERROR] Workflow not deploying src/dist"; FAIL=$((FAIL+1)); else echo "[verify][OK] Workflow deploys src/dist"; fi
if ! grep -q "node-version: '20.19.0'" .github/workflows/azure-deploy.yml; then echo "[verify][ERROR] Workflow Node version not pinned to 20.19.0"; FAIL=$((FAIL+1)); else echo "[verify][OK] Workflow Node pinned to 20.19.0"; fi

# E) Code tightening checks
if ! grep -q 'role="searchbox"' src/components/filters/FilterBar.tsx; then echo "[verify][ERROR] Missing role=searchbox in Search input"; FAIL=$((FAIL+1)); else echo "[verify][OK] Search input has role=searchbox"; fi
if ! grep -q 'aria-label="Search prompts"' src/components/filters/FilterBar.tsx; then echo "[verify][ERROR] Missing aria-label in Search input"; FAIL=$((FAIL+1)); else echo "[verify][OK] Search input has aria-label"; fi
if ! grep -q '<br />' src/components/graph/WorkflowGraph.tsx; then echo "[verify][ERROR] WorkflowGraph missing <br /> conversion"; FAIL=$((FAIL+1)); else echo "[verify][OK] WorkflowGraph uses <br /> in tooltip"; fi
if ! grep -q 'import.meta.env.VITE_HELP_CENTER_URL' src/constants.ts; then echo "[verify][ERROR] constants.ts HELP_URL not env-backed"; FAIL=$((FAIL+1)); else echo "[verify][OK] HELP_URL reads from env"; fi
if [ ! -f src/config.ts ]; then echo "[verify][ERROR] Missing src/config.ts"; FAIL=$((FAIL+1)); else echo "[verify][OK] src/config.ts present"; fi

if [ "$FAIL" -gt 0 ]; then
  echo "[verify] FAIL ($FAIL issues)"
  exit 1
else
  echo "[verify] PASS"
fi
