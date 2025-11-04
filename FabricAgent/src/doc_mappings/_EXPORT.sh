#!/bin/bash
set -euo pipefail

echo "🔄 Creating GIAC doc mappings export bundle..."

# Create zip excluding cache and temp files
zip -r doc_mappings_export.zip doc_mappings/ -x "*/__pycache__/*" "*/.*" "*~"

echo "✅ Wrote doc_mappings_export.zip"
echo "📊 Bundle contents:"
unzip -l doc_mappings_export.zip | tail -n +4 | head -n -2

echo ""
echo "🚀 Ready to move to Fabric Agent Pub repository"
echo "   Extract with: unzip doc_mappings_export.zip -d /target/repo/"
