// Base64 Encoder / Decoder Tool
(function () {
  const id = 'base64';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Encode and decode Base64 strings. Works with text and UTF-8 content.</p>
      <div class="field">
        <label>Input</label>
        <textarea id="b64-input" class="input" placeholder="Enter text to encode or decode…" rows="4"></textarea>
      </div>
      <div class="actions">
        <button id="b64-encode" class="btn btn-primary">Encode</button>
        <button id="b64-decode" class="btn btn-primary">Decode</button>
        <button id="b64-copy" class="btn btn-secondary btn-icon-text">📋 Copy</button>
        <button id="b64-reset" class="btn btn-ghost">Clear</button>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Output</label>
        <textarea id="b64-output" class="input" readonly placeholder="Result will appear here…" rows="4"></textarea>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#b64-input');
    const output = root.querySelector('#b64-output');

    root.querySelector('#b64-encode').addEventListener('click', () => {
      try {
        output.value = btoa(unescape(encodeURIComponent(input.value)));
        window.App.toast('Encoded!');
      } catch (e) {
        window.App.toast('Error encoding', 'error');
      }
    });

    root.querySelector('#b64-decode').addEventListener('click', () => {
      try {
        output.value = decodeURIComponent(escape(atob(input.value.trim())));
        window.App.toast('Decoded!');
      } catch (e) {
        window.App.toast('Invalid Base64 input', 'error');
      }
    });

    root.querySelector('#b64-copy').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to copy', 'error'); return; }
      window.App.copyText(output.value, 'Base64 copied');
    });

    root.querySelector('#b64-reset').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      window.App.toast('Cleared');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Base64', desc: 'Encode & decode', icon: 'B64', category: 'dev', render, onMount };
})();
