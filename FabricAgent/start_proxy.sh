#!/bin/bash

# Start the rewrite proxy server
# Requires environment variables to be set (see .env.example)

# Check if required environment variables are set
if [ -z "$AZURE_OPENAI_ENDPOINT" ] || [ -z "$AZURE_OPENAI_API_KEY" ]; then
    echo "Error: Required Azure OpenAI environment variables not set."
    echo "Please set the following environment variables:"
    echo "  AZURE_OPENAI_ENDPOINT"
    echo "  AZURE_OPENAI_API_KEY"
    echo "  AZURE_OPENAI_API_VERSION (optional, defaults to 2025-04-01-preview)"
    echo "  AZURE_OPENAI_DEPLOYMENT (optional)"
    echo ""
    echo "You can source them from your .env file or export them manually."
    exit 1
fi

# Set default API version if not provided
export AZURE_OPENAI_API_VERSION=${AZURE_OPENAI_API_VERSION:-2025-04-01-preview}

echo "Starting rewrite proxy with endpoint: $AZURE_OPENAI_ENDPOINT"
node scripts/rewrite-proxy.mjs
