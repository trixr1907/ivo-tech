import type { Locale } from '@/content/copy';

type Props = {
  locale: Locale;
};

export function VoicebotDemo({ locale }: Props) {
  const flow =
    locale === 'de'
      ? ['Call startet', 'Consent-Dialog', 'Speech-Verarbeitung', 'Audit-Event + Ergebnis']
      : ['Call starts', 'Consent dialog', 'Speech processing', 'Audit event + outcome'];

  const tags = ['FASTAPI', 'SPEECH API', 'TWILIO', 'QA'];

  return (
    <div className="voicebot-stage">
      <div className="voicebot-header">
        <div className="voicebot-badge">PRIVATE BETA</div>
        <h3>{locale === 'de' ? 'Voicebot Einwilligungs-Orchestrator' : 'Voicebot consent orchestrator'}</h3>
        <p>
          {locale === 'de'
            ? 'Mehrstufige Orchestrierung fuer DE/EU-Consent-Flows mit Agent-Companion und Test-Pipeline.'
            : 'Multi-step orchestration for DE/EU consent flows with an agent companion and test pipeline.'}
        </p>
      </div>

      <ol className="voicebot-flow">
        {flow.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>

      <div className="voicebot-tags" aria-label="Voicebot stack tags">
        {tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </div>
  );
}
