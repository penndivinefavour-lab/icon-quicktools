// Color Converter Tool
(function () {
  const id = 'color-converter';

  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map(c => c + c)
        .join('');
    }
    const num = parseInt(hex, 16);
    return { r: (num >> 16) & 255, g: (num >> 8) & 255, b: num & 255 };
  }

  function rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(v => v.toString(16).padStart(2, '0')).join('');
  }

  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }

  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p, q, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }

  function formatRgb(r, g, b) {
    return `rgb(${r}, ${g}, ${b})`;
  }

  function formatHsl(h, s, l) {
    return `hsl(${h}, ${s}%, ${l}%)`;
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Convert between HEX, RGB, and HSL color formats.</p>
      <div id="cc-preview" style="height:60px; border-radius:12px; background:#6b21a8; margin-bottom:20px; border:1px solid var(--border); transition: background 0.2s"></div>
      <div class="field">
        <label>HEX</label>
        <input id="cc-hex" class="input" placeholder="#6b21a8" style="font-family:monospace" />
      </div>
      <div class="field">
        <label>RGB</label>
        <input id="cc-rgb" class="input" placeholder="rgb(107, 33, 168)" style="font-family:monospace" />
      </div>
      <div class="field">
        <label>HSL</label>
        <input id="cc-hsl" class="input" placeholder="hsl(271, 76%, 36%)" style="font-family:monospace" />
      </div>
      <div class="actions">
        <button id="cc-copy-hex" class="btn btn-secondary btn-small">📋 Copy HEX</button>
        <button id="cc-copy-rgb" class="btn btn-secondary btn-small">📋 Copy RGB</button>
        <button id="cc-copy-hsl" class="btn btn-secondary btn-small">📋 Copy HSL</button>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const hexInput = root.querySelector('#cc-hex');
    const rgbInput = root.querySelector('#cc-rgb');
    const hslInput = root.querySelector('#cc-hsl');
    const preview = root.querySelector('#cc-preview');

    function updatePreview(hex) {
      preview.style.background = hex;
    }

    function syncFromHex(value) {
      let hex = value.trim();
      if (!hex.startsWith('#')) hex = '#' + hex;
      if (!/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(hex)) return false;
      const rgb = hexToRgb(hex);
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      hexInput.value = hex.toLowerCase();
      rgbInput.value = formatRgb(rgb.r, rgb.g, rgb.b);
      hslInput.value = formatHsl(hsl.h, hsl.s, hsl.l);
      updatePreview(hex.toLowerCase());
      return true;
    }

    function syncFromRgb(value) {
      const match = value.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
      if (!match) return false;
      const r = parseInt(match[1], 10);
      const g = parseInt(match[2], 10);
      const b = parseInt(match[3], 10);
      if ([r, g, b].some(v => v < 0 || v > 255)) return false;
      const hex = rgbToHex(r, g, b);
      const hsl = rgbToHsl(r, g, b);
      hexInput.value = hex;
      rgbInput.value = formatRgb(r, g, b);
      hslInput.value = formatHsl(hsl.h, hsl.s, hsl.l);
      updatePreview(hex);
      return true;
    }

    function syncFromHsl(value) {
      const match = value.match(/(\d{1,3})\D+(\d{1,3})\D+(\d{1,3})/);
      if (!match) return false;
      const h = parseInt(match[1], 10);
      const s = parseInt(match[2], 10);
      const l = parseInt(match[3], 10);
      if (h > 360 || s > 100 || l > 100) return false;
      const rgb = hslToRgb(h, s, l);
      const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
      hexInput.value = hex;
      rgbInput.value = formatRgb(rgb.r, rgb.g, rgb.b);
      hslInput.value = formatHsl(h, s, l);
      updatePreview(hex);
      return true;
    }

    hexInput.addEventListener('input', e => syncFromHex(e.target.value));
    rgbInput.addEventListener('input', e => syncFromRgb(e.target.value));
    hslInput.addEventListener('input', e => syncFromHsl(e.target.value));

    root.querySelector('#cc-copy-hex').addEventListener('click', () => {
      if (hexInput.value) window.App.copyText(hexInput.value, 'HEX copied');
    });
    root.querySelector('#cc-copy-rgb').addEventListener('click', () => {
      if (rgbInput.value) window.App.copyText(rgbInput.value, 'RGB copied');
    });
    root.querySelector('#cc-copy-hsl').addEventListener('click', () => {
      if (hslInput.value) window.App.copyText(hslInput.value, 'HSL copied');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Color Picker', desc: 'HEX / RGB / HSL', icon: '◉', category: 'design', render, onMount };
})();
