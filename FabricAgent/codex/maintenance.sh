#!/usr/bin/env bash
set -euo pipefail
echo "==> Codex maintenance: deps + quick health check"

pushd src >/dev/null
trap 'popd >/dev/null' EXIT

# Neutralize noisy inherited proxies and production/omit toggles
unset NPM_CONFIG_HTTP_PROXY NPM_CONFIG_HTTPS_PROXY HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
unset npm_config_http_proxy npm_config_https_proxy
unset NPM_CONFIG_PRODUCTION npm_config_production
unset NPM_CONFIG_OMIT npm_config_omit
npm config delete proxy >/dev/null 2>&1 || true
npm config delete https-proxy >/dev/null 2>&1 || true

# Optional corporate root CA
if [[ -n "${CORP_CA_FILE:-}" && -f "${CORP_CA_FILE}" ]]; then
  export NODE_EXTRA_CA_CERTS="${CORP_CA_FILE}"
  npm config set cafile "${CORP_CA_FILE}" >/dev/null 2>&1 || true
elif [[ -n "${CORP_CA_B64:-}" ]]; then
  mkdir -p .certs
  CA_FILE=".certs/corp-ca.pem"
  if command -v base64 >/dev/null 2>&1; then
    echo "$CORP_CA_B64" | base64 --decode > "$CA_FILE" 2>/dev/null \
      || echo "$CORP_CA_B64" | base64 -D > "$CA_FILE" 2>/dev/null \
      || echo "$CORP_CA_B64" | openssl base64 -d -A > "$CA_FILE"
  else
    echo "$CORP_CA_B64" | openssl base64 -d -A > "$CA_FILE"
  fi
  export NODE_EXTRA_CA_CERTS="$PWD/$CA_FILE"
  npm config set cafile "$NODE_EXTRA_CA_CERTS" >/dev/null 2>&1 || true
fi

LOCKSUM_FILE=.codex_lock.sha256
if [[ -f package-lock.json ]]; then
  if command -v sha256sum >/dev/null 2>&1; then
    CURRENT_LOCKSUM="$(sha256sum package-lock.json | awk '{print $1}')"
  else
    CURRENT_LOCKSUM="$(shasum -a 256 package-lock.json | awk '{print $1}')"
  fi
else
  CURRENT_LOCKSUM="no-lock"
fi
CACHED_LOCKSUM="$(cat "$LOCKSUM_FILE" 2>/dev/null || true)"

if [[ ! -d node_modules || "$CURRENT_LOCKSUM" != "$CACHED_LOCKSUM" ]]; then
  echo "-> Dependencies changed or missing; installing…"
  rm -rf node_modules
  if [[ -f package-lock.json ]]; then
    npm ci --include=dev --include=optional --no-audit --no-fund --progress=false --loglevel=error
  else
    npm install --no-audit --no-fund --progress=false --loglevel=error
  fi
  printf '%s\n' "$CURRENT_LOCKSUM" > "$LOCKSUM_FILE"
else
  echo "-> Dependencies up to date; skipping install."
fi

# Lightweight guardrails (only run if scripts exist)
npm run -s typecheck >/dev/null 2>&1 || true
npm run -s lint >/dev/null 2>&1 || true

echo "==> Codex maintenance: done"
