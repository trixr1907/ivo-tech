#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <pack_id> <goal>"
  exit 1
fi

PACK_ID="$1"
GOAL="$2"
OUT_FILE="knowledge/context_packs/${PACK_ID}.yaml"

cat > "$OUT_FILE" <<PACK
pack_id: ${PACK_ID}
goal: ${GOAL}
mode: synthesis
sources: []
core_facts: []
open_questions: []
next_steps: []
PACK

echo "Created ${OUT_FILE}"
