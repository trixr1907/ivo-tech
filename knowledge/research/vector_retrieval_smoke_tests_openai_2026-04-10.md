# Vector Retrieval Smoke Tests (OpenAI) - 2026-04-10

Vector index:
- knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_openai_t3l.jsonl

Provider/model:
- openai / text-embedding-3-large

## Query 1: Website Audit

```json
{
  "query": "homepage audit schwächen cta trust klarheit",
  "provider": "openai",
  "model": "text-embedding-3-large",
  "vectorsFile": "knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_openai_t3l.jsonl",
  "results": [
    {
      "chunk_id": "ch_e2155558170d",
      "source_id": "src_ivo_live__home",
      "semantic_type": "other",
      "score": 0.5688092349855015
    },
    {
      "chunk_id": "ch_9c7e2fa07f47",
      "source_id": "src_ivo_live__home",
      "semantic_type": "cta",
      "score": 0.5366072735957197
    },
    {
      "chunk_id": "ch_77f17a790c8c",
      "source_id": "src_ivo_live__case_studies_portfolio_authority_relaunch",
      "semantic_type": "other",
      "score": 0.5235853726500292
    },
    {
      "chunk_id": "ch_e4279d318587",
      "source_id": "src_ivo_live__case_studies_portfolio_authority_relaunch",
      "semantic_type": "other",
      "score": 0.5153031754425181
    },
    {
      "chunk_id": "ch_95e027185793",
      "source_id": "src_ivo_live__home",
      "semantic_type": "other",
      "score": 0.48888652865623616
    }
  ]
}
```

## Query 2: Hero Redesign

```json
{
  "query": "hero value proposition premium design conversion",
  "provider": "openai",
  "model": "text-embedding-3-large",
  "vectorsFile": "knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_openai_t3l.jsonl",
  "results": [
    {
      "chunk_id": "ch_6ffe13af7ee7",
      "source_id": "src_ivo_live__en",
      "semantic_type": "other",
      "score": 0.5552527710206836
    },
    {
      "chunk_id": "ch_f1109bb653ed",
      "source_id": "src_ivo_live__en_case_studies_portfolio_authority_relaunch",
      "semantic_type": "other",
      "score": 0.49989753376514917
    },
    {
      "chunk_id": "ch_b08a0887af24",
      "source_id": "src_ivo_live__en_services",
      "semantic_type": "service_offer",
      "score": 0.48803793146220315
    },
    {
      "chunk_id": "ch_a9bd9f22c157",
      "source_id": "src_ivo_live__en",
      "semantic_type": "service_offer",
      "score": 0.4692814259286452
    },
    {
      "chunk_id": "ch_e2155558170d",
      "source_id": "src_ivo_live__home",
      "semantic_type": "other",
      "score": 0.46866283379672863
    }
  ]
}
```

## Query 3: Trust / Social Proof

```json
{
  "query": "trust social proof testimonials credibility",
  "provider": "openai",
  "model": "text-embedding-3-large",
  "vectorsFile": "knowledge/embeddings/vectors_2026-04-10_combined_plus_benchmarks_openai_t3l.jsonl",
  "results": [
    {
      "chunk_id": "ch_933c607db515",
      "source_id": "src_ivo_live__en",
      "semantic_type": "trust_signal",
      "score": 0.5204160464232795
    },
    {
      "chunk_id": "ch_14e5ca7def5c",
      "source_id": "src_ivo_live__home",
      "semantic_type": "trust_signal",
      "score": 0.46678107156189924
    },
    {
      "chunk_id": "ch_069bdfd01372",
      "source_id": "src_ivo_live__en",
      "semantic_type": "trust_signal",
      "score": 0.4323628205625919
    },
    {
      "chunk_id": "ch_6984a04c2589",
      "source_id": "src_ivo_live__home",
      "semantic_type": "trust_signal",
      "score": 0.41464018124065033
    },
    {
      "chunk_id": "ch_6ffe13af7ee7",
      "source_id": "src_ivo_live__en",
      "semantic_type": "other",
      "score": 0.404830560099875
    }
  ]
}
```
