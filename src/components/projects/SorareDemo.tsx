import type { Locale } from '@/content/copy';

type Props = {
  locale: Locale;
};

const METRICS = [
  { key: 'Projection Model', value: '+ uncertainty' },
  { key: 'Lineup Optimizer', value: 'OR-Tools' },
  { key: 'Simulation', value: 'Monte Carlo' },
  { key: 'Delivery', value: 'API + Web' }
] as const;

export function SorareDemo({ locale }: Props) {
  return (
    <div className="sorare-stage">
      <div className="sorare-head">
        <div className="sorare-badge">IN DEVELOPMENT</div>
        <h3>{locale === 'de' ? 'Sorare NBA Edge Tool' : 'Sorare NBA edge tool'}</h3>
        <p>
          {locale === 'de'
            ? 'Datenprodukt fuer transparentere Entscheidungen: Projektionen, Optimierung und Szenario-Simulation.'
            : 'Data product for more transparent decisions: projections, optimization, and scenario simulation.'}
        </p>
      </div>
      <div className="sorare-grid">
        {METRICS.map((m) => (
          <div key={m.key} className="sorare-metric">
            <div className="sorare-key">{m.key}</div>
            <div className="sorare-value">{m.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
