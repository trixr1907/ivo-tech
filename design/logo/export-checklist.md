# Export Checklist (Logo System)

## Static
- [ ] `public/assets/logo/manifest.json`
- [ ] `public/assets/logo/ivo-logo__mark-detailed__static__dark__v1.0.0.svg`
- [ ] `public/assets/logo/ivo-logo__mark-core__static__dark__v1.0.0.svg`
- [ ] `public/assets/logo/ivo-logo__mark-micro__static__dark__v1.0.0.svg`
- [ ] `public/assets/logo/ivo-logo__wordmark__static__dark__v1.0.0.svg`
- [ ] `public/assets/logo/ivo-logo__lockup-horizontal__static__dark__v1.0.0.svg`
- [ ] `public/assets/logo/ivo-logo__lockup-stacked__static__dark__v1.0.0.svg`
- [ ] `public/assets/logo.png`
- [ ] `public/assets/logo.webp`
- [ ] `public/assets/logo.avif`
- [ ] `public/assets/logo-mark.png`
- [ ] `public/assets/logo-mark.webp`
- [ ] `public/assets/logo-mark.avif`
- [ ] `public/favicon.ico`

## Motion
- [ ] `public/assets/video/logo-sting.mp4` (H.264, yuv420p, faststart)
- [ ] `public/assets/video/logo-sting.webm` (VP9)
- [ ] `public/assets/video/logo-sting-poster.avif`
- [ ] `public/assets/video/logo-sting-captions.vtt`

## 3D
- [ ] `public/assets/brand/ivo-tech-logo.glb`
- [ ] `public/assets/demo-brand-base.stl`
- [ ] `public/assets/demo-brand-hybrid-v2.stl`

## QA
- [ ] Wordmark readable at 16/24/32 px
- [ ] Submark still distinct at favicon size
- [ ] Detailed/Core/Micro role split validated
- [ ] Light-mode variants pass contrast checks
- [ ] Header lockup does not overlap nav on mobile
- [ ] OG and Twitter previews show current logo
- [ ] `/brand` and `/en/brand` render without layout regressions
- [ ] `design/logo/asset-manifest.json` matches generated assets
- [ ] `public/assets/logo/manifest.json` has fresh SHA-256 hashes
- [ ] `node scripts/verify-logo-assets.mjs` passes
