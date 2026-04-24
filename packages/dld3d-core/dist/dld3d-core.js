/* dld3d-core.js
   Shared core for ivo-tech modal demo + WordPress plugin.
   Dependencies (globals):
   - THREE
   - THREE.OrbitControls
   - THREE.STLLoader
   - THREE.ThreeMFLoader (requires JSZip + fflate loaded beforehand)
*/

(function () {
  'use strict';

  var GLOBAL_KEY = 'DLD3DConfigurator';

  var DEFAULT_STRINGS = {
    title: '3D CONFIGURATOR',
    subtitle_demo: 'STL / 3MF • WebGL Preview • Pricing Estimate',
    subtitle_wp: 'STL / 3MF • WebGL Preview • Server Pricing',

    header_link_demo: 'FULL VIEWER',
    header_link_wp: 'VIEWER',

    upload_heading: 'Datei hier ablegen',
    upload_subheading: 'oder auswaehlen',
    upload_formats: 'Unterstuetzt: STL, 3MF',
    browse_button: 'Datei auswaehlen',

    watermark: 'IVO TECH 3D ENGINE // DEV. IVO',

    analyze_badge: 'Modell-Check',
    analyze_ready: 'Bereit.',
    analyze_details: 'Details',

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

    action_demo: 'OPEN FULL VIEWER',
    action_add_to_cart: 'In den Warenkorb',
    action_checkout: 'Zum Checkout',
    action_request: 'Anfrage senden',

    legal_text: 'Ich bestaetige, dass ich alle erforderlichen Rechte zur Herstellung der Datei besitze.',

    price_hint_demo: 'Demo-Estimate: Volumen x Dichte (ohne Druckzeit).',
    price_hint_demo_short: 'Demo-Estimate: basiert auf Volumen x Dichte.',

    status_ready_demo: 'Bereit. Lade eine STL/3MF Datei.',
    status_ready_wp: 'Bereit.',
    status_loading_model: 'Lade Modell…',
    status_invalid_format: 'Ungueltiges Format. Erlaubt: STL, 3MF',
    status_file_too_large: 'Datei zu gross. Max {max} MB.',
    status_load_failed: 'Modell konnte nicht geladen werden.',
    status_read_error: 'Fehler beim Lesen der Datei.',
    status_load_error: 'Fehler beim Laden.',
    status_home: 'Home.',
    status_auto_orient: 'Auto-Orient angewendet.',
    status_layflat: 'Plan angewendet.',
    status_rotate_on: 'Rotate Mode aktiv.',
    status_rotate_off: 'Rotate Mode aus.',
    status_need_model_first: 'Bitte zuerst ein Modell hochladen.',
    status_need_price_recalc: 'Preis bitte neu berechnen.',
    status_add_to_cart_start: 'Wird in den Warenkorb gelegt…',
    status_add_to_cart_failed: 'Konnte nicht zum Warenkorb hinzufuegen.',
    status_network_error: 'Netzwerkfehler.',
    status_calc_running: 'Berechnung laeuft…',
    status_calc_done: 'Berechnung fertig.',
    status_price_update: 'Preis wird aktualisiert…',
    status_price_updated: 'Preis aktualisiert.',
    status_request_missing: 'Bitte Anfrage-URL oder E-Mail hinterlegen.'
  };

  function noop() {}

  function isObject(x) {
    return !!x && typeof x === 'object' && !Array.isArray(x);
  }

  function escapeHtml(input) {
    var s = String(input == null ? '' : input);
    return s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function normalizeStrings(userStrings) {
    var out = {};
    Object.keys(DEFAULT_STRINGS).forEach(function (k) {
      out[k] = DEFAULT_STRINGS[k];
    });
    if (isObject(userStrings)) {
      Object.keys(userStrings).forEach(function (k) {
        if (userStrings[k] == null) return;
        out[k] = String(userStrings[k]);
      });
    }
    return out;
  }

  function formatTemplate(str, params) {
    var s = String(str == null ? '' : str);
    if (!params) return s;
    return s.replace(/\{(\w+)\}/g, function (_m, key) {
      if (params[key] == null) return '{' + key + '}';
      return String(params[key]);
    });
  }

  function parseBoolStrict(input) {
    if (input === true) return true;
    if (input === false) return false;
    if (input === 1 || input === '1') return true;
    if (input === 0 || input === '0') return false;
    if (typeof input === 'string') {
      var s = input.trim().toLowerCase();
      if (s === 'true') return true;
      if (s === 'false') return false;
    }
    return null;
  }

  function clamp(n, min, max) {
    return Math.max(min, Math.min(max, n));
  }

  function getPrefersReducedMotion() {
    try {
      return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    } catch (_e) {
      return false;
    }
  }

  function formatEUR(value, opts) {
    var o = opts || {};
    if (!isFinite(value)) return '-';
    var decimals = typeof o.decimals === 'number' ? o.decimals : 0;
    try {
      return value.toLocaleString('de-DE', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      }) + ' €';
    } catch (_e) {
      var s = value.toFixed(decimals);
      return s.replace('.', ',') + ' €';
    }
  }

  function createEl(tag, attrs) {
    var el = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === 'class') el.className = attrs[k];
        else if (k === 'text') el.textContent = attrs[k];
        else if (k === 'html') el.innerHTML = attrs[k];
        else el.setAttribute(k, attrs[k]);
      });
    }
    return el;
  }

  function safePick(obj, key, fallback) {
    if (!obj || typeof obj !== 'object') return fallback;
    return obj[key] != null ? obj[key] : fallback;
  }

  function normalizeTheme(theme) {
    if (theme === 'ivo-tech' || theme === 'dld') return theme;
    return 'dld';
  }

  function normalizeMode(mode) {
    if (mode === 'wp' || mode === 'demo') return mode;
    return 'demo';
  }

  function mergeFeatures(mode, vars, features) {
    var v = vars || {};
    var f = isObject(features) ? features : {};

    var canAjax = typeof v.ajax_url === 'string' && v.ajax_url.length > 0;

    var defaults = {
      serverPricing: mode === 'wp' && canAjax && typeof v.calc_nonce === 'string' && v.calc_nonce.length > 0,
      serverAnalyze: mode === 'wp' && canAjax && typeof v.analyze_nonce === 'string' && v.analyze_nonce.length > 0,
      convertEnabled: mode === 'wp' && canAjax && typeof v.convert_nonce === 'string' && v.convert_nonce.length > 0,
      repairEnabled: mode === 'wp' && canAjax && typeof v.repair_nonce === 'string' && v.repair_nonce.length > 0,
      woocommerceEnabled: mode === 'wp' && !!v.wc_enabled && canAjax && typeof v.wc_nonce === 'string' && v.wc_nonce.length > 0
    };

    var out = {};
    Object.keys(defaults).forEach(function (k) {
      out[k] = typeof f[k] === 'boolean' ? f[k] : defaults[k];
    });

    return out;
  }

  function renderMarkup(mode, strings) {
    // Shared markup (WP mode shows extra panels via CSS + feature flags).
    // Keep ids stable: only one instance per page is assumed.
    var accept = '.stl,.3mf';
    var s = strings || DEFAULT_STRINGS;
    var subtitle = mode === 'demo' ? s.subtitle_demo : s.subtitle_wp;

    return (
      '' +
      '<div class="dld3d-wrapper">' +
      '  <div class="dld3d-header">' +
      '    <div>' +
      '      <p class="dld3d-title">' + escapeHtml(s.title) + '</p>' +
      '      <p class="dld3d-subtitle">' + escapeHtml(subtitle) + '</p>' +
      '    </div>' +
      '    <div class="dld-demo-actions" id="dld-demo-actions"></div>' +
      '  </div>' +
      '  <div class="dld3d-main">' +
      '    <div id="dld-analyze-panel" class="dld-analyze-panel" aria-live="polite">' +
      '      <div class="dld-analyze-header">' +
      '        <span class="dld-analyze-badge">' + escapeHtml(s.analyze_badge) + '</span>' +
      '        <span id="dld-analyze-status" class="dld-analyze-status">' + escapeHtml(s.analyze_ready) + '</span>' +
      '        <button type="button" class="dld-analyze-toggle" id="dld-analyze-toggle" aria-expanded="false" aria-controls="dld-analyze-list">' + escapeHtml(s.analyze_details) + '</button>' +
      '      </div>' +
      '      <ul id="dld-analyze-list" class="dld-analyze-list" hidden></ul>' +
      '      <div class="dld-analyze-actions">' +
      '        <div id="dld-repair-panel" class="dld-inline-panel" style="display:none;">' +
      '          <div id="dld-repair-message" class="dld-inline-message">Auto-Reparatur empfohlen.</div>' +
      '          <button type="button" class="dld-btn dld-btn-secondary" id="dld-repair-btn">Reparieren</button>' +
      '        </div>' +
      '        <div id="dld-convert-panel" class="dld-inline-panel" style="display:none;">' +
      '          <div id="dld-convert-message" class="dld-inline-message">Konvertierung empfohlen.</div>' +
      '          <a id="dld-convert-link" class="dld-btn dld-btn-secondary" href="#" target="_blank" rel="noopener noreferrer">Konvertieren</a>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '' +
      '    <div id="dld-viewer-container">' +
      '      <div class="dld-viewer-left">' +
      '        <div id="dld-3d-canvas">' +
      '          <div id="dld-3d-scene"></div>' +
      '' +
      '          <div class="dld-upload-zone" id="dld-drop-zone" role="button" tabindex="0" aria-label="3D Datei hochladen">' +
      '            <p class="dld-upload-text"><strong>' +
      escapeHtml(s.upload_heading) +
      '</strong><br>' +
      escapeHtml(s.upload_subheading) +
      '<br><span style="font-size:0.8em; opacity:0.8;">' +
      escapeHtml(s.upload_formats) +
      '</span></p>' +
      '            <input type="file" id="dld-file-input" accept="' + accept + '" hidden>' +
      '            <button type="button" class="dld-btn dld-btn-primary" id="dld-browse-btn">' + escapeHtml(s.browse_button) + '</button>' +
      '          </div>' +
      '' +
      '          <div class="dld-watermark" aria-hidden="true">' + escapeHtml(s.watermark) + '</div>' +
      '' +
      '          <div class="dld-canvas-controls" role="toolbar" aria-label="Modellfunktionen">' +
      '            <div class="dld-toolbar-group" role="group" aria-label="Ansicht">' +
      '              <button id="dld-home-btn" type="button" class="dld-control-btn" aria-label="Home / Zuruecksetzen" title="Home" data-tip="Home">' +
      '                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 11l9-8 9 8v10a2 2 0 0 1-2 2h-4v-6H9v6H5a2 2 0 0 1-2-2V11z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>' +
      '                <span class="dld-sr-only">Home</span>' +
      '              </button>' +
      '            </div>' +
      '            <div class="dld-toolbar-group" role="group" aria-label="Ausrichtung">' +
      '              <button id="dld-auto-orient-btn" type="button" class="dld-control-btn" aria-label="Auto ausrichten" title="Auto" data-tip="Auto-Orient">' +
      '                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '                <span class="dld-sr-only">Auto-Orient</span>' +
      '              </button>' +
      '              <button id="dld-layflat-btn" type="button" class="dld-control-btn" aria-label="Plan" title="Plan" data-tip="Layflat">' +
      '                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M4 19h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 3v10" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 11l4 4 4-4" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      '                <span class="dld-sr-only">Layflat</span>' +
      '              </button>' +
      '            </div>' +
      '            <div class="dld-toolbar-group" role="group" aria-label="Bearbeiten">' +
      '              <button id="dld-rotate-btn" type="button" class="dld-control-btn" aria-label="Rotate" title="Rotate" data-tip="Rotate" aria-pressed="false" aria-expanded="false" aria-controls="dld-rotate-panel">' +
      '                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M21 6v6h-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M21 12a9 9 0 1 1-3-6.7" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '                <span class="dld-sr-only">Rotate</span>' +
      '              </button>' +
      '            </div>' +
      '            <div class="dld-toolbar-group" role="group" aria-label="Datei">' +
      '              <button id="dld-remove-file-btn" type="button" class="dld-control-btn danger" aria-label="Loeschen" title="Reset" data-tip="Reset Datei">' +
      '                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 6h18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 6V4h8v2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M6 6l1 15h10l1-15" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M10 11v6M14 11v6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
      '                <span class="dld-sr-only">Reset Datei</span>' +
      '              </button>' +
      '            </div>' +
      '          </div>' +
      '' +
      '          <div id="dld-rotate-panel" class="dld-rotate-panel" aria-hidden="true">' +
      '            <div class="dld-rotate-title">' + escapeHtml(s.rotate_title) + '</div>' +
      '            <div class="dld-rotate-actions">' +
      '              <button type="button" class="dld-rotate-btn" id="dld-rot-x" aria-label="X 90deg">X 90deg</button>' +
      '              <button type="button" class="dld-rotate-btn" id="dld-rot-y" aria-label="Y 90deg">Y 90deg</button>' +
      '              <button type="button" class="dld-rotate-btn" id="dld-rot-z" aria-label="Z 90deg">Z 90deg</button>' +
      '            </div>' +
      '            <div class="dld-rotate-hint">' + escapeHtml(s.rotate_hint) + '</div>' +
      '          </div>' +
      '        </div>' +
      '' +
      '        <div class="dld-dimensions-box dld-dimensions-box--left">' +
      '          <p class="dld-dimensions-label">' + escapeHtml(s.dimensions_label) + '</p>' +
      '          <p class="dld-dimensions-value" id="dld-dimensions">-</p>' +
      '          <p class="dld-dimensions-meta">' + escapeHtml(s.volume_label) + ' <span id="dld-volume">-</span> cm3</p>' +
      '        </div>' +
      '      </div>' +
      '' +
      '      <div id="dld-controls">' +
      '        <div id="dld-progress-bar-container"><div id="dld-progress-bar"></div></div>' +
      '        <div id="dld-info-panel">' +
      '          <h3 id="dld-filename">-</h3>' +
      '' +
      '          <div class="dld-field-group">' +
      '            <span class="dld-field-label">' + escapeHtml(s.material_label) + '</span>' +
      '            <div class="dld-radio-group" id="dld-material-group"></div>' +
      '          </div>' +
      '' +
      '          <div class="dld-field-group">' +
      '            <span class="dld-field-label">' + escapeHtml(s.quality_label) + '</span>' +
      '            <div class="dld-radio-group" id="dld-quality-group"></div>' +
      '          </div>' +
      '' +
      '          <div class="dld-field-group">' +
      '            <span class="dld-field-label">' + escapeHtml(s.color_label) + '</span>' +
      '            <div class="dld-color-selected" id="dld-color-selected" aria-live="polite" aria-atomic="true">' +
      '              <span class="dld-color-selected-swatch" id="dld-color-selected-swatch" aria-hidden="true"></span>' +
      '              <span class="dld-color-selected-name" id="dld-color-selected-name">-</span>' +
      '              <span class="dld-color-selected-hex" id="dld-color-selected-hex">#----</span>' +
      '            </div>' +
      '            <div class="dld-color-section" data-color-group="neutral">' +
      '              <div class="dld-color-title">' + escapeHtml(s.color_section_neutral) + '</div>' +
      '              <div class="dld-color-grid" id="dld-color-grid-neutral"></div>' +
      '            </div>' +
      '            <div class="dld-color-section" data-color-group="color">' +
      '              <div class="dld-color-title">' + escapeHtml(s.color_section_color) + '</div>' +
      '              <div class="dld-color-grid" id="dld-color-grid-color"></div>' +
      '            </div>' +
      '            <div class="dld-color-section" data-color-group="metallic">' +
      '              <div class="dld-color-title">' + escapeHtml(s.color_section_metallic) + '</div>' +
      '              <div class="dld-color-grid" id="dld-color-grid-metallic"></div>' +
      '            </div>' +
      '            <p class="dld-note" id="dld-color-empty" style="display:none;">' + escapeHtml(s.color_empty) + '</p>' +
      '            <p class="dld-note">' + escapeHtml(s.color_note) + '</p>' +
      '          </div>' +
      '' +
      '          <div class="dld-field-group">' +
      '            <label class="dld-field-label" for="dld-quantity">' + escapeHtml(s.quantity_label) + '</label>' +
      '            <input type="number" id="dld-quantity" class="dld-select" value="1" min="1" max="100" step="1" inputmode="numeric" pattern="[0-9]*">' +
      '          </div>' +
      '' +
      '          <div class="dld-price-box">' +
      '            <div class="dld-price-row"><span>' + escapeHtml(s.price_label) + '</span><span id="dld-price">- €</span></div>' +
      '            <div class="dld-price-row dld-print-time-row"><span>' + escapeHtml(s.print_time_label) + '</span><span id="dld-print-time">-</span></div>' +
      '            <div id="dld-leadtime-note" class="dld-note">' + escapeHtml(s.leadtime_note) + '</div>' +
      '            <div id="dld-price-hint" class="dld-price-hint"></div>' +
      '          </div>' +
      '' +
      '          <div class="dld-legal-check" id="dld-legal-check" style="margin-top: 8px; margin-bottom: 4px; display:none;">' +
      '            <label style="display:flex; align-items:start; gap: 8px; font-size:0.85em; cursor:pointer;">' +
      '              <input type="checkbox" id="dld-legal-checkbox" style="margin-top:3px;">' +
      '              <span>' + escapeHtml(s.legal_text) + '</span>' +
      '            </label>' +
      '          </div>' +
      '' +
      '          <button type="button" class="dld-btn dld-btn-primary" id="dld-upload-btn">' +
      escapeHtml(mode === 'demo' ? s.action_demo : s.action_request) +
      '</button>' +
      '          <p id="dld-upload-status" role="status" aria-live="polite"></p>' +
      '        </div>' +
      '      </div>' +
      '    </div>' +
      '  </div>' +
      '</div>'
    );
  }

  function hasThreeDeps() {
    return (
      typeof window.THREE !== 'undefined' &&
      window.THREE &&
      typeof window.THREE.OrbitControls !== 'undefined' &&
      typeof window.THREE.STLLoader !== 'undefined' &&
      typeof window.THREE.ThreeMFLoader !== 'undefined'
    );
  }

  function hasGltfLoader() {
    return typeof window.THREE !== 'undefined' && window.THREE && typeof window.THREE.GLTFLoader !== 'undefined';
  }

  function disposeMaterial(mat, disposed) {
    if (!mat) return;
    if (disposed && disposed.has(mat)) return;
    if (disposed) disposed.add(mat);

    var maps = [
      'map',
      'lightMap',
      'aoMap',
      'emissiveMap',
      'bumpMap',
      'normalMap',
      'displacementMap',
      'roughnessMap',
      'metalnessMap',
      'alphaMap',
      'envMap'
    ];
    for (var i = 0; i < maps.length; i++) {
      var key = maps[i];
      if (mat[key] && mat[key].dispose) mat[key].dispose();
    }
    if (mat.dispose) mat.dispose();
  }

  function disposeObject3D(obj) {
    if (!obj || !obj.traverse) return;
    var disposed = new Set();
    obj.traverse(function (child) {
      if (child.geometry && child.geometry.dispose) child.geometry.dispose();
      if (child.material) {
        if (Array.isArray(child.material)) {
          for (var i = 0; i < child.material.length; i++) disposeMaterial(child.material[i], disposed);
        } else {
          disposeMaterial(child.material, disposed);
        }
      }
    });
  }

  function computeGeometryVolume(geometry) {
    // Returns volume in geometry units^3 (assumes triangles are oriented consistently).
    if (!geometry || !geometry.isBufferGeometry) return 0;
    var posAttr = geometry.attributes && geometry.attributes.position;
    if (!posAttr) return 0;

    var index = geometry.index;
    var triCount = (index ? index.count : posAttr.count) / 3;
    var detSum = 0;

    // Fast path: avoid Vector3 allocations.
    for (var i = 0; i < triCount; i++) {
      var i0 = i * 3;
      var a = index ? index.getX(i0) : i0;
      var b = index ? index.getX(i0 + 1) : i0 + 1;
      var c = index ? index.getX(i0 + 2) : i0 + 2;

      var ax = posAttr.getX(a), ay = posAttr.getY(a), az = posAttr.getZ(a);
      var bx = posAttr.getX(b), by = posAttr.getY(b), bz = posAttr.getZ(b);
      var cx = posAttr.getX(c), cy = posAttr.getY(c), cz = posAttr.getZ(c);

      // det = p1 . (p2 x p3)
      var cpX = by * cz - bz * cy;
      var cpY = bz * cx - bx * cz;
      var cpZ = bx * cy - by * cx;
      detSum += ax * cpX + ay * cpY + az * cpZ;
    }

    return Math.abs(detSum) / 6.0;
  }

  function computeObjectVolumeMm3(object3d) {
    if (!object3d || !object3d.traverse) return 0;
    var total = 0;
    object3d.traverse(function (child) {
      if (!child.isMesh || !child.geometry) return;
      var geo = child.geometry;
      var baseVolume = computeGeometryVolume(geo); // in local units^3
      if (!baseVolume) return;

      var s = new THREE.Vector3();
      child.getWorldScale(s);
      total += baseVolume * Math.abs(s.x * s.y * s.z);
    });
    return total;
  }

  function clamp01(x) {
    return clamp(x, 0, 1);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - clamp01(t), 3);
  }

  function createCanvasTextTexture(text, opts) {
    var o = opts || {};
    var w = o.width || 1024;
    var h = o.height || 256;
    var canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    var ctx = canvas.getContext('2d');
    if (!ctx) return null;

    ctx.clearRect(0, 0, w, h);

    var pad = o.pad || 34;
    var radius = o.radius || 34;
    var bgAlpha = typeof o.bgAlpha === 'number' ? o.bgAlpha : 0.10;
    var strokeAlpha = typeof o.strokeAlpha === 'number' ? o.strokeAlpha : 0.28;
    var bg = o.bg || '0,0,0';
    var stroke = o.stroke || '255,255,255';

    // Rounded rect background
    ctx.beginPath();
    ctx.moveTo(pad + radius, pad);
    ctx.arcTo(w - pad, pad, w - pad, h - pad, radius);
    ctx.arcTo(w - pad, h - pad, pad, h - pad, radius);
    ctx.arcTo(pad, h - pad, pad, pad, radius);
    ctx.arcTo(pad, pad, w - pad, pad, radius);
    ctx.closePath();
    ctx.fillStyle = 'rgba(' + bg + ',' + bgAlpha + ')';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(' + stroke + ',' + strokeAlpha + ')';
    ctx.stroke();

    var font = o.font || '800 78px Orbitron, system-ui, sans-serif';
    ctx.font = font;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Glow
    ctx.shadowColor = o.glow || 'rgba(0,243,255,0.65)';
    ctx.shadowBlur = o.shadowBlur || 26;
    ctx.fillStyle = o.color || 'rgba(255,255,255,0.96)';
    ctx.fillText(String(text || ''), w / 2, h / 2 + 6);

    // Crisp top layer
    ctx.shadowBlur = 0;
    ctx.fillStyle = o.color2 || 'rgba(255,255,255,0.98)';
    ctx.fillText(String(text || ''), w / 2, h / 2 + 6);

    var tex = new THREE.CanvasTexture(canvas);
    tex.anisotropy = 4;
    tex.needsUpdate = true;
    return tex;
  }

  function createBrandLogoGroup(state) {
    if (!state || !state.scene || !window.THREE) return null;
    var THREE = window.THREE;

    var group = new THREE.Group();
    group.name = 'dld3d_brand_logo';

    var lettersGroup = new THREE.Group();
    lettersGroup.name = 'dld3d_brand_letters';
    group.add(lettersGroup);

    var matCore = new THREE.MeshStandardMaterial({
      color: 0x14141a,
      emissive: 0x050509,
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.85
    });
    var matCyan = new THREE.MeshStandardMaterial({
      color: 0x00f3ff,
      emissive: 0x00f3ff,
      emissiveIntensity: 0.9,
      roughness: 0.18,
      metalness: 0.55
    });
    var matMagenta = new THREE.MeshStandardMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.85,
      roughness: 0.2,
      metalness: 0.5
    });

    // I
    var iGeo = new THREE.BoxGeometry(6, 30, 6);
    var iMesh = new THREE.Mesh(iGeo, matCyan);
    iMesh.position.set(-38, 13, 0);
    lettersGroup.add(iMesh);

    // V (two slanted bars)
    var vGeo = new THREE.BoxGeometry(6, 32, 6);
    var vL = new THREE.Mesh(vGeo, matCyan);
    var vR = new THREE.Mesh(vGeo, matCyan);
    vL.position.set(-6.5, 14, 0);
    vR.position.set(6.5, 14, 0);
    vL.rotation.z = 0.42;
    vR.rotation.z = -0.42;
    lettersGroup.add(vL);
    lettersGroup.add(vR);

    // O (torus ring)
    var oGeo = new THREE.TorusGeometry(12.5, 3.0, 18, 72);
    var oMesh = new THREE.Mesh(oGeo, matMagenta);
    oMesh.position.set(38, 14, 0);
    oMesh.rotation.x = Math.PI / 2;
    lettersGroup.add(oMesh);

    // Simple "bloom" shells (cheap glow without post-processing)
    var glowMats = [
      new THREE.MeshBasicMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.18, blending: THREE.AdditiveBlending, depthWrite: false }),
      new THREE.MeshBasicMaterial({ color: 0xff00ff, transparent: true, opacity: 0.16, blending: THREE.AdditiveBlending, depthWrite: false })
    ];
    var meshes = [
      { src: iMesh, mat: glowMats[0] },
      { src: vL, mat: glowMats[0] },
      { src: vR, mat: glowMats[0] },
      { src: oMesh, mat: glowMats[1] }
    ];
    for (var gi = 0; gi < meshes.length; gi++) {
      var m = meshes[gi];
      if (!m || !m.src) continue;
      var glow = new THREE.Mesh(m.src.geometry, m.mat);
      glow.position.copy(m.src.position);
      glow.rotation.copy(m.src.rotation);
      glow.scale.copy(m.src.scale).multiplyScalar(1.06);
      lettersGroup.add(glow);
    }

    // TECH plaque (simple fallback)
    var plaqueGeo = new THREE.BoxGeometry(70, 8, 8);
    var plaque = new THREE.Mesh(plaqueGeo, matCore);
    plaque.position.set(0, -6, 0);
    group.add(plaque);

    // Subtle accent light
    var light = new THREE.PointLight(0x00f3ff, 0.55, 220, 2);
    light.position.set(0, 55, 35);
    group.add(light);

    group.position.set(0, 0, 0);

    return {
      group: group,
      logo: group,
      lettersGroup: lettersGroup
    };
  }

  function estimatePriceFromVolume(vars, materialKey, presetKey, qty, volumeCm3) {
    var mats = isObject(vars.materials) ? vars.materials : {};
    var presets = isObject(vars.presets) ? vars.presets : {};
    var mat = mats[materialKey] || null;
    var preset = presets[presetKey] || null;

    if (!mat) return { ok: false, price: null, hint: 'Material fehlt.' };

    var density = parseFloat(mat.density);
    var pricePerKg = parseFloat(mat.price_per_kg);
    if (!isFinite(density) || !isFinite(pricePerKg)) {
      return { ok: false, price: null, hint: 'Materialdaten unvollstaendig.' };
    }

    var presetFactor = preset && isFinite(parseFloat(preset.factor)) ? parseFloat(preset.factor) : 1.0;

    var setupFee = isFinite(parseFloat(vars.setup_fee)) ? parseFloat(vars.setup_fee) : 10.0;
    var postFee = isFinite(parseFloat(vars.post_processing_fee)) ? parseFloat(vars.post_processing_fee) : 1.5;
    var margin = isFinite(parseFloat(vars.margin)) ? parseFloat(vars.margin) : 1.25;
    var minPrice = isFinite(parseFloat(vars.min_price)) ? parseFloat(vars.min_price) : 25.0;

    var quantity = Math.max(1, parseInt(qty, 10) || 1);

    var weightGSingle = volumeCm3 * density;
    var totalWeightG = weightGSingle * quantity;
    var materialCost = (totalWeightG / 1000.0) * pricePerKg;
    var base = materialCost + setupFee + quantity * postFee;
    var priceAfterPreset = base * presetFactor;
    var priceAfterMargin = priceAfterPreset * margin;

    var discountFactor = 1.0;
    if (quantity >= 50) discountFactor = 0.80;
    else if (quantity >= 25) discountFactor = 0.85;
    else if (quantity >= 10) discountFactor = 0.90;
    else if (quantity >= 2) discountFactor = 0.95;

    var afterDiscount = priceAfterMargin * discountFactor;
    var finalCalc = Math.max(afterDiscount, minPrice);
    var rounded = Math.round(finalCalc * 2) / 2; // 0.50 steps

    return {
      ok: true,
      price: rounded,
      rawBeforeDiscount: Math.round(Math.max(priceAfterMargin, minPrice) * 2) / 2,
      discountFactor: discountFactor
    };
  }

  function mount(mountEl, config) {
    if (!mountEl) throw new Error('[dld3d] mountEl is required');

    // Dispose any previous instance on same mount.
    if (mountEl.__dld3d_controller && typeof mountEl.__dld3d_controller.dispose === 'function') {
      try { mountEl.__dld3d_controller.dispose(); } catch (_e) {}
      mountEl.__dld3d_controller = null;
    }

    var cfg = isObject(config) ? config : {};
    var mode = normalizeMode(cfg.mode);
    var theme = normalizeTheme(cfg.theme);
    var vars = isObject(cfg.vars) ? cfg.vars : {};
    var strings = normalizeStrings(cfg.strings);
    var features = mergeFeatures(mode, vars, cfg.features);
    var demoDisableUpload = mode === 'demo' && parseBoolStrict(vars.demo_disable_upload) === true;
    var brandLogoSetting = parseBoolStrict(vars.brand_logo_enabled);

    var prefersReducedMotion = getPrefersReducedMotion();

    mountEl.classList.add('dld3d');
    mountEl.classList.toggle('dld3d--theme-ivo-tech', theme === 'ivo-tech');
    mountEl.classList.toggle('dld3d--theme-dld', theme === 'dld');
    mountEl.classList.toggle('dld3d--mode-demo', mode === 'demo');
    mountEl.classList.toggle('dld3d--mode-wp', mode === 'wp');
    mountEl.classList.toggle('dld3d--demo-upload-disabled', demoDisableUpload);
    mountEl.innerHTML = renderMarkup(mode, strings);

    // Demo actions (link out)
    var demoActions = mountEl.querySelector('#dld-demo-actions');
    if (demoActions) {
      demoActions.innerHTML = '';
      if (typeof vars.full_viewer_url === 'string' && vars.full_viewer_url) {
        var a = createEl('a', {
          class: 'dld-btn dld-btn-secondary',
          href: vars.full_viewer_url,
          target: '_blank',
          rel: 'noopener noreferrer',
          text: mode === 'demo' ? strings.header_link_demo : strings.header_link_wp
        });
        demoActions.appendChild(a);
      }
    }

    // Core UI refs
    var UI = {
      container: mountEl.querySelector('#dld-3d-scene'),
      canvasWrap: mountEl.querySelector('#dld-3d-canvas'),
      uploadZone: mountEl.querySelector('#dld-drop-zone'),
      fileInput: mountEl.querySelector('#dld-file-input'),
      browseBtn: mountEl.querySelector('#dld-browse-btn'),
      viewerContainer: mountEl.querySelector('#dld-viewer-container'),
      progressContainer: mountEl.querySelector('#dld-progress-bar-container'),
      progressBar: mountEl.querySelector('#dld-progress-bar'),
      status: mountEl.querySelector('#dld-upload-status'),
      uploadBtn: mountEl.querySelector('#dld-upload-btn'),

      display: {
        filename: mountEl.querySelector('#dld-filename'),
        dimensions: mountEl.querySelector('#dld-dimensions'),
        volume: mountEl.querySelector('#dld-volume'),
        price: mountEl.querySelector('#dld-price'),
        printTime: mountEl.querySelector('#dld-print-time'),
        priceHint: mountEl.querySelector('#dld-price-hint')
      },

      groups: {
        materials: mountEl.querySelector('#dld-material-group'),
        presets: mountEl.querySelector('#dld-quality-group')
      },

      colors: {
        neutralGrid: mountEl.querySelector('#dld-color-grid-neutral'),
        colorGrid: mountEl.querySelector('#dld-color-grid-color'),
        metallicGrid: mountEl.querySelector('#dld-color-grid-metallic'),
        empty: mountEl.querySelector('#dld-color-empty'),
        selectedName: mountEl.querySelector('#dld-color-selected-name'),
        selectedHex: mountEl.querySelector('#dld-color-selected-hex'),
        selectedSwatch: mountEl.querySelector('#dld-color-selected-swatch')
      },

      inputs: {
        quantity: mountEl.querySelector('#dld-quantity')
      },

      buttons: {
        home: mountEl.querySelector('#dld-home-btn'),
        autoOrient: mountEl.querySelector('#dld-auto-orient-btn'),
        layFlat: mountEl.querySelector('#dld-layflat-btn'),
        rotate: mountEl.querySelector('#dld-rotate-btn'),
        removeFile: mountEl.querySelector('#dld-remove-file-btn'),
        rotX: mountEl.querySelector('#dld-rot-x'),
        rotY: mountEl.querySelector('#dld-rot-y'),
        rotZ: mountEl.querySelector('#dld-rot-z')
      },

      panels: {
        rotate: mountEl.querySelector('#dld-rotate-panel'),
        analyze: mountEl.querySelector('#dld-analyze-panel'),
        analyzeStatus: mountEl.querySelector('#dld-analyze-status'),
        analyzeList: mountEl.querySelector('#dld-analyze-list'),
        analyzeToggle: mountEl.querySelector('#dld-analyze-toggle'),
        repairPanel: mountEl.querySelector('#dld-repair-panel'),
        repairMessage: mountEl.querySelector('#dld-repair-message'),
        repairButton: mountEl.querySelector('#dld-repair-btn'),
        convertPanel: mountEl.querySelector('#dld-convert-panel'),
        convertMessage: mountEl.querySelector('#dld-convert-message'),
        convertLink: mountEl.querySelector('#dld-convert-link')
      },

      legal: {
        wrapper: mountEl.querySelector('#dld-legal-check'),
        checkbox: mountEl.querySelector('#dld-legal-checkbox')
      }
    };

    // Basic dependency check
    if (!hasThreeDeps()) {
      if (UI.status) {
        UI.status.className = 'status-error';
        UI.status.textContent = 'Three.js Loader fehlt (OrbitControls / STLLoader / 3MFLoader).';
      }
      // Disable main action
      if (UI.uploadBtn) UI.uploadBtn.disabled = true;

      var deadController = { dispose: noop, resize: noop };
      mountEl.__dld3d_controller = deadController;
      return deadController;
    }

    // State
    var state = {
      mode: mode,
      theme: theme,
      vars: vars,
      features: features,
      prefersReducedMotion: prefersReducedMotion,

      currentFile: null,
      currentExt: null,

      selected: {
        material: null,
        preset: null,
        color: {
          name: '-',
          hex: null,
          group: 'neutral'
        }
      },

      // three.js
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      rootGroup: null,
      gridHelper: null,
      rafId: null,
      resizeObserver: null,
      windowResizeBound: false,
      windowResizeHandler: null,

      // camera / transforms
      home: {
        objectQuat: null,
        objectPos: null,
        camPos: null,
        target: null
      },

      rotateMode: {
        enabled: false,
        pointerDown: false,
        lastX: 0,
        lastY: 0
      },

      stats: {
        volumeCm3: 0,
        supportsRecommended: false
      },

      // server pricing state
      server: {
        sliceController: null,
        repriceController: null,
        analyzeController: null,
        convertController: null,
        repairController: null,
        demoController: null,
        quoteId: null,
        fileUrl: null,
        slicerData: null,
        price: null,
        context: null
      },

      brand: {
        enabled: brandLogoSetting === null ? (theme === 'ivo-tech' || mode === 'demo') : brandLogoSetting,
        group: null,
        logo: null,
        logoIsProcedural: false,
        logoBasePos: null,
        logoAnchorPos: null,
        logoBaseScale: 1,
        targetSize: 70
      }
    };

    function setStatus(message, type, allowHtml) {
      if (!UI.status) return;
      if (allowHtml) UI.status.innerHTML = message || '';
      else UI.status.textContent = message || '';

      UI.status.classList.remove('status-error', 'status-success', 'status-info');
      if (type === 'error') UI.status.classList.add('status-error');
      else if (type === 'success') UI.status.classList.add('status-success');
      else UI.status.classList.add('status-info');
    }

    function setProgress(pct) {
      if (!UI.progressContainer || !UI.progressBar) return;
      UI.progressContainer.style.display = 'block';
      UI.progressBar.style.width = clamp(pct, 0, 100) + '%';
      if (pct >= 100) {
        setTimeout(function () {
          if (UI.progressContainer) UI.progressContainer.style.display = 'none';
        }, 250);
      }
    }

    function setPricePending(text) {
      if (!UI.display.price) return;
      UI.display.price.textContent = text || 'Wird berechnet…';
    }

    function setPrintTime(text) {
      if (!UI.display.printTime) return;
      UI.display.printTime.textContent = text || '-';
    }

    function setPriceHint(text) {
      if (!UI.display.priceHint) return;
      UI.display.priceHint.textContent = text || '';
    }

    function getMaterials() {
      return isObject(vars.materials) ? vars.materials : {};
    }

    function getPresets() {
      return isObject(vars.presets) ? vars.presets : {};
    }

    function getColors() {
      return isObject(vars.colors) ? vars.colors : {};
    }

    function getDefaultColors() {
      return isObject(vars.default_colors) ? vars.default_colors : {};
    }

    function getSelectedMaterialKey() {
      return state.selected.material || Object.keys(getMaterials())[0] || 'PLA';
    }

    function getSelectedPresetKey() {
      return state.selected.preset || Object.keys(getPresets())[0] || 'standard';
    }

    function getSelectedColorCategory() {
      var group = state.selected.color && state.selected.color.group ? state.selected.color.group : 'neutral';
      if (group === 'color') return 'colored';
      if (group === 'metallic') return 'metallic';
      return 'neutral';
    }

    function getSelectedMaterialLabel() {
      var mats = getMaterials();
      var key = getSelectedMaterialKey();
      var m = mats[key];
      return m && m.name ? String(m.name) : String(key);
    }

    function getSelectedPresetLabel() {
      var presets = getPresets();
      var key = getSelectedPresetKey();
      var p = presets[key];
      return p && p.name ? String(p.name) : String(key);
    }

    function updateActionButtonLabel() {
      if (!UI.uploadBtn) return;
      if (mode === 'demo') {
        UI.uploadBtn.textContent = strings.action_demo || 'OPEN FULL VIEWER';
        UI.uploadBtn.disabled = false;
        return;
      }

      // WP mode
      if (features.woocommerceEnabled) {
        UI.uploadBtn.textContent =
          vars.wc_redirect === 'cart'
            ? (strings.action_add_to_cart || 'In den Warenkorb')
            : (strings.action_checkout || 'Zum Checkout');
      } else {
        UI.uploadBtn.textContent = strings.action_request || 'Anfrage senden';
      }
    }

    function updateLegalVisibility() {
      if (!UI.legal.wrapper || !UI.legal.checkbox) return;
      // WP: show legal checkbox to enable button; demo: hide.
      if (mode === 'wp') {
        UI.legal.wrapper.style.display = '';
      } else {
        UI.legal.wrapper.style.display = 'none';
      }
    }

    function updateOrderButtonState() {
      if (!UI.uploadBtn) return;
      if (mode === 'demo') {
        UI.uploadBtn.disabled = false;
        return;
      }
      var legalOk = UI.legal.checkbox ? !!UI.legal.checkbox.checked : true;
      UI.uploadBtn.disabled = !legalOk;
    }

    function initDataAndUI() {
      // Materials
      var mats = getMaterials();
      var matKeys = Object.keys(mats);
      if (matKeys.length === 0) {
        // Minimal fallback for demo.
        mats = { PLA: { name: 'PLA', density: 1.24, price_per_kg: 25.0 } };
      }

      var defaultMaterialKey = matKeys[0] || Object.keys(mats)[0] || 'PLA';
      state.selected.material = defaultMaterialKey;

      if (UI.groups.materials) {
        UI.groups.materials.innerHTML = '';
        Object.keys(mats).forEach(function (key, idx) {
          var m = mats[key] || {};
          var label = createEl('label', { class: 'dld-radio' });
          var input = createEl('input', {
            type: 'radio',
            name: 'dld-material',
            value: key
          });
          if (idx === 0) input.checked = true;
          var span = createEl('span', { text: m.name ? String(m.name) : String(key) });
          label.appendChild(input);
          label.appendChild(span);
          UI.groups.materials.appendChild(label);
        });
      }

      // Presets
      var presets = getPresets();
      var presetKeys = Object.keys(presets);
      if (presetKeys.length === 0) {
        presets = { standard: { name: 'Standard', factor: 1.0, infill: 20, layer_height: 0.2 } };
        presetKeys = Object.keys(presets);
      }

      state.selected.preset = presetKeys[0] || 'standard';

      if (UI.groups.presets) {
        UI.groups.presets.innerHTML = '';
        presetKeys.forEach(function (key, idx) {
          var p = presets[key] || {};
          var label = createEl('label', { class: 'dld-radio' });
          var input = createEl('input', {
            type: 'radio',
            name: 'dld-quality',
            value: key
          });
          if (idx === 0 || key === 'standard') input.checked = true;
          if (idx === 0 && key !== 'standard') {
            // If first isn't standard, still prefer standard when available
            // (handled above via checked condition)
          }
          var span = createEl('span', { text: p.name ? String(p.name) : String(key) });
          label.appendChild(input);
          label.appendChild(span);
          UI.groups.presets.appendChild(label);
        });

        // Ensure state.selected.preset matches checked
        var checkedPreset = mountEl.querySelector('input[name="dld-quality"]:checked');
        if (checkedPreset) state.selected.preset = checkedPreset.value;
      }

      // Colors: initial selection from defaults or first available
      var defaultColors = getDefaultColors();
      var colorHex = defaultColors[getSelectedMaterialKey()] || null;
      if (colorHex && typeof colorHex === 'object' && colorHex.hex) colorHex = colorHex.hex;
      if (typeof colorHex === 'string') {
        state.selected.color.hex = colorHex;
      }

      renderColorSwatches();
      updateSelectedColorUI();

      updateActionButtonLabel();
      updateLegalVisibility();
      updateOrderButtonState();

      // Print time row: hide in demo mode
      if (mode === 'demo') {
        var rows = mountEl.querySelectorAll('.dld-print-time-row');
        for (var i = 0; i < rows.length; i++) rows[i].style.display = 'none';
      }

      // Analyze panel visibility depends on mode + feature flags
      if (UI.panels.analyze) {
        if (mode === 'wp' && (features.serverAnalyze || features.convertEnabled || features.repairEnabled)) {
          UI.panels.analyze.style.display = '';
        } else {
          UI.panels.analyze.style.display = 'none';
        }
      }
    }

    function updateSelectedColorUI() {
      if (UI.colors.selectedName) UI.colors.selectedName.textContent = state.selected.color.name || '-';
      if (UI.colors.selectedHex) UI.colors.selectedHex.textContent = state.selected.color.hex || '#----';
      if (UI.colors.selectedSwatch) {
        UI.colors.selectedSwatch.style.background = state.selected.color.hex ? state.selected.color.hex : 'transparent';
      }
    }

    function clearColorGrids() {
      if (UI.colors.neutralGrid) UI.colors.neutralGrid.innerHTML = '';
      if (UI.colors.colorGrid) UI.colors.colorGrid.innerHTML = '';
      if (UI.colors.metallicGrid) UI.colors.metallicGrid.innerHTML = '';
    }

    function renderColorSwatches() {
      clearColorGrids();

      var colorsByMaterial = getColors();
      var materialKey = getSelectedMaterialKey();
      var list = colorsByMaterial[materialKey];

      var any = false;
      if (Array.isArray(list)) {
        list.forEach(function (row) {
          if (!row) return;
          if (row.enabled === 0 || row.enabled === '0') return;
          var hex = String(row.hex || row.color || '').trim();
          if (!hex) return;

          var group = String(row.group || 'color').toLowerCase();
          if (group === 'colored') group = 'color';
          if (group === 'metal' || group === 'metallisch') group = 'metallic';
          if (group !== 'neutral' && group !== 'color' && group !== 'metallic') group = 'color';

          var name = row.name ? String(row.name) : hex;

          var btn = createEl('button', { class: 'dld-color-swatch', type: 'button' });
          btn.style.background = hex;
          btn.setAttribute('aria-label', name);
          btn.dataset.hex = hex;
          btn.dataset.name = name;
          btn.dataset.group = group;
          if (state.selected.color.hex && state.selected.color.hex.toLowerCase() === hex.toLowerCase()) {
            btn.classList.add('is-selected');
            state.selected.color.group = group;
            state.selected.color.name = name;
          }

          btn.addEventListener('click', function () {
            state.selected.color.hex = btn.dataset.hex;
            state.selected.color.name = btn.dataset.name;
            state.selected.color.group = btn.dataset.group || 'neutral';
            updateSelectedColorUI();
            renderColorSwatches();
            applyPreviewColor();
            onContextChanged({ pricing: true });
          });

          var target =
            group === 'neutral' ? UI.colors.neutralGrid : group === 'metallic' ? UI.colors.metallicGrid : UI.colors.colorGrid;
          if (target) target.appendChild(btn);
          any = true;
        });
      }

      if (!any) {
        if (UI.colors.empty) UI.colors.empty.style.display = '';
      } else {
        if (UI.colors.empty) UI.colors.empty.style.display = 'none';
      }

      // Ensure we have a selected color; if not, pick first available.
      if (!state.selected.color.hex) {
        var first = mountEl.querySelector('.dld-color-swatch');
        if (first) {
          state.selected.color.hex = first.dataset.hex;
          state.selected.color.name = first.dataset.name;
          state.selected.color.group = first.dataset.group || 'neutral';
          updateSelectedColorUI();
          first.classList.add('is-selected');
        }
      }
    }

    // Three.js setup
    function initThreeIfNeeded() {
      if (state.scene) return;

      var width = UI.canvasWrap ? UI.canvasWrap.clientWidth : 640;
      var height = UI.canvasWrap ? UI.canvasWrap.clientHeight : 480;

      state.scene = new THREE.Scene();
      state.scene.background = null;

      state.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 4000);
      state.camera.position.set(60, 55, 60);

      state.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      state.renderer.setSize(width, height);
      state.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      state.renderer.shadowMap.enabled = true;
      state.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      if (UI.container) UI.container.appendChild(state.renderer.domElement);

      state.controls = new THREE.OrbitControls(state.camera, state.renderer.domElement);
      state.controls.enableDamping = true;
      state.controls.dampingFactor = 0.06;
      state.controls.autoRotate = !prefersReducedMotion;
      state.controls.autoRotateSpeed = 0.6;

      // Lights
      var ambient = new THREE.AmbientLight(0xffffff, 0.45);
      state.scene.add(ambient);

      var key = new THREE.DirectionalLight(0xffffff, 0.7);
      key.position.set(40, 70, 35);
      key.castShadow = true;
      key.shadow.mapSize.width = 2048;
      key.shadow.mapSize.height = 2048;
      key.shadow.bias = -0.0005;
      key.shadow.normalBias = 0.02;
      state.scene.add(key);

      var fill = new THREE.DirectionalLight(0xffffff, 0.25);
      fill.position.set(-50, 30, 15);
      state.scene.add(fill);

      var rim = new THREE.DirectionalLight(0xffffff, 0.25);
      rim.position.set(0, 25, -50);
      state.scene.add(rim);

      state.gridHelper = new THREE.GridHelper(260, 26, 0x444444, 0x222222);
      state.scene.add(state.gridHelper);

      initBrandIfNeeded();
      bindResize();
      startLoop();
    }

    function bindResize() {
      if (state.resizeObserver || state.windowResizeBound) return;

      var resize = function () {
        if (!state.renderer || !state.camera || !UI.canvasWrap) return;
        var w = UI.canvasWrap.clientWidth;
        var h = UI.canvasWrap.clientHeight;
        if (!w || !h) return;
        state.renderer.setSize(w, h);
        state.camera.aspect = w / h;
        state.camera.updateProjectionMatrix();
      };

      if (typeof ResizeObserver !== 'undefined' && UI.canvasWrap) {
        state.resizeObserver = new ResizeObserver(function () {
          resize();
        });
        state.resizeObserver.observe(UI.canvasWrap);
      } else {
        state.windowResizeBound = true;
        state.windowResizeHandler = resize;
        window.addEventListener('resize', state.windowResizeHandler);
      }

      // Initial resize
      resize();
    }

    function startLoop() {
      if (state.rafId) return;
      var tick = function () {
        state.rafId = requestAnimationFrame(tick);
        if (!state.renderer || !state.scene || !state.camera) return;

        if (state.controls && !state.rotateMode.enabled) state.controls.update();
        if (state.brand && state.brand.group) {
          var now = nowMs();
          animateBrand(now);
        }
        state.renderer.render(state.scene, state.camera);
      };
      state.rafId = requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (state.rafId) cancelAnimationFrame(state.rafId);
      state.rafId = null;
    }

    function applyPreviewColor() {
      if (!state.rootGroup || !state.selected.color.hex) return;
      var hexStr = state.selected.color.hex.replace('#', '').trim();
      if (!hexStr) return;
      var col = parseInt(hexStr, 16);
      if (!isFinite(col)) return;

      state.rootGroup.traverse(function (child) {
        if (!child.isMesh || !child.material) return;
        if (Array.isArray(child.material)) {
          child.material.forEach(function (m) {
            if (m && m.color) m.color.setHex(col);
          });
        } else {
          if (child.material.color) child.material.color.setHex(col);
        }
      });
    }

    function setUploadOverlayVisible(visible) {
      if (!UI.uploadZone) return;
      UI.uploadZone.style.display = visible ? 'flex' : 'none';
      UI.uploadZone.style.visibility = visible ? 'visible' : 'hidden';
      UI.uploadZone.style.opacity = visible ? '1' : '0';
      UI.uploadZone.style.pointerEvents = visible ? 'auto' : 'none';
    }

    function nowMs() {
      try {
        if (window.performance && typeof window.performance.now === 'function') return window.performance.now();
      } catch (_e) {}
      return Date.now();
    }

    function parseBrandVec3(input, fallback) {
      var def = fallback || { x: 0, y: 0, z: 0 };
      if (Array.isArray(input) && input.length >= 3) {
        return {
          x: isFinite(parseFloat(input[0])) ? parseFloat(input[0]) : def.x,
          y: isFinite(parseFloat(input[1])) ? parseFloat(input[1]) : def.y,
          z: isFinite(parseFloat(input[2])) ? parseFloat(input[2]) : def.z
        };
      }
      if (isObject(input)) {
        return {
          x: isFinite(parseFloat(input.x)) ? parseFloat(input.x) : def.x,
          y: isFinite(parseFloat(input.y)) ? parseFloat(input.y) : def.y,
          z: isFinite(parseFloat(input.z)) ? parseFloat(input.z) : def.z
        };
      }
      if (typeof input === 'string') {
        var parts = input.split(',').map(function (p) { return parseFloat(p.trim()); });
        if (parts.length >= 3) {
          return {
            x: isFinite(parts[0]) ? parts[0] : def.x,
            y: isFinite(parts[1]) ? parts[1] : def.y,
            z: isFinite(parts[2]) ? parts[2] : def.z
          };
        }
      }
      return { x: def.x, y: def.y, z: def.z };
    }

    function tweakBrandMaterials(root) {
      if (!root || !root.traverse) return;
      root.traverse(function (child) {
        if (!child.isMesh) return;
        child.castShadow = true;
        child.receiveShadow = true;
        var mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach(function (mat) {
          if (!mat) return;
          if (mat.emissive && typeof mat.emissiveIntensity === 'number') {
            mat.emissiveIntensity = Math.min(1.2, mat.emissiveIntensity + 0.25);
          }
          if (typeof mat.metalness === 'number') mat.metalness = Math.min(1, mat.metalness + 0.1);
          if (typeof mat.roughness === 'number') mat.roughness = Math.max(0.08, mat.roughness - 0.08);
        });
      });
    }

    function normalizeBrandLogo(logo) {
      if (!logo) return;
      logo.updateMatrixWorld(true);
      var box = new THREE.Box3().setFromObject(logo);
      var size = box.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z) || 1;
      var targetSize = isFinite(parseFloat(vars.brand_logo_target_size))
        ? parseFloat(vars.brand_logo_target_size)
        : state.brand.targetSize;
      var scale = targetSize / maxDim;
      var userScale = parseFloat(vars.brand_logo_scale);
      if (isFinite(userScale)) scale *= userScale;
      logo.scale.setScalar(scale);
      logo.updateMatrixWorld(true);
      alignToFloorAndCenter(logo);
      state.brand.logoBaseScale = scale;
    }

    function positionBrandLogoForContext() {
      if (!state.brand || !state.brand.group) return;
      var offset = { x: 0, y: 8, z: 0 };
      var base = { x: 0, y: 0, z: 0 };

      if (state.rootGroup) {
        state.rootGroup.updateMatrixWorld(true);
        var box = new THREE.Box3().setFromObject(state.rootGroup);
        base.x = isFinite(box.max.x) ? box.max.x : 0;
        base.y = isFinite(box.max.y) ? box.max.y : 0;
        base.z = isFinite(box.max.z) ? box.max.z : 0;
        offset = parseBrandVec3(vars.brand_logo_offset, { x: 24, y: 18, z: 24 });
      }

      state.brand.group.position.set(base.x + offset.x, base.y + offset.y, base.z + offset.z);
      state.brand.logoAnchorPos = state.brand.group.position.clone();
    }

    function animateBrand(now) {
      if (!state.brand || !state.brand.group) return;
      var t = (typeof now === 'number' ? now : nowMs()) * 0.001;
      var anchor = state.brand.logoAnchorPos || state.brand.group.position;
      var floatY = state.prefersReducedMotion ? 0 : Math.sin(t * 0.8) * 1.2;
      state.brand.group.position.set(anchor.x, anchor.y + floatY, anchor.z);
      state.brand.group.rotation.y = state.prefersReducedMotion ? 0 : t * 0.35;
    }

    function initBrandIfNeeded() {
      if (!state.brand || !state.brand.enabled) return;
      if (state.brand.group) return;
      if (!state.scene || !state.camera || !state.renderer) return;

      state.brand.group = new THREE.Group();
      state.brand.group.name = 'dld3d_brand_root';
      state.scene.add(state.brand.group);

      var brandUrl = typeof vars.brand_logo_url === 'string' ? vars.brand_logo_url.trim() : '';
      var fallback = function () {
        var created = createBrandLogoGroup(state);
        if (!created || !created.group) return;
        state.brand.logoIsProcedural = true;
        state.brand.logo = created.logo || created.group;
        state.brand.group.add(created.group);
        normalizeBrandLogo(state.brand.logo);
        positionBrandLogoForContext();
      };

      if (brandUrl && hasGltfLoader()) {
        try {
          var loader = new THREE.GLTFLoader();
          loader.load(
            brandUrl,
            function (gltf) {
              var logo = (gltf && gltf.scene) || (gltf && gltf.scenes && gltf.scenes[0]) || null;
              if (!logo) {
                fallback();
                return;
              }
              tweakBrandMaterials(logo);
              state.brand.logo = logo;
              state.brand.group.add(logo);
              normalizeBrandLogo(logo);
              positionBrandLogoForContext();
            },
            undefined,
            function (_err) {
              fallback();
            }
          );
        } catch (_e) {
          fallback();
        }
      } else {
        fallback();
      }
    }

    function resetModel() {
      state.currentFile = null;
      state.currentExt = null;
      state.server.quoteId = null;
      state.server.fileUrl = null;
      state.server.slicerData = null;
      state.server.price = null;
      state.server.context = null;

      if (state.rootGroup && state.scene) {
        state.scene.remove(state.rootGroup);
        disposeObject3D(state.rootGroup);
      }
      state.rootGroup = null;
      state.home.objectQuat = null;
      state.home.objectPos = null;
      state.home.camPos = null;
      state.home.target = null;

      if (UI.display.filename) UI.display.filename.textContent = '-';
      if (UI.display.dimensions) UI.display.dimensions.textContent = '-';
      if (UI.display.volume) UI.display.volume.textContent = '-';
      if (UI.display.price) UI.display.price.textContent = '- €';
      setPrintTime('-');
      setPriceHint(mode === 'demo' ? (strings.price_hint_demo_short || '') : '');
      setStatus(mode === 'demo' ? strings.status_ready_demo : strings.status_ready_wp, 'info');

      setUploadOverlayVisible(!demoDisableUpload);
      updateOrderButtonState();

      if (state.brand && state.brand.group) {
        positionBrandLogoForContext();
      }
    }

    function alignToFloorAndCenter(obj) {
      if (!obj) return;
      obj.updateMatrixWorld(true);
      var box = new THREE.Box3().setFromObject(obj);
      var center = box.getCenter(new THREE.Vector3());
      obj.position.x -= center.x;
      obj.position.z -= center.z;
      obj.updateMatrixWorld(true);
      box = new THREE.Box3().setFromObject(obj);
      obj.position.y -= box.min.y;
      obj.updateMatrixWorld(true);
    }

    function fitCameraToObject(obj) {
      if (!obj || !state.camera || !state.controls) return;
      obj.updateMatrixWorld(true);
      var box = new THREE.Box3().setFromObject(obj);
      var size = box.getSize(new THREE.Vector3());
      var maxDim = Math.max(size.x, size.y, size.z);

      var fov = state.camera.fov * (Math.PI / 180);
      var cameraDist = maxDim / (2 * Math.tan(fov / 2));
      cameraDist *= 2.5;

      var comp = cameraDist / Math.sqrt(3);
      if (comp < 60) comp = 60;

      state.camera.near = Math.max(0.1, maxDim / 20000);
      state.camera.far = Math.max(2000, maxDim * 60);
      state.camera.updateProjectionMatrix();

      state.camera.position.set(comp, comp, comp);
      state.controls.target.set(0, 0, 0);
      state.controls.update();

      // Adjust grid scale
      if (state.scene && state.gridHelper) {
        state.scene.remove(state.gridHelper);
        var gridSize = Math.max(260, maxDim * 1.5);
        state.gridHelper = new THREE.GridHelper(gridSize, 26, 0x444444, 0x222222);
        state.scene.add(state.gridHelper);
      }
    }

    function setHomePose() {
      if (!state.rootGroup || !state.camera || !state.controls) return;
      state.home.objectQuat = state.rootGroup.quaternion.clone();
      state.home.objectPos = state.rootGroup.position.clone();
      state.home.camPos = state.camera.position.clone();
      state.home.target = state.controls.target.clone();
    }

    function restoreHomePose() {
      if (!state.rootGroup || !state.camera || !state.controls) return;
      if (!state.home.objectQuat || !state.home.objectPos || !state.home.camPos || !state.home.target) return;
      state.rootGroup.quaternion.copy(state.home.objectQuat);
      state.rootGroup.position.copy(state.home.objectPos);
      state.camera.position.copy(state.home.camPos);
      state.controls.target.copy(state.home.target);
      state.controls.update();
    }

    function computeAndUpdateStats() {
      if (!state.rootGroup) return;
      state.rootGroup.updateMatrixWorld(true);
      var box = new THREE.Box3().setFromObject(state.rootGroup);
      var size = box.getSize(new THREE.Vector3());
      var dimsText = size.x.toFixed(1) + ' x ' + size.z.toFixed(1) + ' x ' + size.y.toFixed(1) + ' mm';

      var volMm3 = computeObjectVolumeMm3(state.rootGroup);
      var volCm3 = volMm3 / 1000.0;
      if (volCm3 < 0.01) volCm3 = 0.01;
      state.stats.volumeCm3 = volCm3;

      if (UI.display.dimensions) UI.display.dimensions.textContent = dimsText;
      if (UI.display.volume) UI.display.volume.textContent = volCm3.toFixed(2).replace('.', ',');
    }

    function maybeEstimateAndRenderPrice() {
      if (!UI.display.price) return;

      if (!state.rootGroup || !state.currentFile) {
        UI.display.price.textContent = '- €';
        return;
      }

      if (mode !== 'demo') return;

      var qty = UI.inputs.quantity ? (parseInt(UI.inputs.quantity.value, 10) || 1) : 1;
      var res = estimatePriceFromVolume(vars, getSelectedMaterialKey(), getSelectedPresetKey(), qty, state.stats.volumeCm3);
      if (!res.ok) {
        UI.display.price.textContent = '- €';
        setPriceHint('Estimate nicht verfuegbar: ' + (res.hint || ''));
        return;
      }

      if (res.discountFactor < 1.0 && res.rawBeforeDiscount > res.price) {
        var percent = Math.round((1.0 - res.discountFactor) * 100);
        UI.display.price.innerHTML =
          '<span style="text-decoration:line-through; color: rgba(255,255,255,0.55); font-size:0.85em; margin-right:10px;">' +
          formatEUR(res.rawBeforeDiscount, { decimals: 2 }) +
          '</span>' +
          '<span style="color: var(--dld-success);" title="Inkl. ' +
          percent +
          '% Mengenrabatt">' +
          formatEUR(res.price, { decimals: 2 }) +
          '</span>';
      } else {
        UI.display.price.textContent = formatEUR(res.price, { decimals: 2 });
      }

      setPriceHint(strings.price_hint_demo || 'Demo-Estimate: Volumen x Dichte (ohne Druckzeit).');
    }

    function buildServerContext() {
      var presetKey = getSelectedPresetKey();
      var presets = getPresets();
      var presetData = presets[presetKey] || {};
      var infill = presetData.infill != null ? presetData.infill : 20;
      var layerHeight = presetData.layer_height != null ? presetData.layer_height : 0.2;

      var qty = UI.inputs.quantity ? (parseInt(UI.inputs.quantity.value, 10) || 1) : 1;

      return {
        material: getSelectedMaterialKey(),
        preset: presetKey,
        quantity: qty,
        supports: state.stats.supportsRecommended ? 1 : 0,
        color_category: getSelectedColorCategory(),
        infill: infill,
        layer_height: layerHeight
      };
    }

    function abortControllerIfAny(ctrl) {
      if (ctrl && typeof ctrl.abort === 'function') {
        try { ctrl.abort(); } catch (_e) {}
      }
    }

    function ajaxPostFormData(formData, controller) {
      var url = vars.ajax_url;
      return fetch(url, {
        method: 'POST',
        body: formData,
        signal: controller ? controller.signal : undefined,
        credentials: 'same-origin'
      }).then(function (r) { return r.json(); });
    }

    function startServerSlice() {
      if (!features.serverPricing) return;
      if (!state.currentFile) return;

      abortControllerIfAny(state.server.sliceController);
      var controller = new AbortController();
      state.server.sliceController = controller;

      var ctx = buildServerContext();
      state.server.context = ctx;
      state.server.slicerData = null;
      state.server.price = null;
      state.server.quoteId = null;

      setStatus(strings.status_calc_running || 'Berechnung laeuft…', 'info');
      setPricePending('Wird berechnet…');
      setPrintTime('Wird berechnet…');

      var form = new FormData();
      form.append('action', 'dld_calculate_price');
      form.append('nonce', vars.calc_nonce || '');
      form.append('file', state.currentFile);
      form.append('infill', String(ctx.infill));
      form.append('layer_height', String(ctx.layer_height));
      form.append('material', String(ctx.material));
      form.append('supports', String(ctx.supports));
      form.append('quantity', String(ctx.quantity));
      form.append('preset', String(ctx.preset));
      form.append('color_category', String(ctx.color_category));

      ajaxPostFormData(form, controller)
        .then(function (payload) {
          if (!payload || !payload.success) {
            var msg = payload && payload.data ? payload.data : 'Berechnung fehlgeschlagen.';
            setStatus(String(msg), 'error');
            return;
          }
          var data = payload.data || {};
          state.server.slicerData = data.stats || null;
          state.server.price = data.price != null ? parseFloat(data.price) : null;
          state.server.quoteId = data.quote_id || null;
          state.server.fileUrl = data.file_url || null;

          if (UI.display.price) {
            if (isFinite(state.server.price)) {
              var cap = parseFloat(vars.max_price);
              if (isFinite(cap) && cap > 0 && state.server.price > cap) {
                UI.display.price.textContent = 'Bitte kontaktieren';
                setStatus('Preis ueber ' + cap.toFixed(0) + ' € – bitte kontaktieren.', 'info');
              } else {
                UI.display.price.textContent = formatEUR(state.server.price, { decimals: 0 });
                setStatus(strings.status_calc_done || 'Berechnung fertig.', 'success');
              }
            } else {
              UI.display.price.textContent = '- €';
              setStatus('Preis nicht verfuegbar.', 'error');
            }
          }

          var readable = state.server.slicerData && typeof state.server.slicerData.print_time_readable === 'string'
            ? state.server.slicerData.print_time_readable.trim()
            : '';
          setPrintTime(readable || '-');
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          setStatus(strings.status_network_error || 'Netzwerkfehler.', 'error');
        });
    }

    function startServerReprice() {
      if (!features.serverPricing) return;
      if (!state.server.quoteId) return startServerSlice();

      abortControllerIfAny(state.server.repriceController);
      var controller = new AbortController();
      state.server.repriceController = controller;

      var ctx = buildServerContext();
      // Reprice only supports qty + color_category. If those are unchanged, no-op.
      var prev = state.server.context || {};
      var needSlice = prev.material !== ctx.material || prev.preset !== ctx.preset || prev.supports !== ctx.supports || prev.infill !== ctx.infill || prev.layer_height !== ctx.layer_height;
      if (needSlice) return startServerSlice();

      setStatus(strings.status_price_update || 'Preis wird aktualisiert…', 'info');
      setPricePending('Wird berechnet…');
      setPrintTime('Wird berechnet…');

      var form = new FormData();
      form.append('action', 'dld_reprice');
      form.append('nonce', vars.calc_nonce || '');
      form.append('quote_id', state.server.quoteId);
      form.append('quantity', String(ctx.quantity));
      form.append('color_category', String(ctx.color_category));

      ajaxPostFormData(form, controller)
        .then(function (payload) {
          if (!payload || !payload.success) {
            var msg = payload && payload.data ? payload.data : 'Preis-Update fehlgeschlagen.';
            setStatus(String(msg), 'error');
            // Quote might be expired -> reslice
            if (String(msg).toLowerCase().indexOf('abgelaufen') !== -1) startServerSlice();
            return;
          }
          var data = payload.data || {};
          state.server.slicerData = data.stats || state.server.slicerData;
          state.server.price = data.price != null ? parseFloat(data.price) : state.server.price;
          state.server.quoteId = data.quote_id || state.server.quoteId;
          state.server.context = ctx;

          if (UI.display.price) {
            if (isFinite(state.server.price)) {
              UI.display.price.textContent = formatEUR(state.server.price, { decimals: 0 });
              setStatus(strings.status_price_updated || 'Preis aktualisiert.', 'success');
            } else {
              UI.display.price.textContent = '- €';
              setStatus('Preis nicht verfuegbar.', 'error');
            }
          }

          var readable = state.server.slicerData && typeof state.server.slicerData.print_time_readable === 'string'
            ? state.server.slicerData.print_time_readable.trim()
            : '';
          setPrintTime(readable || '-');
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          setStatus(strings.status_network_error || 'Netzwerkfehler.', 'error');
        });
    }

    function startAnalyze() {
      if (!features.serverAnalyze || !state.currentFile) return;
      if (!UI.panels.analyzeStatus) return;

      abortControllerIfAny(state.server.analyzeController);
      var controller = new AbortController();
      state.server.analyzeController = controller;

      UI.panels.analyzeStatus.textContent = 'Analyse laeuft…';
      if (UI.panels.analyzeList) UI.panels.analyzeList.innerHTML = '';

      var form = new FormData();
      form.append('action', 'dld_analyze_model');
      form.append('nonce', vars.analyze_nonce || '');
      form.append('file', state.currentFile);

      ajaxPostFormData(form, controller)
        .then(function (payload) {
          if (!payload || !payload.success || !payload.data) {
            UI.panels.analyzeStatus.textContent = 'Analyse fehlgeschlagen.';
            return;
          }
          var stats = payload.data.stats || payload.data;
          var warnings = stats && stats.warnings ? stats.warnings : '';
          var items = [];
          if (Array.isArray(warnings)) items = warnings;
          else if (typeof warnings === 'string' && warnings.trim()) items = warnings.split(',').map(function (s) { return s.trim(); }).filter(Boolean);

          UI.panels.analyzeStatus.textContent = items.length ? 'Hinweise gefunden.' : 'Keine Auffaelligkeiten.';
          if (UI.panels.analyzeList) {
            UI.panels.analyzeList.innerHTML = '';
            items.forEach(function (it) {
              var li = createEl('li', { text: it });
              UI.panels.analyzeList.appendChild(li);
            });
          }

          // Show helper panels when we have warnings and features enabled.
          if (items.length && features.repairEnabled && UI.panels.repairPanel) {
            UI.panels.repairPanel.style.display = '';
            if (UI.panels.repairMessage) UI.panels.repairMessage.textContent = 'Auto-Reparatur empfohlen.';
          } else if (UI.panels.repairPanel) {
            UI.panels.repairPanel.style.display = 'none';
          }

          if (items.length && features.convertEnabled && UI.panels.convertPanel) {
            UI.panels.convertPanel.style.display = '';
            if (UI.panels.convertMessage) UI.panels.convertMessage.textContent = 'Konvertierung empfohlen.';
            if (UI.panels.convertLink) UI.panels.convertLink.dataset.mode = 'api';
          } else if (UI.panels.convertPanel) {
            UI.panels.convertPanel.style.display = 'none';
          }
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          UI.panels.analyzeStatus.textContent = 'Analyse fehlgeschlagen.';
        });
    }

    function fetchFileAsBlob(url, signal) {
      return fetch(url, { cache: 'no-store', signal: signal }).then(function (r) {
        if (!r.ok) throw new Error('Download fehlgeschlagen');
        return r.blob();
      });
    }

    function startConvert() {
      if (!features.convertEnabled || !state.currentFile || !UI.panels.convertLink) return;
      abortControllerIfAny(state.server.convertController);
      var controller = new AbortController();
      state.server.convertController = controller;

      setStatus('Konvertierung laeuft…', 'info');

      var form = new FormData();
      form.append('action', 'dld_convert_model');
      form.append('nonce', vars.convert_nonce || '');
      form.append('file', state.currentFile);

      ajaxPostFormData(form, controller)
        .then(function (payload) {
          if (!payload || !payload.success || !payload.data || !payload.data.url) {
            setStatus('Konvertierung fehlgeschlagen.', 'error');
            return;
          }
          return fetchFileAsBlob(payload.data.url, controller.signal).then(function (blob) {
            var name = payload.data.filename || 'converted.stl';
            var converted = new File([blob], name, { type: 'application/octet-stream' });
            handleFile(converted);
            setStatus('Konvertierung abgeschlossen.', 'success');
          });
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          setStatus('Konvertierung fehlgeschlagen.', 'error');
        });
    }

    function startRepair() {
      if (!features.repairEnabled || !state.currentFile || !UI.panels.repairButton) return;
      abortControllerIfAny(state.server.repairController);
      var controller = new AbortController();
      state.server.repairController = controller;

      setStatus('Reparatur laeuft…', 'info');

      var form = new FormData();
      form.append('action', 'dld_repair_model');
      form.append('nonce', vars.repair_nonce || '');
      form.append('file', state.currentFile);

      ajaxPostFormData(form, controller)
        .then(function (payload) {
          if (!payload || !payload.success || !payload.data || !payload.data.url) {
            setStatus('Reparatur fehlgeschlagen.', 'error');
            return;
          }
          return fetchFileAsBlob(payload.data.url, controller.signal).then(function (blob) {
            var name = payload.data.filename || 'repaired.stl';
            var repaired = new File([blob], name, { type: 'application/octet-stream' });
            handleFile(repaired);
            setStatus('Reparatur abgeschlossen.', 'success');
          });
        })
        .catch(function (err) {
          if (err && err.name === 'AbortError') return;
          setStatus('Reparatur fehlgeschlagen.', 'error');
        });
    }

    function addToCartWooCommerce() {
      if (!features.woocommerceEnabled) return;
      if (!state.server.quoteId) {
        setStatus(strings.status_need_price_recalc || 'Preis bitte neu berechnen.', 'error');
        startServerSlice();
        return;
      }
      var qty = UI.inputs.quantity ? (parseInt(UI.inputs.quantity.value, 10) || 1) : 1;
      var total = state.server.price;
      if (!isFinite(total) || total <= 0) {
        setStatus('Preis nicht verfuegbar.', 'error');
        return;
      }

      setStatus(strings.status_add_to_cart_start || 'Wird in den Warenkorb gelegt…', 'info');

      var priceUnit = total / qty;

      var request = new URLSearchParams();
      request.set('action', 'dld_add_to_cart');
      request.set('nonce', vars.wc_nonce || '');
      request.set('quote_id', state.server.quoteId);
      request.set('quantity', String(qty));
      request.set('price_total', String(total));
      request.set('price_unit', String(priceUnit));
      request.set('filename', state.currentFile ? state.currentFile.name : '');
      request.set('material', getSelectedMaterialLabel());
      request.set('color', state.selected.color && state.selected.color.name ? state.selected.color.name : '');
      request.set('color_category', getSelectedColorCategory());
      request.set('quality', getSelectedPresetLabel());
      request.set('dimensions', UI.display.dimensions ? UI.display.dimensions.textContent : '');
      request.set('volume_cm3', String(state.stats.volumeCm3 || 0));

      fetch(vars.ajax_url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
        body: request.toString(),
        credentials: 'same-origin'
      })
        .then(function (r) { return r.json(); })
        .then(function (payload) {
          if (payload && payload.success && payload.data && payload.data.redirect) {
            window.location.href = payload.data.redirect;
            return;
          }
          setStatus(strings.status_add_to_cart_failed || 'Konnte nicht zum Warenkorb hinzufuegen.', 'error');
        })
        .catch(function () {
          setStatus(strings.status_network_error || 'Netzwerkfehler.', 'error');
        });
    }

    function buildRequestSummary() {
      var qty = UI.inputs.quantity ? (parseInt(UI.inputs.quantity.value, 10) || 1) : 1;
      var priceText = UI.display.price ? (UI.display.price.textContent || '') : '';
      var dims = UI.display.dimensions ? (UI.display.dimensions.textContent || '') : '';
      var vol = state.stats.volumeCm3 ? state.stats.volumeCm3.toFixed(2) : '';
      var fileUrl = state.server && state.server.fileUrl ? state.server.fileUrl : '';

      var summary = {
        filename: state.currentFile ? state.currentFile.name : '-',
        material: getSelectedMaterialLabel(),
        color: state.selected.color && state.selected.color.name ? state.selected.color.name : '-',
        quality: getSelectedPresetLabel(),
        qty: qty,
        price: priceText,
        dimensions: dims,
        volume: vol,
        fileUrl: fileUrl
      };

      summary.text =
        '3D-Druck Anfrage\n\n' +
        'Datei: ' + summary.filename + '\n' +
        'Material: ' + summary.material + '\n' +
        'Farbe: ' + summary.color + '\n' +
        'Qualitaet: ' + summary.quality + '\n' +
        'Stueckzahl: ' + summary.qty + '\n' +
        'Preis: ' + summary.price + '\n' +
        'Abmessungen: ' + summary.dimensions + '\n' +
        'Volumen: ' + summary.volume + ' cm3\n' +
        (summary.fileUrl ? 'File URL: ' + summary.fileUrl + '\n' : '');

      return summary;
    }

    function handleMainAction() {
      if (mode === 'demo') {
        if (vars.full_viewer_url) window.open(vars.full_viewer_url, '_blank', 'noopener');
        return;
      }

      if (!state.currentFile) {
        setStatus(strings.status_need_model_first || 'Bitte zuerst ein Modell hochladen.', 'error');
        return;
      }

      if (features.woocommerceEnabled) {
        addToCartWooCommerce();
        return;
      }

      var summary = buildRequestSummary();
      var requestUrl = typeof vars.request_url === 'string' ? vars.request_url.trim() : '';
      if (requestUrl) {
        try {
          var url = new URL(requestUrl, window.location.origin);
          url.searchParams.set('model', summary.filename);
          url.searchParams.set('material', summary.material);
          url.searchParams.set('color', summary.color);
          url.searchParams.set('quality', summary.quality);
          url.searchParams.set('qty', String(summary.qty));
          url.searchParams.set('price', summary.price);
          url.searchParams.set('dimensions', summary.dimensions);
          url.searchParams.set('volume', summary.volume);
          window.location.href = url.toString();
          return;
        } catch (_e) {
          // fall through to email
        }
      }

      var email = typeof vars.request_email === 'string' ? vars.request_email.trim() : '';
      if (email) {
        var subject = encodeURIComponent('3D-Druck Anfrage');
        var body = encodeURIComponent(summary.text);
        window.location.href = 'mailto:' + email + '?subject=' + subject + '&body=' + body;
        return;
      }

      setStatus(strings.status_request_missing || 'Bitte Anfrage-URL oder E-Mail hinterlegen.', 'error');
    }

    function onContextChanged(opts) {
      var o = opts || {};
      applyPreviewColor();

      if (mode === 'demo') {
        computeAndUpdateStats();
        maybeEstimateAndRenderPrice();
        return;
      }

      if (features.serverPricing) {
        if (o.repriceOnly) startServerReprice();
        else startServerSlice();
      }
    }

    function bindUI() {
      // Upload controls (demo mode can disable upload entirely)
      if (!demoDisableUpload) {
        if (UI.browseBtn && UI.fileInput) {
          UI.browseBtn.addEventListener('click', function () {
            UI.fileInput.click();
          });
        }
        if (UI.fileInput) {
          UI.fileInput.addEventListener('change', function (e) {
            if (e.target && e.target.files && e.target.files.length) handleFile(e.target.files[0]);
          });
        }

        if (UI.uploadZone) {
          UI.uploadZone.addEventListener('dragover', function (e) {
            e.preventDefault();
            UI.uploadZone.classList.add('drag-over');
          });
          UI.uploadZone.addEventListener('dragleave', function () {
            UI.uploadZone.classList.remove('drag-over');
          });
          UI.uploadZone.addEventListener('drop', function (e) {
            e.preventDefault();
            UI.uploadZone.classList.remove('drag-over');
            if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
          });
          UI.uploadZone.addEventListener('click', function (e) {
            if (!UI.fileInput) return;
            if (e.target && (e.target.tagName === 'BUTTON' || (e.target.closest && e.target.closest('button')))) return;
            UI.fileInput.click();
          });
          UI.uploadZone.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (UI.fileInput) {
                UI.fileInput.click();
              }
            }
          });
        }
      }

      // Material change
      var materialRadios = mountEl.querySelectorAll('input[name="dld-material"]');
      for (var i = 0; i < materialRadios.length; i++) {
        materialRadios[i].addEventListener('change', function () {
          var checked = mountEl.querySelector('input[name="dld-material"]:checked');
          state.selected.material = checked ? checked.value : state.selected.material;
          renderColorSwatches();
          updateSelectedColorUI();
          onContextChanged({ pricing: true });
        });
      }

      // Preset change
      var presetRadios = mountEl.querySelectorAll('input[name="dld-quality"]');
      for (var j = 0; j < presetRadios.length; j++) {
        presetRadios[j].addEventListener('change', function () {
          var checked = mountEl.querySelector('input[name="dld-quality"]:checked');
          state.selected.preset = checked ? checked.value : state.selected.preset;
          onContextChanged({ pricing: true });
        });
      }

      // Quantity change (debounced)
      var qtyTimer = null;
      if (UI.inputs.quantity) {
        UI.inputs.quantity.addEventListener('input', function () {
          if (qtyTimer) clearTimeout(qtyTimer);
          qtyTimer = setTimeout(function () {
            if (mode === 'demo') {
              onContextChanged({ pricing: true });
            } else {
              onContextChanged({ repriceOnly: true, pricing: true });
            }
          }, 250);
        });
        UI.inputs.quantity.addEventListener('change', function () {
          if (qtyTimer) clearTimeout(qtyTimer);
          qtyTimer = setTimeout(function () {
            if (mode === 'demo') {
              onContextChanged({ pricing: true });
            } else {
              onContextChanged({ repriceOnly: true, pricing: true });
            }
          }, 0);
        });
      }

      // Toolbar
      if (UI.buttons.home) UI.buttons.home.addEventListener('click', function () {
        restoreHomePose();
        setStatus(strings.status_home || 'Home.', 'success');
      });

      if (!demoDisableUpload && UI.buttons.removeFile) UI.buttons.removeFile.addEventListener('click', function () {
        resetModel();
      });

      if (UI.buttons.autoOrient) UI.buttons.autoOrient.addEventListener('click', function () {
        if (!state.rootGroup) return;
        autoOrient();
        computeAndUpdateStats();
        maybeEstimateAndRenderPrice();
        if (state.brand && state.brand.group) positionBrandLogoForContext();
        if (features.serverPricing) startServerSlice();
        setHomePose();
        setStatus(strings.status_auto_orient || 'Auto-Orient angewendet.', 'success');
      });

      if (UI.buttons.layFlat) UI.buttons.layFlat.addEventListener('click', function () {
        if (!state.rootGroup) return;
        layFlat();
        computeAndUpdateStats();
        maybeEstimateAndRenderPrice();
        if (state.brand && state.brand.group) positionBrandLogoForContext();
        if (features.serverPricing) startServerSlice();
        setHomePose();
        setStatus(strings.status_layflat || 'Plan angewendet.', 'success');
      });

      if (UI.buttons.rotate && UI.panels.rotate) UI.buttons.rotate.addEventListener('click', function () {
        state.rotateMode.enabled = !state.rotateMode.enabled;
        UI.buttons.rotate.setAttribute('aria-pressed', state.rotateMode.enabled ? 'true' : 'false');
        UI.buttons.rotate.classList.toggle('active', state.rotateMode.enabled);
        UI.panels.rotate.classList.toggle('is-visible', state.rotateMode.enabled);
        UI.buttons.rotate.setAttribute('aria-expanded', state.rotateMode.enabled ? 'true' : 'false');
        UI.panels.rotate.setAttribute('aria-hidden', state.rotateMode.enabled ? 'false' : 'true');

        if (state.controls) state.controls.enabled = !state.rotateMode.enabled;
        setStatus(
          state.rotateMode.enabled ? (strings.status_rotate_on || 'Rotate Mode aktiv.') : (strings.status_rotate_off || 'Rotate Mode aus.'),
          'info'
        );
      });

      if (UI.buttons.rotX) UI.buttons.rotX.addEventListener('click', function () { rotateObjectAxis('x'); });
      if (UI.buttons.rotY) UI.buttons.rotY.addEventListener('click', function () { rotateObjectAxis('y'); });
      if (UI.buttons.rotZ) UI.buttons.rotZ.addEventListener('click', function () { rotateObjectAxis('z'); });

      // Rotate mode pointer handling on canvas
      if (UI.canvasWrap) {
        UI.canvasWrap.addEventListener('pointerdown', function (e) {
          if (!state.rotateMode.enabled || !state.rootGroup) return;
          state.rotateMode.pointerDown = true;
          state.rotateMode.lastX = e.clientX;
          state.rotateMode.lastY = e.clientY;
          UI.canvasWrap.setPointerCapture(e.pointerId);
        });
        UI.canvasWrap.addEventListener('pointermove', function (e) {
          if (!state.rotateMode.enabled || !state.rotateMode.pointerDown || !state.rootGroup) return;
          var dx = e.clientX - state.rotateMode.lastX;
          var dy = e.clientY - state.rotateMode.lastY;
          state.rotateMode.lastX = e.clientX;
          state.rotateMode.lastY = e.clientY;
          state.rootGroup.rotation.y += dx * 0.01;
          state.rootGroup.rotation.x += dy * 0.01;
        });
        UI.canvasWrap.addEventListener('pointerup', function (e) {
          if (!state.rotateMode.enabled) return;
          state.rotateMode.pointerDown = false;
          try { UI.canvasWrap.releasePointerCapture(e.pointerId); } catch (_e) {}
          setHomePose();
          computeAndUpdateStats();
          maybeEstimateAndRenderPrice();
          if (features.serverPricing) startServerSlice();
        });
      }

      // Analyze toggle
      if (UI.panels.analyzeToggle && UI.panels.analyzeList) {
        UI.panels.analyzeToggle.addEventListener('click', function () {
          var hidden = UI.panels.analyzeList.hasAttribute('hidden');
          if (hidden) {
            UI.panels.analyzeList.removeAttribute('hidden');
            UI.panels.analyzeToggle.setAttribute('aria-expanded', 'true');
          } else {
            UI.panels.analyzeList.setAttribute('hidden', '');
            UI.panels.analyzeToggle.setAttribute('aria-expanded', 'false');
          }
        });
      }

      if (UI.panels.convertLink) {
        UI.panels.convertLink.addEventListener('click', function (e) {
          if (UI.panels.convertLink.dataset.mode === 'api') {
            e.preventDefault();
            startConvert();
          }
        });
      }

      if (UI.panels.repairButton) {
        UI.panels.repairButton.addEventListener('click', function () {
          startRepair();
        });
      }

      // Legal
      if (UI.legal.checkbox) {
        UI.legal.checkbox.addEventListener('change', updateOrderButtonState);
      }

      // Main action button
      if (UI.uploadBtn) {
        UI.uploadBtn.addEventListener('click', function () {
          handleMainAction();
        });
      }
    }

    function rotateObjectAxis(axis) {
      if (!state.rootGroup) return;
      var step = Math.PI / 2;
      if (axis === 'x') state.rootGroup.rotation.x += step;
      if (axis === 'y') state.rootGroup.rotation.y += step;
      if (axis === 'z') state.rootGroup.rotation.z += step;
      setHomePose();
      computeAndUpdateStats();
      maybeEstimateAndRenderPrice();
      if (state.brand && state.brand.group) positionBrandLogoForContext();
      if (features.serverPricing) startServerSlice();
    }

    function getCurrentObjectSize() {
      if (!state.rootGroup) return null;
      state.rootGroup.updateMatrixWorld(true);
      var box = new THREE.Box3().setFromObject(state.rootGroup);
      return box.getSize(new THREE.Vector3());
    }

    function tryOrientation(rotX, rotY, rotZ) {
      if (!state.rootGroup) return null;
      var q0 = state.rootGroup.quaternion.clone();
      var p0 = state.rootGroup.position.clone();

      state.rootGroup.rotation.set(rotX, rotY, rotZ);
      alignToFloorAndCenter(state.rootGroup);
      var size = getCurrentObjectSize();

      state.rootGroup.quaternion.copy(q0);
      state.rootGroup.position.copy(p0);
      state.rootGroup.updateMatrixWorld(true);

      return size;
    }

    function applyOrientation(rotX, rotY, rotZ) {
      if (!state.rootGroup) return;
      state.rootGroup.rotation.set(rotX, rotY, rotZ);
      alignToFloorAndCenter(state.rootGroup);
      fitCameraToObject(state.rootGroup);
    }

    function layFlat() {
      // Simple heuristic: test axis-aligned orientations and pick minimal height.
      if (!state.rootGroup) return;
      var candidates = [
        [0, 0, 0],
        [Math.PI / 2, 0, 0],
        [-Math.PI / 2, 0, 0],
        [0, 0, Math.PI / 2],
        [0, 0, -Math.PI / 2],
        [Math.PI, 0, 0]
      ];

      var best = null;
      var bestH = Infinity;
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        var size = tryOrientation(c[0], c[1], c[2]);
        if (!size) continue;
        if (size.y < bestH) {
          bestH = size.y;
          best = c;
        }
      }
      if (best) applyOrientation(best[0], best[1], best[2]);
    }

    function autoOrient() {
      // Slightly different from layFlat: prioritize compactness (height + footprint).
      if (!state.rootGroup) return;
      var candidates = [
        [0, 0, 0],
        [Math.PI / 2, 0, 0],
        [-Math.PI / 2, 0, 0],
        [0, 0, Math.PI / 2],
        [0, 0, -Math.PI / 2],
        [Math.PI, 0, 0]
      ];

      var best = null;
      var bestScore = Infinity;
      for (var i = 0; i < candidates.length; i++) {
        var c = candidates[i];
        var size = tryOrientation(c[0], c[1], c[2]);
        if (!size) continue;
        var footprint = size.x * size.z;
        var score = size.y * 1.0 + Math.sqrt(footprint) * 0.12;
        if (score < bestScore) {
          bestScore = score;
          best = c;
        }
      }
      if (best) applyOrientation(best[0], best[1], best[2]);
    }

    function loadModelFromData(data, ext) {
      initThreeIfNeeded();
      if (!state.scene) return false;

      // Cleanup old
      if (state.rootGroup) {
        state.scene.remove(state.rootGroup);
        disposeObject3D(state.rootGroup);
        state.rootGroup = null;
      }

      var loaded = null;
      if (ext === 'stl') {
        var geo = new THREE.STLLoader().parse(data);
        geo.computeVertexNormals();
        var material = new THREE.MeshStandardMaterial({
          color: 0xcccccc,
          roughness: 0.55,
          metalness: 0.06,
          side: THREE.DoubleSide
        });
        loaded = new THREE.Mesh(geo, material);
        loaded.rotation.x = -Math.PI / 2;
      } else if (ext === '3mf') {
        var loader = new THREE.ThreeMFLoader();
        loaded = loader.parse(data);
        loaded.traverse(function (child) {
          if (child.isMesh) {
            if (child.geometry) child.geometry.computeVertexNormals();
            child.material = new THREE.MeshStandardMaterial({
              color: 0xcccccc,
              roughness: 0.55,
              metalness: 0.06,
              side: THREE.DoubleSide
            });
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });
        loaded.rotation.x = -Math.PI / 2;
      }

      if (!loaded) return false;

      var group = new THREE.Group();
      group.add(loaded);
      group.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      state.rootGroup = group;
      state.scene.add(state.rootGroup);

      alignToFloorAndCenter(state.rootGroup);
      fitCameraToObject(state.rootGroup);
      setHomePose();

      computeAndUpdateStats();
      applyPreviewColor();

      // With a model loaded: keep the logo visible, shift to a corner.
      if (state.brand && state.brand.group) {
        positionBrandLogoForContext();
      }

      return true;
    }

    function handleFile(file) {
      if (!file) return;

      var maxUploadMb = parseFloat(vars.max_upload_mb || 0);
      if (isFinite(maxUploadMb) && maxUploadMb > 0 && file.size > maxUploadMb * 1024 * 1024) {
        var maxText = maxUploadMb.toFixed(0);
        setStatus(formatTemplate(strings.status_file_too_large || 'Datei zu gross. Max {max} MB.', { max: maxText }), 'error');
        return;
      }

      var name = file.name || '';
      var ext = name.split('.').pop().toLowerCase();
      if (ext !== 'stl' && ext !== '3mf') {
        setStatus(strings.status_invalid_format || 'Ungueltiges Format. Erlaubt: STL, 3MF', 'error');
        return;
      }

      state.currentFile = file;
      state.currentExt = ext;
      if (UI.display.filename) UI.display.filename.textContent = name;
      setUploadOverlayVisible(false);

      setStatus(strings.status_loading_model || 'Lade Modell…', 'info');

      // Clear server state
      state.server.quoteId = null;
      state.server.slicerData = null;
      state.server.price = null;

      var reader = new FileReader();
      reader.onprogress = function (e) {
        if (e.lengthComputable) setProgress((e.loaded / e.total) * 100);
      };
      reader.onload = function (e) {
        try {
          var ok = loadModelFromData(e.target.result, ext);
          if (!ok) {
            setStatus(strings.status_load_failed || 'Modell konnte nicht geladen werden.', 'error');
            return;
          }

          computeAndUpdateStats();

          if (mode === 'demo') {
            maybeEstimateAndRenderPrice();
            setStatus(strings.status_ready_wp || 'Bereit.', 'success');
          } else {
            if (features.serverAnalyze) startAnalyze();
            if (features.serverPricing) startServerSlice();
          }
        } catch (err) {
          console.error('[dld3d] load error', err);
          setStatus(strings.status_load_error || 'Fehler beim Laden.', 'error');
        } finally {
          setProgress(100);
        }
      };
      reader.onerror = function () {
        setStatus(strings.status_read_error || 'Fehler beim Lesen der Datei.', 'error');
      };

      reader.readAsArrayBuffer(file);
    }

    function dispose() {
      stopLoop();

      abortControllerIfAny(state.server.sliceController);
      abortControllerIfAny(state.server.repriceController);
      abortControllerIfAny(state.server.analyzeController);
      abortControllerIfAny(state.server.convertController);
      abortControllerIfAny(state.server.repairController);
      abortControllerIfAny(state.server.demoController);

      if (state.resizeObserver) {
        try { state.resizeObserver.disconnect(); } catch (_e) {}
        state.resizeObserver = null;
      }
      if (state.windowResizeBound) {
        state.windowResizeBound = false;
        if (state.windowResizeHandler) {
          try { window.removeEventListener('resize', state.windowResizeHandler); } catch (_e) {}
        }
        state.windowResizeHandler = null;
      }

      if (state.rootGroup && state.scene) {
        state.scene.remove(state.rootGroup);
        disposeObject3D(state.rootGroup);
      }
      state.rootGroup = null;

      // Brand cleanup (GPU resources).
      if (state.brand) {
        if (state.brand.group && state.scene) {
          try { state.scene.remove(state.brand.group); } catch (_e) {}
          disposeObject3D(state.brand.group);
        }
        state.brand.group = null;
        state.brand.logo = null;
        state.brand.logoIsProcedural = false;
        state.brand.logoBasePos = null;
        state.brand.logoAnchorPos = null;
      }

      if (state.controls && state.controls.dispose) {
        try { state.controls.dispose(); } catch (_e) {}
      }
      state.controls = null;

      if (state.renderer) {
        try { state.renderer.dispose(); } catch (_e) {}
        if (state.renderer.domElement && state.renderer.domElement.parentNode) {
          state.renderer.domElement.parentNode.removeChild(state.renderer.domElement);
        }
      }
      state.renderer = null;
      state.scene = null;
      state.camera = null;

      // Clear DOM
      mountEl.innerHTML = '';
      mountEl.classList.remove('dld3d');
      mountEl.classList.remove('dld3d--mode-demo', 'dld3d--mode-wp', 'dld3d--theme-ivo-tech', 'dld3d--theme-dld', 'dld3d--demo-upload-disabled');
      try { mountEl.__dld3d_controller = null; } catch (_e) {}
    }

    function resize() {
      if (!state.renderer || !state.camera || !UI.canvasWrap) return;
      var w = UI.canvasWrap.clientWidth;
      var h = UI.canvasWrap.clientHeight;
      if (!w || !h) return;
      state.renderer.setSize(w, h);
      state.camera.aspect = w / h;
      state.camera.updateProjectionMatrix();
    }

    // Init
    initDataAndUI();
    bindUI();
    initThreeIfNeeded();
    resetModel();

    // Demo: autoload a model to ensure the demo starts with a visible mesh (no upload prompt needed).
    if (mode === 'demo') {
      var demoUrl = typeof vars.demo_model_url === 'string' ? vars.demo_model_url.trim() : '';
      if (demoUrl) {
        abortControllerIfAny(state.server.demoController);
        var demoController = new AbortController();
        state.server.demoController = demoController;

        var demoFilename = '';
        if (typeof vars.demo_model_filename === 'string' && vars.demo_model_filename.trim()) {
          demoFilename = vars.demo_model_filename.trim();
        } else {
          var cleanUrl = String(demoUrl).split('#')[0].split('?')[0];
          demoFilename = cleanUrl.split('/').pop() || 'demo.stl';
        }

        var ext = demoFilename.split('.').pop().toLowerCase();
        if (ext !== 'stl' && ext !== '3mf') demoFilename = 'demo.stl';

        fetchFileAsBlob(demoUrl, demoController.signal)
          .then(function (blob) {
            if (demoController.signal.aborted) return;
            var file = new File([blob], demoFilename, { type: 'application/octet-stream' });
            handleFile(file);
          })
          .catch(function (err) {
            if (err && err.name === 'AbortError') return;
            setStatus(strings.status_load_failed || 'Demo model could not be loaded.', 'error');
          });
      }
    }

    var controller = { dispose: dispose, resize: resize };
    mountEl.__dld3d_controller = controller;
    return controller;
  }

  window[GLOBAL_KEY] = {
    mount: mount
  };
})();
