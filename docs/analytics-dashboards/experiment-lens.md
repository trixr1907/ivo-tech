# Dashboard: Experiment Lens

Stand: 2026-04-10  
Status: aktiv (operativer Modus)

## Scope

1. `hero_variant_view` (Breakdown: `variant`)
2. `contact_form_start / cta_primary_click`
3. `contact_form_submit_success / contact_form_start`
4. `scheduler_cta_click / contact_form_start`

## Expected distribution

1. Zielgewichtung: `default/outcome/speed = 50/25/25`

## Query intent

1. Variantenwirkung auf Start- und Submit-Rate.
2. Verteilung gegen Sollgewichtung prüfen.

## Source of truth

1. Runtime experiment contract: `src/lib/heroExperiment.ts`
2. Experimentlog: `docs/hero-experiment-log.md`
3. Sync command: `npm run hero:log:sync:plausible -- --day=YYYY-MM-DD`
