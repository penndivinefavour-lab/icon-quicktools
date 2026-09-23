// QR Code Generator Tool
(function () {
  const id = 'qr-generator';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Generate QR codes from text, URLs, or any data. Download as PNG.</p>
      <div class="field">
        <label>Text or URL</label>
        <textarea id="qr-input" class="input" placeholder="Enter text, URL, WiFi config, contact info…" rows="3"></textarea>
      </div>
      <div class="options-row" style="flex-direction:column; align-items:stretch; gap:12px">
        <label class="option" style="justify-content:space-between">
          <span>Size: <strong id="qr-size-val">200</strong>px</span>
          <input type="range" id="qr-size" min="100" max="400" value="200" step="20" style="width:140px" />
        </label>
        <label class="option"><input type="checkbox" id="qr-dark" checked> Dark on light (unchecked = light on dark)</label>
      </div>
      <div class="actions">
        <button id="qr-generate" class="btn btn-primary">Generate</button>
        <button id="qr-download" class="btn btn-secondary">📥 Download PNG</button>
      </div>
      <div id="qr-result" style="margin-top:24px; text-align:center"></div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#qr-input');
    const result = root.querySelector('#qr-result');
    const sizeLabel = root.querySelector('#qr-size-val');
    const sizeInput = root.querySelector('#qr-size');
    const darkToggle = root.querySelector('#qr-dark');

    sizeInput.addEventListener('input', () => {
      sizeLabel.textContent = sizeInput.value;
    });

    root.querySelector('#qr-generate').addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) {
        result.innerHTML = '<span class="badge badge-error">Enter some text first</span>';
        return;
      }

      const size = parseInt(sizeInput.value, 10);
      const dark = darkToggle.checked;

      result.innerHTML = '<div id="qr-code"></div>';

      try {
        new QRCode(document.getElementById('qr-code'), {
          text: text,
          width: size,
          height: size,
          colorDark: dark ? '#1a2744' : '#ffffff',
          colorLight: dark ? '#ffffff' : '#1a2744',
          correctLevel: QRCode.CorrectLevel.M,
        });
        window.App.toast('QR code generated!');
      } catch (e) {
        result.innerHTML = '<span class="badge badge-error">Error generating QR code</span>';
      }
    });

    root.querySelector('#qr-download').addEventListener('click', () => {
      const canvas = result.querySelector('canvas');
      const img = result.querySelector('img');
      if (!canvas && !img) {
        window.App.toast('Generate a QR code first', 'error');
        return;
      }
      let dataUrl;
      if (canvas) {
        dataUrl = canvas.toDataURL('image/png');
      } else {
        dataUrl = img.src;
      }
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'icon-quicktools-qr.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.App.toast('Downloaded!');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'QR Code', desc: 'Generate QR codes', icon: '▦', category: 'dev', render, onMount };
})();
