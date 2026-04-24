#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <html_file> <output_txt>"
  exit 1
fi

HTML_FILE="$1"
OUTPUT_FILE="$2"

sed 's/></>\n</g' "$HTML_FILE" \
  | rg -n '<h1|<h2|<h3|<nav|href="#|aria-label=|FAQ|Kontakt|Case|Trust|CTA' \
  > "$OUTPUT_FILE"

echo "Extracted structure signals -> ${OUTPUT_FILE}"
