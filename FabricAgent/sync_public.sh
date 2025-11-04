#!/usr/bin/env bash
set -euo pipefail

# Sync a clean, public-safe export from the private repo into this repo.
# Usage: ./sync_public.sh [/path/to/private/repo]
# Optionally set SRC via environment: SRC=/path/to/private ./sync_public.sh

DST_DIR=$(cd -- "$(dirname "$0")" && pwd)

# Resolve source repo path: prefer CLI arg, then SRC env, then a nearby sibling guess
SRC="${1:-${SRC:-}}"
if [ -z "${SRC}" ]; then
  for guess in \
    "$DST_DIR/../fabricagent-pub" \
    "$DST_DIR/../../fabricagent-pub" \
    "$DST_DIR/../fabricagent_priv" \
    ""; do
    if [ -n "$guess" ] && [ -d "$guess/.git" ]; then SRC="$guess"; break; fi
  done
fi

if [ -z "${SRC}" ] || [ ! -d "${SRC}" ]; then
  echo "[sync][ERROR] Missing or invalid SRC path. Provide the private repo path as an argument or via SRC env." >&2
  echo "Example: SRC=~/dev/fabricagent-pub ./sync_public.sh" >&2
  exit 2
fi

TMP=$(mktemp -d /tmp/fabric_pub_sync_XXXX)
trap 'rm -rf "$TMP"' EXIT

echo "[sync] Source: $SRC"
echo "[sync] Dest:   $DST_DIR"
echo "[sync] Temp:   $TMP"

# 1) Build a clean export in TMP respecting allowlist and excludes
mkdir -p "$TMP/.github/workflows" "$TMP/src" "$TMP/src/public"

rsync -av --prune-empty-dirs \
  --exclude '.git/' --exclude '.vscode/' --exclude 'node_modules/' \
  --exclude 'dist/' --exclude '.turbo/' --exclude '.vite/' \
  --exclude 'build_output/' --exclude 'release/' \
  --exclude 'notebooks/' --exclude 'screenshots/' \
  --exclude 'transcripts/' --exclude '*.env*' \
  --exclude '*.pem' --exclude '*.pfx' --exclude '*.key' \
  --exclude 'docs/internal-strategy-2025.md' \
  --exclude '.github/workflows/azure-deploy-legacy.yml' \
  --exclude '.github/workflows/unit-tests-staging.yml' \
  "$SRC/src/" "$TMP/src/"

# Top-level docs and config
rsync -av --prune-empty-dirs \
  "$SRC/README.md" "$SRC/LICENSE" "$SRC/SECURITY.md" \
  "$SRC/CONTRIBUTING.md" "$SRC/CODE_OF_CONDUCT.md" \
  "$SRC/web.config" \
  "$TMP/" || true

# Single deploy workflow
if [ -f "$SRC/.github/workflows/azure-deploy.yml" ]; then
  rsync -av "$SRC/.github/workflows/azure-deploy.yml" "$TMP/.github/workflows/"
fi

# Public assets: prompts and schemas (served from /prompts and /schemas)
if [ -d "$SRC/prompts" ]; then
  rsync -av "$SRC/prompts/" "$TMP/src/public/prompts/"
fi
if [ -d "$SRC/schemas" ]; then
  rsync -av "$SRC/schemas/" "$TMP/src/public/schemas/"
fi

# Provide env example if missing
if [ ! -f "$TMP/src/.env.example" ]; then
  cat > "$TMP/src/.env.example" << 'ENV'
VITE_API_BASE=https://api.fabricprompts.com
VITE_ENABLE_EXPERIMENTAL=false
VITE_HELP_CENTER_URL=https://docs.fabricprompts.com
VITE_ANALYTICS_KEY=
ENV
fi

# 2) Sync into repo while protecting repo metadata
cd "$DST_DIR"
rsync -av --delete \
  --filter='P .git/' \
  --filter='P .github/' \
  "$TMP"/ ./

echo "[sync] Done. Review changes and commit if needed."
