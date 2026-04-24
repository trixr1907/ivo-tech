# Retrieval Flows

## Flow A: Website audit

1. Route query to `analysis` mode.
2. Retrieve chunks from first-party sources (`src_ivo_live_home`, `src_ivo_vercel_preview_home`).
3. Re-rank by section relevance and trust/CTA signal density.
4. Produce severity-ranked findings with source references.

## Flow B: Inspiration comparison

1. Route query to `compare` mode.
2. Retrieve benchmark patterns and matching first-party sections.
3. Score by fit (audience fit, offer fit, trust fit, complexity risk).
4. Return pattern matrix + recommendation.

## Flow C: Copy improvement

1. Route query to `synthesis` mode with copy constraints.
2. Retrieve current copy chunks + proof chunks + objection chunks.
3. Generate variants and score each claim by evidence strength.
4. Return selected variant with evidence IDs.

## Flow D: UI/system decisions

1. Route query to `compare` then `synthesis`.
2. Retrieve component patterns + existing implementation constraints.
3. Compare component options on accessibility, responsiveness, maintainability.
4. Produce decision proposal and persist ADR.

## Flow E: Context pack assembly

1. Determine task type and mode.
2. Retrieve top evidence chunks and mandatory structured facts.
3. Compress context into target pack schema.
4. Store in `knowledge/context_packs/` for implementation turn.
