# Initial Audit - Crawl Baseline 2026-04-10

## Data scope
- Live docs: 49
- Preview docs: 7
- Combined chunks: 345

## Quantitative snapshot
- Live CTA occurrences: 104
- Live sections captured: 137
- Live headings captured: 401
- Live FAQ questions captured: 24
- Preview CTA occurrences: 54
- Preview sections captured: 47

## Semantic chunk distribution
- cta: 125
- design_direction: 2
- faq: 46
- hero_value_prop: 4
- other: 144
- process_step: 4
- service_offer: 8
- trust_signal: 12

## Findings (priority-ranked)
1. CTA density is very high (distribution heavily CTA-skewed), increasing decision friction and reducing hierarchy clarity.
2. Trust material exists but is clustered in specific areas instead of being staged along the conversion journey.
3. Section semantics include many `other` chunks, indicating current structure has mixed intent blocks that should be disentangled in redesign.
4. Live and preview differ in information architecture style and narrative tone, so final redesign requires explicit convergence rules.

## Recommended immediate actions
1. Freeze one primary conversion intent for homepage hero and global CTA strategy.
2. Define a strict section sequence and max CTA count per section.
3. Redistribute trust signals to align with objection timing (hero -> offer -> proof -> contact).
4. Promote high-value `other` chunks into explicit semantic classes before final planning.

## Evidence files
- knowledge/extracted_content/2026-04-10_auto_extracted_live.json
- knowledge/extracted_content/2026-04-10_auto_extracted_preview.json
- knowledge/chunks/2026-04-10_combined_semantic_chunks_auto.jsonl