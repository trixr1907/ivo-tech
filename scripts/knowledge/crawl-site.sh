#!/usr/bin/env bash
set -euo pipefail

if [ "$#" -lt 2 ]; then
  echo "Usage: $0 <url> <source_id>"
  exit 1
fi

URL="$1"
SOURCE_ID="$2"
DATE_UTC="$(date -u +%F)"
TIMESTAMP_UTC="$(date -u +%Y-%m-%dT%H:%M:%SZ)"
OUT_DIR="knowledge/crawled_pages/${DATE_UTC}/${SOURCE_ID}"

mkdir -p "$OUT_DIR"

curl -sSL -D "$OUT_DIR/headers.txt" -A 'Mozilla/5.0' "$URL" -o "$OUT_DIR/index.html"
SHA256="$(sha256sum "$OUT_DIR/index.html" | cut -d ' ' -f1)"

cat > "$OUT_DIR/meta.json" <<META
{
  "source_id": "${SOURCE_ID}",
  "url": "${URL}",
  "fetched_at": "${TIMESTAMP_UTC}",
  "sha256": "${SHA256}",
  "path": "${OUT_DIR}/index.html"
}
META

echo "Crawled ${URL} -> ${OUT_DIR}/index.html"
echo "sha256=${SHA256}"
