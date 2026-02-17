import { useEffect, useRef, useState } from 'react';

import { ensureDld3dDeps } from '@/lib/ensureDld3dDeps';

import type { Locale } from '@/content/copy';

type Props = {
  locale: Locale;
};

export function Dld3dDemo({ locale }: Props) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    let disposed = false;
    let controller: { dispose?: () => void; resize?: () => void } | null = null;
    const timeouts: number[] = [];

    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (disposed) return;
        fn();
      }, ms);
      timeouts.push(id);
    };

    (async () => {
      await ensureDld3dDeps();
      if (disposed) return;

      if (!window.DLD3DConfigurator?.mount) {
        throw new Error('dld3d-core not loaded');
      }

      // Demo vars (client-side estimate only)
      const demoVars = {
        full_viewer_url: '',
        demo_model_url: '/assets/demo-cube.stl',
        demo_disable_upload: true,
        brand_logo_enabled: false,
        max_upload_mb: 60,

        // Pricing (Estimate): MaterialCost + Setup + PostProcess, then preset + margin + tier discount.
        setup_fee: 10.0,
        post_processing_fee: 1.5,
        margin: 1.25,
        min_price: 25.0,

        materials: {
          PLA: { name: 'PLA', density: 1.24, price_per_kg: 24.99 },
          PETG: { name: 'PETG', density: 1.27, price_per_kg: 29.99 },
          ABS: { name: 'ABS', density: 1.04, price_per_kg: 32.99 }
        },

        presets: {
          prototyp: {
            name: locale === 'de' ? 'Prototyp' : 'Prototype',
            factor: 0.9,
            infill: 12,
            layer_height: 0.24
          },
          standard: { name: 'Standard', factor: 1.0, infill: 18, layer_height: 0.2 },
          stabil: { name: locale === 'de' ? 'Stabil' : 'Sturdy', factor: 1.2, infill: 28, layer_height: 0.2 }
        },

        // Color catalog compatible with WP plugin format (by material, each row has group + enabled).
        colors: {
          PLA: [
            { name: 'Arctic White', hex: '#f2f2f2', enabled: 1, group: 'neutral' },
            { name: 'Void Black', hex: '#101014', enabled: 1, group: 'neutral' },
            { name: 'Cyan', hex: '#00f3ff', enabled: 1, group: 'color' },
            { name: 'Magenta', hex: '#ff00ff', enabled: 1, group: 'color' },
            { name: 'Sunset Orange', hex: '#ff9e00', enabled: 1, group: 'color' },
            { name: 'Metallic Silver', hex: '#bfc3c7', enabled: 1, group: 'metallic' }
          ],
          PETG: [
            { name: 'Arctic White', hex: '#f2f2f2', enabled: 1, group: 'neutral' },
            { name: 'Void Black', hex: '#101014', enabled: 1, group: 'neutral' },
            { name: 'Cyan', hex: '#00f3ff', enabled: 1, group: 'color' },
            { name: 'Magenta', hex: '#ff00ff', enabled: 1, group: 'color' },
            { name: 'Metallic Gold', hex: '#d4af37', enabled: 1, group: 'metallic' }
          ],
          ABS: [
            { name: 'Void Black', hex: '#101014', enabled: 1, group: 'neutral' },
            { name: 'Signal Gray', hex: '#8f8f8f', enabled: 1, group: 'neutral' },
            { name: 'Magenta', hex: '#ff00ff', enabled: 1, group: 'color' },
            { name: 'Metallic Bronze', hex: '#b08d57', enabled: 1, group: 'metallic' }
          ]
        },

        default_colors: {
          PLA: '#00f3ff',
          PETG: '#00f3ff',
          ABS: '#ff00ff'
        }
      };

      const strings =
        locale === 'de'
          ? {
              title: '3D CONFIGURATOR',
              subtitle_demo: 'STL / 3MF • WebGL Vorschau • Pricing (Demo)',
              rotate_title: 'Drehen',
              rotate_hint: 'Drag zum freien Drehen (Rotate Mode).',
              dimensions_label: 'Abmessungen (B x T x H)',
              volume_label: 'Volumen:',
              material_label: 'Material',
              quality_label: 'Qualitaet',
              color_label: 'Farbe',
              color_section_neutral: 'Neutral',
              color_section_color: 'Bunt',
              color_section_metallic: 'Metallic',
              color_empty: 'Keine Farben verfuegbar.',
              color_note: 'Farbabbildung nur zur Orientierung.',
              quantity_label: 'Stueckzahl',
              price_label: 'Preis',
              print_time_label: 'Druckzeit',
              leadtime_note: 'Vorbehaltlich technischer Machbarkeit.',
              watermark: '',
              price_hint_demo: 'Demo-Estimate: Volumen x Dichte (ohne Druckzeit).',
              price_hint_demo_short: 'Demo-Estimate: Volumen x Dichte.',
              status_ready_demo: 'Bereit.',
              status_ready_wp: 'Bereit.',
              status_loading_model: 'Lade Modell…',
              status_load_failed: 'Modell konnte nicht geladen werden.',
              status_home: 'Home.',
              status_auto_orient: 'Auto-Orient angewendet.',
              status_layflat: 'Plan angewendet.',
              status_rotate_on: 'Rotate Mode aktiv.',
              status_rotate_off: 'Rotate Mode aus.'
            }
          : {
              title: '3D CONFIGURATOR',
              subtitle_demo: 'STL / 3MF • WebGL preview • demo pricing',
              rotate_title: 'Rotate',
              rotate_hint: 'Drag to freely rotate (rotate mode).',
              dimensions_label: 'Dimensions (W x D x H)',
              volume_label: 'Volume:',
              material_label: 'Material',
              quality_label: 'Quality',
              color_label: 'Color',
              color_section_neutral: 'Neutral',
              color_section_color: 'Color',
              color_section_metallic: 'Metallic',
              color_empty: 'No colors available.',
              color_note: 'Color preview is for orientation only.',
              quantity_label: 'Quantity',
              price_label: 'Price',
              print_time_label: 'Print time',
              leadtime_note: 'Subject to technical feasibility.',
              watermark: '',
              price_hint_demo: 'Demo estimate: volume x density (no print time).',
              price_hint_demo_short: 'Demo estimate: volume x density.',
              status_ready_demo: 'Ready.',
              status_ready_wp: 'Ready.',
              status_loading_model: 'Loading model…',
              status_load_failed: 'Model could not be loaded.',
              status_home: 'Home.',
              status_auto_orient: 'Auto-orient applied.',
              status_layflat: 'Layflat applied.',
              status_rotate_on: 'Rotate mode on.',
              status_rotate_off: 'Rotate mode off.'
            };

      controller = window.DLD3DConfigurator.mount(mountEl, {
        mode: 'demo',
        theme: 'ivo-tech',
        vars: demoVars,
        strings,
        features: {
          serverPricing: false,
          serverAnalyze: false,
          convertEnabled: false,
          repairEnabled: false,
          woocommerceEnabled: false
        }
      });

      // Modal open transitions can report 0x0 sizes briefly.
      const resizeSafe = () => controller?.resize?.();
      requestAnimationFrame(resizeSafe);
      schedule(resizeSafe, 120);
      schedule(resizeSafe, 420);
    })().catch((e: unknown) => {
      const msg = e instanceof Error ? e.message : 'Unknown error';
      console.error('[Dld3dDemo] init failed:', e);
      setError(msg);
    });

    return () => {
      disposed = true;
      timeouts.forEach((id) => clearTimeout(id));
      try {
        controller?.dispose?.();
      } catch {
        // Best-effort cleanup.
      }
      controller = null;
      mountEl.innerHTML = '';
    };
  }, [locale]);

  return (
    <div className="dld3d-stage">
      {error ? <div className="demo-error">Error: {error}</div> : null}
      <div ref={mountRef} className="dld3d-mount" />
    </div>
  );
}
