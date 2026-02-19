import fs from 'node:fs/promises';
import path from 'node:path';

import Image from 'next/image';
import type { Metadata } from 'next';

type AssetRow = {
  label: string;
  publicPath: string;
  sizeLabel: string;
};

const ROOT = process.cwd();

const ASSET_MANIFEST = [
  { label: 'Wordmark PNG', publicPath: '/assets/logo.png' },
  { label: 'Wordmark WebP', publicPath: '/assets/logo.webp' },
  { label: 'Wordmark AVIF', publicPath: '/assets/logo.avif' },
  { label: 'Submark PNG', publicPath: '/assets/logo-mark.png' },
  { label: 'Submark WebP', publicPath: '/assets/logo-mark.webp' },
  { label: 'Submark AVIF', publicPath: '/assets/logo-mark.avif' },
  { label: 'Favicon', publicPath: '/favicon.ico' },
  { label: 'Logo Sting MP4', publicPath: '/assets/video/logo-sting.mp4' },
  { label: 'Logo Sting WebM', publicPath: '/assets/video/logo-sting.webm' },
  { label: 'Logo Sting Poster', publicPath: '/assets/video/logo-sting-poster.avif' },
  { label: '3D Logo GLB', publicPath: '/assets/brand/ivo-tech-logo.glb' },
  { label: '3D Base STL', publicPath: '/assets/demo-brand-base.stl' },
  { label: '3D Hybrid STL', publicPath: '/assets/demo-brand-hybrid-v2.stl' }
] as const;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

async function readAssetRows(): Promise<AssetRow[]> {
  const rows = await Promise.all(
    ASSET_MANIFEST.map(async (entry) => {
      const absolutePath = path.join(ROOT, 'public', entry.publicPath);
      try {
        const stat = await fs.stat(absolutePath);
        return {
          label: entry.label,
          publicPath: entry.publicPath,
          sizeLabel: formatBytes(stat.size)
        };
      } catch {
        return {
          label: entry.label,
          publicPath: entry.publicPath,
          sizeLabel: 'missing'
        };
      }
    })
  );
  return rows;
}

export const metadata: Metadata = {
  title: 'Brand Review | ivo-tech',
  robots: { index: false, follow: false }
};

export default async function InternalBrandReviewPage() {
  const assetRows = await readAssetRows();

  return (
    <main>
      <section className="section">
        <div className="section-head">
          <h1>Internal Brand Review</h1>
          <p>
            Abnahmeflaeche fuer das finale <code>ivo-tech</code> Logo-System: Lesbarkeit, Kontrast, Asset-Vollstaendigkeit und
            Motion-Vorschau.
          </p>
        </div>

        <div className="brand-review-grid">
          <article className="brand-review-card">
            <h2>Wordmark</h2>
            <div className="brand-preview-surface brand-preview-surface--dark">
              <Image src="/assets/logo.png" alt="ivo-tech wordmark" width={880} height={338} className="brand-preview-wordmark" />
            </div>
            <div className="brand-preview-surface brand-preview-surface--light">
              <Image src="/assets/logo.png" alt="ivo-tech wordmark on light" width={880} height={338} className="brand-preview-wordmark" />
            </div>
          </article>

          <article className="brand-review-card">
            <h2>Submark</h2>
            <div className="brand-preview-surface brand-preview-surface--dark">
              <Image src="/assets/logo-mark.png" alt="ivo-tech submark" width={420} height={420} className="brand-preview-submark" />
            </div>
            <div className="brand-preview-surface brand-preview-surface--light">
              <Image src="/assets/logo-mark.png" alt="ivo-tech submark on light" width={420} height={420} className="brand-preview-submark" />
            </div>
          </article>
        </div>

        <article className="brand-review-card">
          <h2>Small Size Check (16/24/32 px)</h2>
          <div className="brand-size-row">
            {[16, 24, 32].map((size) => (
              <div key={`wordmark-${size}`} className="brand-size-chip">
                <span>{size}px Wordmark</span>
                <Image src="/assets/logo.png" alt={`ivo-tech wordmark ${size}px`} width={size * 6} height={Math.round(size * 2.3)} />
              </div>
            ))}
          </div>
          <div className="brand-size-row">
            {[16, 24, 32].map((size) => (
              <div key={`submark-${size}`} className="brand-size-chip">
                <span>{size}px Submark</span>
                <Image src="/assets/logo-mark.png" alt={`ivo-tech submark ${size}px`} width={size} height={size} />
              </div>
            ))}
          </div>
        </article>

        <article className="brand-review-card">
          <h2>Motion Preview (3-5s)</h2>
          <video className="brand-preview-video" controls preload="metadata" poster="/assets/video/logo-sting-poster.avif">
            <source src="/assets/video/logo-sting.webm" type="video/webm" />
            <source src="/assets/video/logo-sting.mp4" type="video/mp4" />
            <track src="/assets/video/logo-sting-captions.vtt" kind="captions" srcLang="de" label="Deutsch" default />
          </video>
        </article>

        <article className="brand-review-card">
          <h2>Route Scorecard</h2>
          <div className="brand-score-grid">
            <div className="brand-score-head">Kriterium</div>
            <div className="brand-score-head">Route A</div>
            <div className="brand-score-head">Route B</div>
            <div>Lesbarkeit 16/24/32</div>
            <div>4.2</div>
            <div>4.6</div>
            <div>Wiedererkennbarkeit</div>
            <div>3.9</div>
            <div>4.7</div>
            <div>Dark-Tech Fit</div>
            <div>4.1</div>
            <div>4.8</div>
            <div>Favicon/Submark Fit</div>
            <div>4.0</div>
            <div>4.5</div>
            <div>Motion Potenzial</div>
            <div>3.8</div>
            <div>4.9</div>
            <div className="brand-score-total">Gesamt</div>
            <div className="brand-score-total">4.00</div>
            <div className="brand-score-total">4.70</div>
          </div>
          <p className="brand-score-note">
            Entscheidung: Route B als Master. Vollstaendige Bewertung in <code>design/logo/route-scorecard.md</code>.
          </p>
        </article>

        <article className="brand-review-card">
          <h2>Asset Manifest</h2>
          <div className="ab-report-table-wrap">
            <table className="ab-report-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Public Path</th>
                  <th>Groesse</th>
                </tr>
              </thead>
              <tbody>
                {assetRows.map((row) => (
                  <tr key={row.publicPath}>
                    <td>{row.label}</td>
                    <td>
                      <code>{row.publicPath}</code>
                    </td>
                    <td>{row.sizeLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>
    </main>
  );
}
