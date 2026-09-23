// Color Converter Tool v1.1 — Rewritten with robust validation, UX, and reset
(function () {
  const id = 'color-converter';

  // --- Conversion Math ---
  function hexToRgb(hex) {
    hex = hex.replace('#', '').trim();
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return null;
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => Math.max(0, Math.min(255, v)).toString(16).padStart(2, '0')).join('');
  }

  function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }

  function hslToRgb(h, s, l) {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) { r = g = b = l; }
    else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1; if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function formatRgb(r, g, b) { return `rgb(${r}, ${g}, ${b})`; }
  function formatHsl(h, s, l) { return `hsl(${h}, ${s}%, ${l}%)`; }

  function parseRgb(value) {
    // Accept: "107, 33, 168" or "rgb(107, 33, 168)" or "107 33 168"
    const match = value.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
    if (!match) return null;
    const r = parseInt(match[1], 10), g = parseInt(match[2], 10), b = parseInt(match[3], 10);
    if ([r, g, b].some(v => v < 0 || v > 255)) return null;
    return { r, g, b };
  }

  function parseHsl(value) {
    const match = value.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
    if (!match) return null;
    const h = parseInt(match[1], 10), s = parseInt(match[2], 10), l = parseInt(match[3], 10);
    if (h > 360 || s > 100 || l > 100) return null;
    return { h, s, l };
  }

  // --- Render ---
  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Convert between HEX, RGB, and HSL. Live preview updates as you type.</p>
      <div id="cc-preview-row" style="display:flex; gap:12px; align-items:center; margin-bottom:20px">
        <div id="cc-preview" style="flex:1; height:60px; border-radius:12px; background:#6b21a8; border:1px solid var(--border); transition: background 0.15s"></div>
        <div id="cc-swatch-text" style="font-family:monospace; font-size:0.78rem; color:var(--text-muted); text-align:right; min-width:80px">#6b21a8</div>
      </div>
      <div class="field">
        <label for="cc-hex">HEX</label>
        <input id="cc-hex" class="input" placeholder="#6b21a8" style="font-family:monospace" autocomplete="off" />
      </div>
      <div class="field">
        <label for="cc-rgb">RGB</label>
        <input id="cc-rgb" class="input" placeholder="rgb(107, 33, 168)" style="font-family:monospace" autocomplete="off" />
      </div>
      <div class="field">
        <label for="cc-hsl">HSL</label>
        <input id="cc-hsl" class="input" placeholder="hsl(271, 76%, 36%)" style="font-family:monospace" autocomplete="off" />
      </div>
      <div id="cc-error" style="margin:8px 0; min-height:20px"></div>
      <div class="actions">
        <button id="cc-copy-hex" class="btn btn-secondary btn-small btn-icon-text">📋 HEX</button>
        <button id="cc-copy-rgb" class="btn btn-secondary btn-small btn-icon-text">📋 RGB</button>
        <button id="cc-copy-hsl" class="btn btn-secondary btn-small btn-icon-text">📋 HSL</button>
        <button id="cc-reset" class="btn btn-ghost">Reset</button>
      </div>
    `;
    return wrap;
  }

  // --- Mount ---
  function onMount(root) {
    const hexInput = root.querySelector('#cc-hex');
    const rgbInput = root.querySelector('#cc-rgb');
    const hslInput = root.querySelector('#cc-hsl');
    const preview = root.querySelector('#cc-preview');
    const swatchText = root.querySelector('#cc-swatch-text');
    const errorEl = root.querySelector('#cc-error');
    let lastValidHex = '#6b21a8';

    function setError(msg) {
      errorEl.innerHTML = msg ? `<span class="badge badge-error" style="font-size:0.75rem">${msg}</span>` : '';
    }

    function updatePreview(hex) {
      preview.style.background = hex;
      swatchText.textContent = hex;
    }

    function syncFrom(source) {
      setError('');
      const hexVal = hexInput.value.trim();
      const rgbVal = rgbInput.value.trim();
      const hslVal = hslInput.value.trim();

      if (source === 'hex') {
        let hex = hexVal;
        if (!hex.startsWith('#')) hex = '#' + hex;
        const rgb = hexToRgb(hex);
        if (!rgb) {
          // Partial/invalid - don't clear other fields, just show subtle error
          if (hex.length > 1) setError('Invalid HEX format');
          return;
        }
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        lastValidHex = hex.toLowerCase();
        hexInput.value = lastValidHex;
        rgbInput.value = formatRgb(rgb.r, rgb.g, rgb.b);
        hslInput.value = formatHsl(hsl.h, hsl.s, hsl.l);
        updatePreview(lastValidHex);
      } else if (source === 'rgb') {
        const rgb = parseRgb(rgbVal);
        if (!rgb) {
          if (rgbVal.length > 3) setError('Invalid RGB format');
          return;
        }
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
        lastValidHex = hex;
        hexInput.value = hex;
        rgbInput.value = formatRgb(rgb.r, rgb.g, rgb.b);
        hslInput.value = formatHsl(hsl.h, hsl.s, hsl.l);
        updatePreview(hex);
      } else if (source === 'hsl') {
        const hsl = parseHsl(hslVal);
        if (!hsl) {
          if (hslVal.length > 3) setError('Invalid HSL format');
          return;
        }
        const rgb = hslToRgb(hsl.h, hsl.s, hsl.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
        lastValidHex = hex;
        hexInput.value = hex;
        rgbInput.value = formatRgb(rgb.r, rgb.g, rgb.b);
        hslInput.value = formatHsl(hsl.h, hsl.s, hsl.l);
        updatePreview(hex);
      }
    }

    hexInput.addEventListener('input', () => syncFrom('hex'));
    rgbInput.addEventListener('input', () => syncFrom('rgb'));
    hslInput.addEventListener('input', () => syncFrom('hsl'));

    // Copy buttons
    root.querySelector('#cc-copy-hex').addEventListener('click', () => {
      if (hexInput.value) window.App.copyText(hexInput.value, 'HEX copied');
      else window.App.toast('Nothing to copy', 'error');
    });
    root.querySelector('#cc-copy-rgb').addEventListener('click', () => {
      if (rgbInput.value) window.App.copyText(rgbInput.value, 'RGB copied');
      else window.App.toast('Nothing to copy', 'error');
    });
    root.querySelector('#cc-copy-hsl').addEventListener('click', () => {
      if (hslInput.value) window.App.copyText(hslInput.value, 'HSL copied');
      else window.App.toast('Nothing to copy', 'error');
    });

    // Reset button
    root.querySelector('#cc-reset').addEventListener('click', () => {
      hexInput.value = '#6b21a8';
      rgbInput.value = 'rgb(107, 33, 168)';
      hslInput.value = 'hsl(271, 76%, 36%)';
      lastValidHex = '#6b21a8';
      updatePreview('#6b21a8');
      setError('');
      window.App.toast('Reset to default');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Color Converter', desc: 'HEX / RGB / HSL', icon: '◉', category: 'design', render, onMount };
})();
