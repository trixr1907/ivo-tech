# Retrieval Modes for Homepage Agent

## Global constraints

- Research first, then recommendation.
- Every substantive statement needs `source_id` references.
- Mark contradictions and weak evidence explicitly.
- Keep existing state, benchmark pattern, and final recommendation separate.

## Mode: search

Use when the user asks to gather options or find relevant material.

Output format:
- candidate_sources
- quick_relevance_reason
- follow_up_queries

## Mode: analysis

Use when the user asks for audit, gaps, risks, or current-state quality.

Output format:
- findings (severity-ranked)
- evidence
- unresolved_questions

## Mode: compare

Use when the user asks for alternatives or benchmarks.

Output format:
- comparison_matrix
- tradeoffs
- winner_by_constraint

## Mode: synthesis

Use when the user asks for a recommendation or implementation plan.

Output format:
- recommendation
- rationale
- supporting_evidence
- assumptions
- next_actions
