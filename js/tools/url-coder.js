// URL Encoder / Decoder Tool
(function () {
  const id = 'url-coder';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Encode or decode URL-encoded strings (percent-encoding).</p>
      <div class="field">
        <label>Input</label>
        <textarea id="uc-input" class="input" placeholder="Enter text or URL…" rows="4"></textarea>
      </div>
      <div class="actions">
        <button id="uc-encode" class="btn btn-primary">Encode</button>
        <button id="uc-decode" class="btn btn-primary">Decode</button>
        <button id="uc-copy" class="btn btn-secondary btn-icon-text">📋 Copy</button>
        <button id="uc-reset" class="btn btn-ghost">Clear</button>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Output</label>
        <textarea id="uc-output" class="input" readonly placeholder="Result will appear here…" rows="4"></textarea>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#uc-input');
    const output = root.querySelector('#uc-output');

    root.querySelector('#uc-encode').addEventListener('click', () => {
      try {
        output.value = encodeURIComponent(input.value);
        window.App.toast('Encoded!');
      } catch (e) {
        window.App.toast('Error encoding', 'error');
      }
    });

    root.querySelector('#uc-decode').addEventListener('click', () => {
      try {
        output.value = decodeURIComponent(input.value);
        window.App.toast('Decoded!');
      } catch (e) {
        window.App.toast('Invalid URL encoding', 'error');
      }
    });

    root.querySelector('#uc-copy').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to copy', 'error'); return; }
      window.App.copyText(output.value, 'URL copied');
    });

    root.querySelector('#uc-reset').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      window.App.toast('Cleared');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'URL Encoder', desc: 'Encode / decode URLs', icon: '%', category: 'dev', render, onMount };
})();
