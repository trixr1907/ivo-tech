#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

CORE_JS="$REPO_ROOT/packages/dld3d-core/dist/dld3d-core.js"
CORE_CSS="$REPO_ROOT/packages/dld3d-core/dist/dld3d-core.css"

# Canonical plugin path (as per plan)
PLUGIN_DIR="/mnt/c/Users/Ivo/Desktop/Plugin/wp-plugin/dld-3d-configurator"

if [[ ! -d "$PLUGIN_DIR" ]]; then
  echo "Plugin dir not found: $PLUGIN_DIR" >&2
  exit 1
fi

mkdir -p "$PLUGIN_DIR/assets/js" "$PLUGIN_DIR/assets/css"

cp -f "$CORE_JS" "$PLUGIN_DIR/assets/js/dld3d-core.js"
cp -f "$CORE_CSS" "$PLUGIN_DIR/assets/css/dld3d-core.css"

echo "Synced:"
echo "  $CORE_JS  -> $PLUGIN_DIR/assets/js/dld3d-core.js"
echo "  $CORE_CSS -> $PLUGIN_DIR/assets/css/dld3d-core.css"

