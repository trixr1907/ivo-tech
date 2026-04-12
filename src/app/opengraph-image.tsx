import { ImageResponse } from 'next/og';

export const alt = 'ivo-tech — Technical Delivery ohne Blindflug';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #040509 0%, #0a0e1a 50%, #030610 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'system-ui, sans-serif',
          position: 'relative'
        }}
      >
        {/* Grid lines decoration */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(30,100,200,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,100,200,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />

        {/* Glow effect */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '200px',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(30,94,211,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)'
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '32px',
            position: 'relative'
          }}
        >
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              boxShadow: '0 0 8px #22c55e'
            }}
          />
          <span style={{ color: '#94a3b8', fontSize: '16px', letterSpacing: '0.05em' }}>
            Senior Web Engineer · Remote-first · Mannheim
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: '14px',
            fontSize: '56px',
            fontWeight: 700,
            lineHeight: 1.15,
            maxWidth: '900px',
            marginBottom: '28px',
            position: 'relative'
          }}
        >
          <span style={{ color: '#f1f5f9' }}>Technical Delivery</span>
          <span style={{ color: '#60a5fa' }}>ohne Blindflug</span>
        </div>

        {/* Sub-headline */}
        <div
          style={{
            fontSize: '24px',
            color: '#64748b',
            maxWidth: '760px',
            lineHeight: 1.5,
            marginBottom: '56px',
            position: 'relative'
          }}
        >
          Websysteme, die stabil laufen und klar konvertieren — mit QA-Gates, klarer Architektur und dokumentierter Übergabe.
        </div>

        {/* Metrics bar */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            position: 'relative'
          }}
        >
          {[
            { value: '3', label: 'Live-Systeme' },
            { value: '95+', label: 'Lighthouse-Score' },
            { value: '< 24h', label: 'Antwortzeit' }
          ].map((metric) => (
            <div
              key={metric.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <span style={{ fontSize: '32px', fontWeight: 700, color: '#f1f5f9' }}>{metric.value}</span>
              <span style={{ fontSize: '14px', color: '#475569', letterSpacing: '0.03em' }}>{metric.label}</span>
            </div>
          ))}
        </div>

        {/* Bottom brand */}
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
        >
          <span style={{ fontSize: '20px', fontWeight: 700, color: '#334155', letterSpacing: '0.08em' }}>
            ivo-tech.com
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
