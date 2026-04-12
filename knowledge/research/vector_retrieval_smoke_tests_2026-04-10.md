# Vector Retrieval Smoke Tests - 2026-04-10

Vector index:
- knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_localhash512.jsonl

Provider:
- local-hash (fallback, API-independent)

## Query 1: Website Audit

```json
{
  "query": "homepage audit schwächen cta trust klarheit",
  "provider": "local-hash",
  "model": "local-hash-512-v1",
  "vectorsFile": "knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_localhash512.jsonl",
  "results": [
    {
      "chunk_id": "ch_73424a26d861",
      "source_id": "src_ivo_live__leistungen_ai_automation_workflows",
      "semantic_type": "faq",
      "score": 0.1825741858350554
    },
    {
      "chunk_id": "ch_6839310d61e5",
      "source_id": "src_benchmark__www_radix_ui_com",
      "semantic_type": "design_direction",
      "score": 0.1825741858350554
    },
    {
      "chunk_id": "ch_30e44373d3cb",
      "source_id": "src_ivo_live__leistungen_ai_automation_workflows",
      "semantic_type": "faq",
      "score": 0.1666666666666667
    },
    {
      "chunk_id": "ch_c6346cb604f3",
      "source_id": "src_ivo_live__about",
      "semantic_type": "other",
      "score": 0.1549968516584257
    },
    {
      "chunk_id": "ch_33edd6ea987e",
      "source_id": "src_ivo_live__en_services_ai_automation_workflows",
      "semantic_type": "faq",
      "score": 0.15430334996209194
    }
  ]
}
```

## Query 2: Hero Redesign

```json
{
  "query": "hero value proposition premium design conversion",
  "provider": "local-hash",
  "model": "local-hash-512-v1",
  "vectorsFile": "knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_localhash512.jsonl",
  "results": [
    {
      "chunk_id": "ch_416cb0dd511a",
      "source_id": "src_ivo_live__home",
      "semantic_type": "cta",
      "score": 0.3086066999241839
    },
    {
      "chunk_id": "ch_637714295c5d",
      "source_id": "src_ivo_preview__home",
      "semantic_type": "cta",
      "score": 0.288675134594813
    },
    {
      "chunk_id": "ch_320b660092e0",
      "source_id": "src_ivo_preview__contact",
      "semantic_type": "cta",
      "score": 0.288675134594813
    },
    {
      "chunk_id": "ch_6d9d23326fc1",
      "source_id": "src_ivo_preview__services",
      "semantic_type": "cta",
      "score": 0.288675134594813
    },
    {
      "chunk_id": "ch_b51a112e0d98",
      "source_id": "src_ivo_preview__case_studies",
      "semantic_type": "cta",
      "score": 0.288675134594813
    }
  ]
}
```

## Query 3: Trust / Social Proof

```json
{
  "query": "trust social proof testimonials credibility",
  "provider": "local-hash",
  "model": "local-hash-512-v1",
  "vectorsFile": "knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_localhash512.jsonl",
  "results": [
    {
      "chunk_id": "ch_933c607db515",
      "source_id": "src_ivo_live__en",
      "semantic_type": "trust_signal",
      "score": 0.27513802823208416
    },
    {
      "chunk_id": "ch_e980ccc9f593",
      "source_id": "src_ivo_live__leistungen_ai_automation_workflows",
      "semantic_type": "faq",
      "score": 0.20000000000000004
    },
    {
      "chunk_id": "ch_6839310d61e5",
      "source_id": "src_benchmark__www_radix_ui_com",
      "semantic_type": "design_direction",
      "score": 0.20000000000000004
    },
    {
      "chunk_id": "ch_63924708cf68",
      "source_id": "src_ivo_live__en_services_ai_automation_workflows",
      "semantic_type": "faq",
      "score": 0.1825741858350554
    },
    {
      "chunk_id": "ch_7e88aa0391ef",
      "source_id": "src_benchmark__ui_shadcn_com",
      "semantic_type": "component_pattern",
      "score": 0.1825741858350554
    }
  ]
}
```
