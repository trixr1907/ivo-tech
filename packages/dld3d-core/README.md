# dld3d-core

Shared, framework-less 3D configurator core used by:

- `ivo-tech.com` (Modal demo mode)
- WordPress plugin `dld-3d-configurator` (WP mode)

## Public API

The bundle exposes a global:

- `window.DLD3DConfigurator.mount(mountEl, config) -> controller`

Controller methods:

- `controller.dispose()`
- `controller.resize()`

## Config

```js
const controller = window.DLD3DConfigurator.mount(document.getElementById('mount'), {
  mode: 'demo', // 'demo' | 'wp'
  theme: 'ivo-tech', // 'dld' | 'ivo-tech'
  strings: {
    // Optional UI text overrides (plain strings).
    // Example keys:
    title: '3D CONFIGURATOR',
    action_demo: 'OPEN FULL VIEWER',
  },
  vars: {
    // Demo:
    materials: { PLA: { name: 'PLA', density: 1.24, price_per_kg: 24.99 } },
    presets: { standard: { name: 'Standard', factor: 1.0 } },
    colors: { PLA: [{ name: 'Neon Cyan', hex: '#00f3ff', group: 'color', enabled: 1 }] },
    default_colors: { PLA: '#00f3ff' },
    setup_fee: 10,
    post_processing_fee: 1.5,
    margin: 1.25,
    min_price: 25,
    max_upload_mb: 50,
    full_viewer_url: 'https://viewer.ivo-tech.com',
    demo_model_url: '/assets/demo-cube.stl',
    demo_model_filename: 'demo-cube.stl',
    demo_disable_upload: true,
    brand_logo_enabled: false,

    // WP mode (optional):
    ajax_url: '/wp-admin/admin-ajax.php',
    calc_nonce: '...',
    wc_nonce: '...',
    wc_enabled: false,
    request_url: '',
    request_email: '',
  },
  features: {
    serverPricing: false,
    serverAnalyze: false,
    convertEnabled: false,
    repairEnabled: false,
    woocommerceEnabled: false,
  },
});
```

## Notes

- Requires global `THREE`, `THREE.OrbitControls`, `THREE.STLLoader`, `THREE.ThreeMFLoader`.
- For 3MF support you must also load `JSZip` and `fflate` before `ThreeMFLoader`.
- Recommended: mount only one instance per page (WP shortcode should be used once per page).
