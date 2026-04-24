# Crawl and Ingestion Workflow

## Scope

Primary domains:
- https://ivo-tech.com
- https://ivo-tech-bcz4r4dcb-ivos-projects-77f7d33c.vercel.app/

Secondary (later):
- inspiration and benchmark sources
- UI/component references

## Pipeline steps

1. Crawl acquisition
- Collect HTML snapshot per URL and timestamp.
- Save response headers and canonical URL.
- Store to `knowledge/crawled_pages/<YYYY-MM-DD>/<source_id>/`.

2. Extraction
- Parse structure: navigation, hero, value props, CTA cluster, trust section, FAQ, footer.
- Parse semantic signals: claims, proof statements, audience hints, offer framing.
- Export structured JSON to `knowledge/extracted_content/`.

3. Normalization
- Convert to canonical schema with stable IDs.
- Deduplicate repeated snippets.
- Keep language marker (`de`, `en`).
- Save to `knowledge/normalized_content/`.

4. Chunking (semantic)
- Chunk by UI/meaning boundaries, not fixed tokens only.
- Preferred chunk units:
  - hero proposition
  - proof-bar item
  - services card
  - trust/testimonial block
  - FAQ pair (Q+A)
- Save to `knowledge/chunks/` with metadata.

5. Embedding/indexing
- Build embedding manifest for each chunk version.
- Persist index metadata in `knowledge/embeddings/index-manifest.json`.

6. Context pack generation
- Assemble task-specific packs from top-ranked chunks + critical structured facts.
- Save pack YAML in `knowledge/context_packs/`.

7. Versioning
- Keep append-only run folders.
- Increment source `version` on every crawl run.
- Do not overwrite historical snapshots.

## Firecrawl option

If Firecrawl is available, use it for:
- multi-page crawl depth control
- markdown extraction
- screenshot capture
- consistent output format

Fallback remains direct `curl` + local extraction scripts.
