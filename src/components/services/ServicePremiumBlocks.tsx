import type { Locale } from '@/content/copy';
import type { ServiceDetailSlug } from '@/content/services';

type ComparatorRow = {
  metric: string;
  before: string;
  after: string;
};

type RiskItem = {
  risk: string;
  impact: string;
  mitigation: string;
};

type ArchitectureItem = {
  layer: string;
  focus: string;
  control: string;
};

type PremiumBlocksContent = {
  comparatorTitle: string;
  comparatorIntro: string;
  comparatorRows: ComparatorRow[];
  riskTitle: string;
  riskIntro: string;
  riskItems: RiskItem[];
  architectureTitle: string;
  architectureIntro: string;
  architectureItems: ArchitectureItem[];
};

const premiumBlocksByLocale: Record<Locale, Record<ServiceDetailSlug, PremiumBlocksContent>> = {
  de: {
    'web-engineering-delivery': {
      comparatorTitle: 'Outcome-Komparator',
      comparatorIntro: 'Typisches Delta zwischen unstrukturiertem Status quo und fokussierter Delivery-Struktur.',
      comparatorRows: [
        { metric: 'Angebotsklarheit', before: 'Uneinheitlich je Seite', after: 'Konsistente Decision Story' },
        { metric: 'Release-Takt', before: 'Ad-hoc und risikoreich', after: 'Planbarer Sprint-Rhythmus' },
        { metric: 'Technische Stabilitaet', before: 'Regressionen nach Releases', after: 'QA-Gates pro Auslieferung' }
      ],
      riskTitle: 'Risk Matrix',
      riskIntro: 'Haeufige Delivery-Risiken inkl. Gegenmaßnahmen im Projektsetup.',
      riskItems: [
        { risk: 'Scope Drift', impact: 'Timeline kippt, Stakeholder verlieren Vertrauen', mitigation: 'Phase-Deliverables + Change-Lane mit Priorisierung' },
        { risk: 'Design-Implementation Gap', impact: 'Visuelle Inkonsistenz und Nacharbeiten', mitigation: 'Token-basierte Components + Review-Ritual je Sprint' },
        { risk: 'QA Debt', impact: 'Späte Fehler in kritischen Conversion-Pfaden', mitigation: 'Release-Gates fuer CTA-Flow, A11y und Performance' }
      ],
      architectureTitle: 'Architecture Snapshot',
      architectureIntro: 'Referenzbild fuer die operative Lieferarchitektur im laufenden Betrieb.',
      architectureItems: [
        { layer: 'Experience Layer', focus: 'Hero, Services, Case-Narrative', control: 'Komponenten + Content Hierarchie' },
        { layer: 'System Layer', focus: 'Routing, Tracking, Templates', control: 'Shared primitives + Event Taxonomie' },
        { layer: 'Operations Layer', focus: 'QA, Release, Monitoring', control: 'Checklists + Budget + Incident Loops' }
      ]
    },
    'ai-automation-workflows': {
      comparatorTitle: 'Outcome-Komparator',
      comparatorIntro: 'Vergleich zwischen manuellen Prozessketten und AI-unterstuetzter Delivery.',
      comparatorRows: [
        { metric: 'Review-Zeit', before: 'Mehrere manuelle Schleifen', after: 'Assistierte Vorqualifikation' },
        { metric: 'Handover-Aufwand', before: 'Fragmentierte Uebergaben', after: 'Standardisierte Workflow-Stufen' },
        { metric: 'Transparenz', before: 'Status nur ad-hoc sichtbar', after: 'Messbare Pipeline je Stage' }
      ],
      riskTitle: 'Risk Matrix',
      riskIntro: 'Kritische Risiken bei AI-Workflow-Einfuehrung und die passende Governance.',
      riskItems: [
        { risk: 'Automations-Overreach', impact: 'Falsche Entscheidungen ohne menschlichen Review', mitigation: 'Human-in-the-loop an Freigabepunkten' },
        { risk: 'Tool Fragmentierung', impact: 'Neue Silos statt Beschleunigung', mitigation: 'Flow-Mapping vor Tool-Integration' },
        { risk: 'Undokumentierte Regeln', impact: 'Skalierung bricht bei Teamwechsel', mitigation: 'Versionierte Workflow-Playbooks + Ownership' }
      ],
      architectureTitle: 'Architecture Snapshot',
      architectureIntro: 'Sichere AI-Workflow-Architektur fuer operative Teams.',
      architectureItems: [
        { layer: 'Assist Layer', focus: 'Prompt Chains, Summaries, Routing', control: 'Template Library + Guardrails' },
        { layer: 'Execution Layer', focus: 'APIs, Sync Jobs, Event Hooks', control: 'Schema Contracts + Retry Logic' },
        { layer: 'Governance Layer', focus: 'Freigaben, Audit, KPI Tracking', control: 'Role Model + Alerting + Reporting' }
      ]
    },
    '3d-visualization-systems': {
      comparatorTitle: 'Outcome-Komparator',
      comparatorIntro: 'Vergleich zwischen statischer Darstellung und integriertem 3D-Flow.',
      comparatorRows: [
        { metric: 'Produktverstaendnis', before: 'Viele Rueckfragen im Vertrieb', after: 'Selbsterklaerende Visualisierung' },
        { metric: 'Konfigurationsrate', before: 'Abbrueche bei Komplexitaet', after: 'Gefuehrte Variantenauswahl' },
        { metric: 'Commercial Handover', before: 'Bruch zwischen Viewer und Angebot', after: 'Direkter Pfad zu Preis/Checkout' }
      ],
      riskTitle: 'Risk Matrix',
      riskIntro: 'Haeufige Risiken bei 3D-Projekten mit kommerziellem Anspruch.',
      riskItems: [
        { risk: 'Render Overload', impact: 'Langsame First Interaction', mitigation: 'Asset Budget + Lazy Loading + LOD-Strategie' },
        { risk: 'UX-Komplexitaet', impact: 'Nutzer verlieren Orientierung', mitigation: 'Step-by-step Configuration Pattern' },
        { risk: 'Backend Entkopplung', impact: 'Konfiguration ohne kaufnahe Konsequenz', mitigation: 'API-Contracts fuer Preis- und Angebotslogik' }
      ],
      architectureTitle: 'Architecture Snapshot',
      architectureIntro: 'Referenzstruktur fuer stabile 3D Delivery im Produktkontext.',
      architectureItems: [
        { layer: 'Visual Layer', focus: 'Viewer, Materials, Interaction', control: 'Render Budgets + UX States' },
        { layer: 'Config Layer', focus: 'Variant Rules, Option Logic', control: 'Deterministic Rules + Validation' },
        { layer: 'Commerce Layer', focus: 'Pricing, Cart, Lead Routing', control: 'Typed API Contracts + Tracking' }
      ]
    }
  },
  en: {
    'web-engineering-delivery': {
      comparatorTitle: 'Outcome Comparator',
      comparatorIntro: 'Typical delta between an unstructured baseline and a focused delivery system.',
      comparatorRows: [
        { metric: 'Offer clarity', before: 'Inconsistent across pages', after: 'Consistent decision narrative' },
        { metric: 'Release cadence', before: 'Ad hoc and risky', after: 'Predictable sprint rhythm' },
        { metric: 'Technical stability', before: 'Regression after releases', after: 'QA gates per release' }
      ],
      riskTitle: 'Risk Matrix',
      riskIntro: 'Frequent delivery risks and practical mitigations inside the project model.',
      riskItems: [
        { risk: 'Scope drift', impact: 'Timeline slips, trust drops', mitigation: 'Phase deliverables plus explicit change lane' },
        { risk: 'Design-implementation gap', impact: 'Visual inconsistency and rework', mitigation: 'Tokenized components plus sprint review ritual' },
        { risk: 'QA debt', impact: 'Late defects in critical conversion paths', mitigation: 'Release gates for CTA flows, a11y, and performance' }
      ],
      architectureTitle: 'Architecture Snapshot',
      architectureIntro: 'Reference architecture for day-to-day delivery operations.',
      architectureItems: [
        { layer: 'Experience layer', focus: 'Hero, services, case narrative', control: 'Components + content hierarchy' },
        { layer: 'System layer', focus: 'Routing, tracking, templates', control: 'Shared primitives + event taxonomy' },
        { layer: 'Operations layer', focus: 'QA, release, monitoring', control: 'Checklists + budget + incident loops' }
      ]
    },
    'ai-automation-workflows': {
      comparatorTitle: 'Outcome Comparator',
      comparatorIntro: 'Comparison of manual process chains vs AI-assisted delivery.',
      comparatorRows: [
        { metric: 'Review time', before: 'Multiple manual loops', after: 'Assisted pre-qualification' },
        { metric: 'Handover overhead', before: 'Fragmented transfers', after: 'Standardized workflow stages' },
        { metric: 'Transparency', before: 'Status visible only ad hoc', after: 'Measurable pipeline by stage' }
      ],
      riskTitle: 'Risk Matrix',
      riskIntro: 'Critical risks in AI workflow rollout and the matching governance model.',
      riskItems: [
        { risk: 'Automation overreach', impact: 'Wrong decisions without human review', mitigation: 'Human-in-the-loop at approval points' },
        { risk: 'Tool fragmentation', impact: 'New silos instead of speed', mitigation: 'Flow mapping before tool integration' },
        { risk: 'Undocumented rules', impact: 'Scaling breaks when teams change', mitigation: 'Versioned workflow playbooks + ownership' }
      ],
      architectureTitle: 'Architecture Snapshot',
      architectureIntro: 'Safe AI workflow architecture for delivery teams.',
      architectureItems: [
        { layer: 'Assist layer', focus: 'Prompt chains, summaries, routing', control: 'Template library + guardrails' },
        { layer: 'Execution layer', focus: 'APIs, sync jobs, event hooks', control: 'Schema contracts + retry logic' },
        { layer: 'Governance layer', focus: 'Approvals, audit, KPI tracking', control: 'Role model + alerting + reporting' }
      ]
    },
    '3d-visualization-systems': {
      comparatorTitle: 'Outcome Comparator',
      comparatorIntro: 'Comparison of static product communication vs integrated 3D flows.',
      comparatorRows: [
        { metric: 'Product understanding', before: 'Many sales follow-up questions', after: 'Self-explanatory visualization' },
        { metric: 'Configuration completion', before: 'Drop-off under complexity', after: 'Guided option flow' },
        { metric: 'Commercial handover', before: 'Break between viewer and offer', after: 'Direct path to price and checkout' }
      ],
      riskTitle: 'Risk Matrix',
      riskIntro: 'Frequent risks in commercially relevant 3D delivery.',
      riskItems: [
        { risk: 'Render overload', impact: 'Slow first interaction', mitigation: 'Asset budget, lazy loading, and LOD strategy' },
        { risk: 'UX complexity', impact: 'Users lose orientation', mitigation: 'Step-by-step configuration pattern' },
        { risk: 'Backend disconnect', impact: 'Configuration without commercial effect', mitigation: 'API contracts for pricing and quoting logic' }
      ],
      architectureTitle: 'Architecture Snapshot',
      architectureIntro: 'Reference structure for stable 3D delivery in product flows.',
      architectureItems: [
        { layer: 'Visual layer', focus: 'Viewer, materials, interaction', control: 'Render budgets + UX states' },
        { layer: 'Config layer', focus: 'Variant rules, option logic', control: 'Deterministic rules + validation' },
        { layer: 'Commerce layer', focus: 'Pricing, cart, lead routing', control: 'Typed API contracts + tracking' }
      ]
    }
  }
};

type ServicePremiumBlocksProps = {
  locale: Locale;
  slug: ServiceDetailSlug;
};

export function ServicePremiumBlocks({ locale, slug }: ServicePremiumBlocksProps) {
  const content = premiumBlocksByLocale[locale][slug];

  return (
    <>
      <section className="service-premium-block service-premium-block--comparator" aria-labelledby="service-detail-comparator">
        <div className="section-head">
          <h2 id="service-detail-comparator" className="text-ink-900">
            {content.comparatorTitle}
          </h2>
          <p className="text-ink-700">{content.comparatorIntro}</p>
        </div>
        <div className="service-premium-table overflow-x-auto rounded-2xl border border-slate-200 bg-white/90 p-1">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-ink-700">
                <th className="px-4 py-3">{locale === 'de' ? 'Bereich' : 'Dimension'}</th>
                <th className="px-4 py-3">{locale === 'de' ? 'Vorher' : 'Before'}</th>
                <th className="px-4 py-3">{locale === 'de' ? 'Nachher' : 'After'}</th>
              </tr>
            </thead>
            <tbody>
              {content.comparatorRows.map((row) => (
                <tr key={row.metric} className="border-b border-slate-100 last:border-b-0">
                  <td className="px-4 py-3 font-semibold text-ink-900">{row.metric}</td>
                  <td className="px-4 py-3 text-ink-700">{row.before}</td>
                  <td className="px-4 py-3 text-ink-900">{row.after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="service-premium-block service-premium-block--risk" aria-labelledby="service-detail-risk-matrix">
        <div className="section-head">
          <h2 id="service-detail-risk-matrix" className="text-ink-900">
            {content.riskTitle}
          </h2>
          <p className="text-ink-700">{content.riskIntro}</p>
        </div>
        <div className="insights-grid insights-grid-page service-premium-risk-grid">
          {content.riskItems.map((risk) => (
            <article key={risk.risk} className="insight-card text-ink-700">
              <h3 className="text-ink-900">{risk.risk}</h3>
              <p className="text-ink-700">
                <strong>{locale === 'de' ? 'Impact:' : 'Impact:'}</strong> {risk.impact}
              </p>
              <p className="text-ink-700">
                <strong>{locale === 'de' ? 'Mitigation:' : 'Mitigation:'}</strong> {risk.mitigation}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="service-premium-block service-premium-block--architecture" aria-labelledby="service-detail-architecture-snapshot">
        <div className="section-head">
          <h2 id="service-detail-architecture-snapshot" className="text-ink-900">
            {content.architectureTitle}
          </h2>
          <p className="text-ink-700">{content.architectureIntro}</p>
        </div>
        <div className="insights-grid insights-grid-page service-premium-architecture-grid">
          {content.architectureItems.map((item) => (
            <article key={item.layer} className="insight-card text-ink-700">
              <span className="insight-meta">{item.layer}</span>
              <h3 className="text-ink-900">{item.focus}</h3>
              <p className="text-ink-700">{item.control}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
