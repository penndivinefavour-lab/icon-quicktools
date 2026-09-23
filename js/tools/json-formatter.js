// JSON Formatter / Validator Tool
(function () {
  const id = 'json-formatter';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Format, minify, and validate JSON. Errors are shown with line numbers.</p>
      <div class="field">
        <label>Input JSON</label>
        <textarea id="jf-input" class="input" placeholder='{"key": "value"}' rows="6"></textarea>
      </div>
      <div class="actions">
        <button id="jf-format" class="btn btn-primary">Format</button>
        <button id="jf-minify" class="btn btn-secondary">Minify</button>
        <button id="jf-copy" class="btn btn-secondary btn-icon-text">📋 Copy</button>
        <button id="jf-reset" class="btn btn-ghost">Clear</button>
      </div>
      <div id="jf-status" style="margin:12px 0"></div>
      <div class="field">
        <label>Output</label>
        <textarea id="jf-output" class="input" readonly placeholder="Formatted JSON will appear here…" rows="6"></textarea>
      </div>
    `;
    return wrap;
  }

  function showStatus(root, msg, type) {
    const el = root.querySelector('#jf-status');
    if (!msg) { el.innerHTML = ''; return; }
    const cls = type === 'error' ? 'badge-error' : 'badge-success';
    el.innerHTML = `<span class="badge ${cls}">${msg}</span>`;
  }

  function onMount(root) {
    const input = root.querySelector('#jf-input');
    const output = root.querySelector('#jf-output');

    function parse() {
      const raw = input.value.trim();
      if (!raw) { output.value = ''; showStatus(root, null); return null; }
      try {
        const parsed = JSON.parse(raw);
        showStatus(root, '✓ Valid JSON', 'success');
        return parsed;
      } catch (err) {
        // Extract line/col if possible
        const match = err.message.match(/at position (\d+)/);
        let detail = err.message;
        if (match) {
          const pos = parseInt(match[1], 10);
          const lines = input.value.substring(0, pos).split('\n');
          detail += ` (line ${lines.length}, col ${lines[lines.length - 1].length + 1})`;
        }
        showStatus(root, '✗ ' + detail, 'error');
        return null;
      }
    }

    root.querySelector('#jf-format').addEventListener('click', () => {
      const obj = parse();
      if (obj !== null) {
        output.value = JSON.stringify(obj, null, 2);
        window.App.toast('Formatted!');
      }
    });

    root.querySelector('#jf-minify').addEventListener('click', () => {
      const obj = parse();
      if (obj !== null) {
        output.value = JSON.stringify(obj);
        window.App.toast('Minified!');
      }
    });

    root.querySelector('#jf-copy').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to copy', 'error'); return; }
      window.App.copyText(output.value, 'JSON copied');
    });

    root.querySelector('#jf-reset').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      showStatus(root, null);
      window.App.toast('Cleared');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'JSON Formatter', desc: 'Pretty-print & validate', icon: '{ }', category: 'dev', render, onMount };
})();
