# System Architecture: Agentic Retrieval for Homepage Redesign

## 1) Why hybrid

Recommended stack: **Agentic RAG as base + optional lightweight graph**.

- Agentic RAG handles 90% of work: focused retrieval, comparison, synthesis, context-pack assembly.
- Lightweight graph handles relation-heavy questions:
  - which CTA supports which pain point,
  - which trust element backs which claim,
  - which component/style pattern best fits target audience and offer.
- Pure Graph RAG is unnecessary overhead at this stage.

## 2) Storage split

### Vector index
Use for semantically searchable units:
- normalized page sections
- audits
- inspiration notes
- competitor findings
- copy variants
- decision rationale snippets

### Structured files in repo
Use as source of truth for:
- source registry
- schema definitions
- decision logs
- context-pack specs
- extraction manifests
- benchmark scorecards

### Optional graph
Use only for explicit entities and relationships that improve planning quality.

## 3) Retrieval pipelines

1. Audit pipeline
- intent: extract current-state quality and issues
- retrieval: first-party pages + extracted structures + prior audit notes
- output: issue map with evidence IDs

2. Inspiration/benchmark pipeline
- intent: compare patterns from curated references
- retrieval: inspiration registry + screenshots + structured benchmark notes
- output: pattern matrix and fit-for-purpose recommendation

3. Copy/positioning pipeline
- intent: sharpen value proposition and CTA hierarchy
- retrieval: current copy, trust proof, audience/painpoint nodes, benchmark messaging
- output: ranked copy options with evidence

4. Frontend execution pipeline
- intent: convert decisions into component architecture
- retrieval: design decisions + chosen UI patterns + constraints + DS rules
- output: implementation plan + component map

## 4) Mode routing (agent behavior)

- Search mode: broad fetch, high recall, low synthesis.
- Analysis mode: deep inspect, evidence extraction, weakness detection.
- Compare mode: side-by-side source scoring, tradeoff matrix.
- Synthesis mode: constrained recommendation with cited evidence.

Routing heuristic:
- user asks "what is there" -> Search
- user asks "what is wrong" -> Analysis
- user asks "which is better" -> Compare
- user asks "what should we build" -> Synthesis

## 5) Quality gates

- Every recommendation must cite source IDs.
- Contradictions must be marked explicitly.
- Weak evidence must be labeled low confidence.
- No design decision without rationale + linked evidence.
