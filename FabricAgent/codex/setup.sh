#!/usr/bin/env bash
set -euo pipefail

echo "==> Codex setup: installing and building (src)"
pushd src >/dev/null

# 0) Clean slate: remove env that can silently force prod-only/omit or stale proxies
# Note: We'll set proxy vars below if HTTPS_PROXY_URL is provided as a secret
unset HTTP_PROXY HTTPS_PROXY http_proxy https_proxy ALL_PROXY all_proxy NO_PROXY no_proxy
unset NPM_CONFIG_PRODUCTION npm_config_production NPM_CONFIG_OMIT npm_config_omit
# Also unset any npm config env vars that might be inherited
unset npm_config_proxy npm_config_https_proxy
# Clear any existing npm proxy configs (will be reset if HTTPS_PROXY_URL is set)
npm config delete proxy 2>/dev/null || true
npm config delete https-proxy 2>/dev/null || true
npm config delete http-proxy 2>/dev/null || true

# 1) Optional enterprise proxy (provided via Codex Secrets)
#    - If HTTPS_PROXY_URL is set, export environment variables for tools that need them
if [[ "${HTTPS_PROXY_URL:-}" != "" ]]; then
  export HTTPS_PROXY="${HTTPS_PROXY_URL}"
  export HTTP_PROXY="${HTTPS_PROXY}"
  export https_proxy="${HTTPS_PROXY}"
  export http_proxy="${HTTP_PROXY}"
  # Common safe NO_PROXY baseline (add your internal domains/subnets if needed)
  export NO_PROXY="localhost,127.0.0.1,::1"
else
  # Ensure no proxy env vars are set when not using enterprise proxy
  unset http_proxy https_proxy HTTP_PROXY HTTPS_PROXY
  unset npm_config_proxy npm_config_https_proxy npm_config_http_proxy
fi

# 2) Optional corporate root CA
#    - Provide as base64-encoded PEM via CORP_CA_B64, or a path via CORP_CA_FILE
if [[ -n "${CORP_CA_FILE:-}" && -f "${CORP_CA_FILE}" ]]; then
  CA_FILE="${CORP_CA_FILE}"
  export NODE_EXTRA_CA_CERTS="$CA_FILE"
  npm config set cafile "$CA_FILE" >/dev/null 2>&1 || true
  git config --global http.sslCAInfo "$CA_FILE" >/dev/null 2>&1 || true
elif [[ -n "${CORP_CA_B64:-}" ]]; then
  CA_FILE="/tmp/corp-ca.pem"
  # Use openssl for consistent base64 decoding (handles -A flag properly)
  if echo "$CORP_CA_B64" | openssl base64 -d -A > "$CA_FILE" 2>/dev/null; then
    # Validate the PEM file was created correctly
    if openssl x509 -in "$CA_FILE" -noout -text >/dev/null 2>&1; then
      export NODE_EXTRA_CA_CERTS="$CA_FILE"
      npm config set cafile "$CA_FILE" >/dev/null 2>&1 || true
      git config --global http.sslCAInfo "$CA_FILE" >/dev/null 2>&1 || true
      echo "[info] Corporate CA certificate loaded from CORP_CA_B64"
    else
      echo "[warn] Invalid certificate in CORP_CA_B64, skipping CA setup"
      rm -f "$CA_FILE"
    fi
  else
    echo "[warn] Failed to decode CORP_CA_B64, skipping CA setup"
  fi
fi

# 3) Resilient npm networking + tidy config
# Clear npm cache to remove any stale proxy configs
npm cache clean --force >/dev/null 2>&1 || true

npm config set registry "https://registry.npmjs.org/"
npm config set fetch-retries 5
npm config set fetch-retry-factor 2
npm config set fetch-retry-mintimeout 2000
npm config set fetch-retry-maxtimeout 20000
npm config set prefer-online true || true

# Comprehensive proxy config cleanup (addresses npm 11.x warnings)
npm config delete proxy 2>/dev/null || true
npm config delete https-proxy 2>/dev/null || true
npm config delete http-proxy 2>/dev/null || true
npm config delete noproxy 2>/dev/null || true

# Only set proxy configs if enterprise proxy is provided
if [[ "${HTTPS_PROXY_URL:-}" != "" ]]; then
  npm config set https-proxy "${HTTPS_PROXY_URL}" >/dev/null 2>&1 || true
  npm config set proxy "${HTTPS_PROXY_URL}" >/dev/null 2>&1 || true
fi

# 4) Preflight reachability (non-fatal; hints if we lack a proxy)
if ! npm ping; then
  echo "[warn] npm ping failed. If you are on a corporate network, set HTTPS_PROXY_URL as a Secret."
fi

# 5) Deterministic, quiet install with dev+optional deps and exponential backoff
INSTALL_CMD=(npm ci --include=dev --include=optional --no-audit --no-fund --progress=false --loglevel=error)
max=5
for attempt in $(seq 1 "$max"); do
  echo "npm install attempt $attempt/$max..."
  if "${INSTALL_CMD[@]}"; then
    echo "npm ci succeeded"
    
    # 5a) Check for Rollup native dependency issues and fix them
    if [[ -d node_modules/rollup ]] && ! npm ls @rollup/rollup-linux-x64-gnu >/dev/null 2>&1; then
      echo "Installing Rollup native dependencies for Linux x64..."
      npm install @rollup/rollup-linux-x64-gnu --no-save --ignore-scripts >/dev/null 2>&1 || true
    fi
    
    break
  fi
  rc=$?
  if [[ $attempt -eq $max ]]; then
    echo "npm ci failed after $max attempts (rc=$rc)"
    echo "If you are behind a proxy, add HTTPS_PROXY_URL as a Codex Secret."
    exit $rc
  fi
  sleep_for=$(( 2 ** attempt ))
  echo "retrying in ${sleep_for}s..."
  sleep "$sleep_for"
done

# 6) Build
npm run build

popd >/dev/null
echo "==> Codex setup: done"
