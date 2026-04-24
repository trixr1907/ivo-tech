# Ingestion Run Report - 2026-04-10

## Run scope

- Live base: `https://ivo-tech.com`
- Preview base: `https://ivo-tech-bcz4r4dcb-ivos-projects-77f7d33c.vercel.app`

## Live crawl

- discovered via sitemap: 50 URLs
- crawled: 50 pages
- manifest: `knowledge/crawled_pages/2026-04-10/manifest.json`

## Preview crawl

- sitemap discovered URLs: 0
- fallback seed crawl: 7 pages
- manifest: `knowledge/crawled_pages/2026-04-10-preview/manifest.json`

## Extraction outputs

- live extracted docs: 49
  - file: `knowledge/extracted_content/2026-04-10_auto_extracted_live.json`
- preview extracted docs: 7
  - file: `knowledge/extracted_content/2026-04-10_auto_extracted_preview.json`

## Semantic outputs

- live semantic units: 137
- live semantic chunks: 257
  - file: `knowledge/chunks/2026-04-10_semantic_chunks_auto.jsonl`

- preview semantic units: 47
- preview semantic chunks: 88
  - file: `knowledge/chunks/2026-04-10-preview_semantic_chunks_auto.jsonl`

- combined deduped chunks: 345
  - file: `knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl`

## Notes

- Preview domain needed fallback paths due missing sitemap listing.
- Retrieval currently uses lexical score + confidence + heuristic reranking.
- Next step is embedding integration and proper vector/hybrid index binding.
