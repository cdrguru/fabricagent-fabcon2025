#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR=$(cd -- "$(dirname "$0")" && pwd)
cd "$ROOT_DIR"

echo "[ready] Installing and building in ./src"
pushd src >/dev/null
npm install
npm run build

# Emulate CI step that copies web.config into dist
mkdir -p dist
cp -f ../web.config dist/ || true

if [ -f dist/index.html ]; then
  echo "[ready][OK] dist/index.html exists"
else
  echo "[ready][ERROR] dist/index.html missing"
  exit 1
fi

if [ -f dist/web.config ]; then
  echo "[ready][OK] dist/web.config present"
else
  echo "[ready][WARN] dist/web.config missing (will be added in CI copy step)"
fi
popd >/dev/null

# Verify prompts/schemas availability
if [ -f src/public/prompts/library/index.jsonl ]; then echo "[ready][OK] prompts index present"; else echo "[ready][ERROR] prompts index missing"; exit 1; fi
if [ -d src/public/schemas ]; then echo "[ready][OK] schemas directory present"; else echo "[ready][ERROR] schemas directory missing"; exit 1; fi

# Sanity: no tracked secrets
if git ls-files | grep -E '\\.(pem|pfx|key)$' >/dev/null; then echo "[ready][ERROR] Tracked credential files found"; exit 1; else echo "[ready][OK] No tracked credential files"; fi

echo "[ready] PASS"
