# Frontend Project Integration Notes

This folder links retrieval output to implementation tasks in the actual frontend codebase.

## Mapping

- knowledge decisions -> `knowledge/design_decisions/`
- context pack for task -> `knowledge/context_packs/<task>.yaml`
- implementation target -> `src/` and `src/components/`

## Required workflow before coding

1. Load relevant context pack.
2. Validate assumptions against source IDs.
3. Confirm no conflicting accepted ADR exists.
4. Then implement component/page change.

## Required workflow after coding

1. Update or create ADR.
2. Add evidence links to changed assumptions.
3. If structure/copy changed, re-run extraction and chunk refresh.
