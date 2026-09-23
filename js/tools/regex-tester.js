// Regex Tester Tool v1.1
(function () {
  const id = 'regex-tester';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Test regular expressions against sample text with real-time matching.</p>
      <div class="field">
        <label>Regular Expression</label>
        <div style="display:flex; gap:8px; align-items:center">
          <span style="font-family:monospace; color:var(--text-muted)">/</span>
          <input id="rx-pattern" class="input" placeholder="(\\d+)" style="font-family:monospace; flex:1" />
          <input id="rx-flags" class="input" placeholder="gi" style="font-family:monospace; width:60px; text-align:center" />
        </div>
      </div>
      <div class="field">
        <label>Test String</label>
        <textarea id="rx-text" class="input" placeholder="Order #12345, Item #678" rows="4"></textarea>
      </div>
      <div class="stats-row" id="rx-stats"></div>
      <div id="rx-status" style="margin:8px 0; min-height:20px"></div>
      <div class="field">
        <label>Matches</label>
        <div id="rx-output" class="input" style="min-height:60px; background:#fafbfe; font-family:monospace; font-size:0.85rem; white-space:pre-wrap; overflow-wrap:anywhere">Matches will appear here…</div>
      </div>
      <div class="actions">
        <button id="rx-copy" class="btn btn-secondary btn-icon-text">📋 Copy Matches</button>
        <button id="rx-reset" class="btn btn-ghost">Clear</button>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const patternInput = root.querySelector('#rx-pattern');
    const flagsInput = root.querySelector('#rx-flags');
    const textInput = root.querySelector('#rx-text');
    const output = root.querySelector('#rx-output');
    const status = root.querySelector('#rx-status');
    const stats = root.querySelector('#rx-stats');

    function test() {
      const pattern = patternInput.value;
      const flags = flagsInput.value.trim() || 'g';
      const text = textInput.value;

      if (!pattern) {
        output.textContent = 'Matches will appear here…';
        stats.innerHTML = '';
        status.innerHTML = '';
        return;
      }

      if (!text) {
        output.textContent = 'Enter test text to see matches…';
        stats.innerHTML = '';
        status.innerHTML = '';
        return;
      }

      try {
        const regex = new RegExp(pattern, flags);
        const matches = text.match(regex);
        if (!matches) {
          output.textContent = 'No matches found.';
          stats.innerHTML = '<div class="stat-box"><div class="stat-box-value">0</div><div class="stat-box-label">Matches</div></div>';
          status.innerHTML = '<span class="badge badge-success">Valid regex</span>';
        } else {
          output.textContent = matches.map((m, i) => `[${i + 1}] ${m}`).join('\n');
          stats.innerHTML = `<div class="stat-box"><div class="stat-box-value">${matches.length}</div><div class="stat-box-label">Matches</div></div>`;
          status.innerHTML = '<span class="badge badge-success">Valid regex</span>';
        }
      } catch (err) {
        output.textContent = 'Invalid regex pattern';
        stats.innerHTML = '';
        status.innerHTML = `<span class="badge badge-error">${err.message}</span>`;
      }
    }

    patternInput.addEventListener('input', test);
    flagsInput.addEventListener('input', test);
    textInput.addEventListener('input', test);

    root.querySelector('#rx-copy').addEventListener('click', () => {
      if (output.textContent && !output.textContent.includes('Matches will appear')) {
        window.App.copyText(output.textContent, 'Matches copied');
      } else {
        window.App.toast('Nothing to copy', 'error');
      }
    });

    root.querySelector('#rx-reset').addEventListener('click', () => {
      patternInput.value = '';
      flagsInput.value = '';
      textInput.value = '';
      test();
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Regex Tester', desc: 'Test regex patterns', icon: '.*', category: 'developer', render, onMount };
})();
