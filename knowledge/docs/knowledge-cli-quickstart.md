# Knowledge CLI Quickstart

## 1) Crawl from sitemap

```bash
node scripts/knowledge/crawl-from-sitemap.mjs \
  --baseUrl=https://ivo-tech.com \
  --sourcePrefix=src_ivo_live \
  --limit=120 \
  --date=2026-04-10
```

## 2) Extract sections/CTA/trust/FAQ

```bash
node scripts/knowledge/extract-sections.mjs \
  --manifest=knowledge/crawled_pages/2026-04-10/manifest.json \
  --out=knowledge/extracted_content/2026-04-10_auto_extracted_live.json
```

## 3) Build semantic units and chunks

```bash
node scripts/knowledge/build-semantic-chunks.mjs \
  --input=knowledge/extracted_content/2026-04-10_auto_extracted_live.json \
  --date=2026-04-10
```

## 4) Merge multiple chunk sets

```bash
node scripts/knowledge/merge-chunks.mjs \
  --inputs=knowledge/chunks/2026-04-10_semantic_chunks_auto.jsonl,knowledge/chunks/2026-04-10-preview_semantic_chunks_auto.jsonl \
  --out=knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl
```

## 5) Retrieve for agent prompts

```bash
node scripts/knowledge/retrieve.mjs \
  --file=knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl \
  --query='hero cta trust contact' \
  --top=8
```

## 6) Build OpenAI embeddings (optional, for vector retrieval)

```bash
export OPENAI_API_KEY=...
node scripts/knowledge/build-embeddings.mjs \
  --file=knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl \
  --provider=openai \
  --model=text-embedding-3-large
```

## 7) Build local fallback embeddings (no API quota needed)

```bash
node scripts/knowledge/build-embeddings.mjs \
  --provider=local-hash \
  --model=local-hash-512-v1 \
  --localDim=512 \
  --file=knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl
```

## 8) Vector retrieval (optional)

```bash
export OPENAI_API_KEY=...
node scripts/knowledge/retrieve-vector.mjs \
  --vectorsFile=knowledge/embeddings/vectors_<runId>.jsonl \
  --query='hero cta trust contact' \
  --top=8
```

If `vectors_<runId>.jsonl` was built with `--provider=local-hash`, `retrieve-vector.mjs` runs API-independent.

Optional source filter:

```bash
node scripts/knowledge/retrieve.mjs \
  --file=knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl \
  --query='trust cta contact' \
  --top=8 \
  --sourcePrefix=src_ivo_live
```
