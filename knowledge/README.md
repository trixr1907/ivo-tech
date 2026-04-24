# Knowledge Base for Homepage Redesign (Agentic RAG First)

Status: bootstrapped on 2026-04-10

This folder is the operational memory layer for Codex Chat and future AI agents working on the ivo-tech homepage redesign.

## Decision

Primary architecture: **Hybrid (Agentic RAG + lightweight Graph layer)**.

- Agentic RAG is the default for retrieval, comparison, synthesis, and scoped context packs.
- Graph is optional and lightweight, only for relationship-heavy reasoning (offer -> pain point -> proof -> CTA -> page section).
- No heavy Graph-only setup and no full-context prompting.

## Directory map

- `raw_sources/`: source registry, crawl targets, source provenance.
- `crawled_pages/`: raw HTML snapshots and crawl manifests by date/version.
- `extracted_content/`: extracted page structures (hero, nav, CTA, trust, FAQ).
- `normalized_content/`: canonical JSON/Markdown units with stable IDs.
- `chunks/`: semantic retrieval chunks with metadata.
- `metadata/`: JSON schemas for documents/chunks/decisions/context packs.
- `embeddings/`: embedding run manifests and index metadata.
- `knowledge_graph/`: optional graph schema and edges.
- `research/`: benchmark and inspiration registries.
- `audits/`: reusable audit templates and findings.
- `inspiration/`: screenshots and benchmark captures.
- `design_decisions/`: ADRs and decision log.
- `prompts/`: retrieval mode prompts and agent behavior contracts.
- `context_packs/`: reusable task-specific compressed context bundles.
- `frontend_project/`: integration notes that map knowledge -> implementation.
- `docs/`: system architecture + ingestion workflow.

## Operational rules

1. Every important claim must map to source IDs.
2. Context packs are generated per task; avoid giant prompts.
3. Decisions go to `design_decisions/` before implementation changes.
4. New crawl snapshots are append-only and versioned by timestamp.
5. If evidence is weak or conflicting, mark it explicitly.

## First execution order

1. Crawl current website snapshots.
2. Extract page structures and CTA/trust elements.
3. Normalize + assign metadata.
4. Semantic chunking.
5. Embeddings and index manifest.
6. Trial agentic queries + reranking.
7. Build context packs.
8. Add optional lightweight graph for relationship queries.
9. Start redesign planning and frontend implementation.
