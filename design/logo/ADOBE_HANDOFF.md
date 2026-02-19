# ivo-tech Logo Handoff (Adobe CC)

## 1) Zielbild
- Brand: `ivo-tech` (lowercase, wordmark-first).
- Stil: aggressive futuristic, neon-cyan on dark-tech background.
- Core: klare Lesbarkeit in 16/24/32 px und hohe Wiedererkennbarkeit im Header.

## 2) Source of Truth
- Wordmark master: `design/logo/ivo-tech-logo-master.ai`
- Wordmark preview: `design/logo/ivo-tech-logo-master.svg`
- Route A/B exploration:
  - `design/logo/routes/ivo-tech-logo-route-a.svg`
  - `design/logo/routes/ivo-tech-logo-route-b.svg`
- Regeln: `design/logo/usage-rules.md`

## 3) Produktions-Assets (live)
- Wordmark:
  - `public/assets/logo.png`
  - `public/assets/logo.webp`
  - `public/assets/logo.avif`
- Submark:
  - `public/assets/logo-mark.png`
  - `public/assets/logo-mark.webp`
  - `public/assets/logo-mark.avif`
- Favicon:
  - `public/favicon.ico`
- Motion:
  - `public/assets/video/logo-sting.mp4`
  - `public/assets/video/logo-sting.webm`
  - `public/assets/video/logo-sting-poster.avif`
- 3D:
  - `public/assets/brand/ivo-tech-logo.glb`
  - `public/assets/demo-brand-base.stl`
  - `public/assets/demo-brand-hybrid-v2.stl`

## 4) Adobe Workflow (recommended)
1. Illustrator:
   - Final curves and lockups in `ivo-tech-logo-master.ai`.
   - Keep clearspace and min-size constraints from `usage-rules.md`.
2. Photoshop:
   - Social/preview composites on dark-tech backplates.
   - Only export-ready finishing, no shape edits on master curves.
3. After Effects:
   - 3-5s sting, single build and final hold.
   - Render master comp to mezzanine and transcode to web deliverables.
4. Firefly:
   - Ideation only (backplates/style exploration), never final logo geometry.
5. Creative Cloud Libraries:
   - Keep brand swatches, logo components, and export presets in one shared library.

## 5) Regeneration (engineering)
- Rebuild complete logo package from script:
```bash
python3 scripts/generate_logo_system.py
```
- Recreate optimized derivatives:
```bash
node scripts/optimize-images.mjs
```

## 6) Quality Gates
- Visual:
  - 16/24/32 px readability check on dark background.
  - no clipping, no stretched mark, no bloom overuse.
- Technical:
  - stable public paths (`/assets/logo*`, `/assets/logo-mark*`, `/assets/video/logo-sting*`).
  - no regressions in header layout desktop/mobile.
- Product:
  - metadata/social previews consume latest logo assets.
  - primary brand string remains `ivo-tech` consistently.
