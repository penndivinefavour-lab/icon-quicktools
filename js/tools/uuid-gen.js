// UUID Generator Tool
(function () {
  const id = 'uuid-gen';

  function generateUUID() {
    // RFC4122 v4 UUID using crypto if available, fallback to Math.random
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    // Fallback
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Generate random UUIDs (v4) / GUIDs. Uses crypto.randomUUID when available.</p>
      <div class="options-row" style="flex-direction:column; align-items:stretch; gap:12px">
        <label class="option" style="justify-content:space-between">
          <span>Count: <strong id="ug-count-val">5</strong></span>
          <input type="range" id="ug-count" min="1" max="20" value="5" style="width:140px" />
        </label>
        <label class="option"><input type="checkbox" id="ug-upper"> Uppercase</label>
      </div>
      <div class="actions">
        <button id="ug-generate" class="btn btn-primary">Generate</button>
        <button id="ug-copy" class="btn btn-secondary btn-icon-text">📋 Copy All</button>
        <button id="ug-reset" class="btn btn-ghost">Clear</button>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Output</label>
        <textarea id="ug-output" class="input" readonly placeholder="UUIDs will appear here…" rows="6" style="font-family:monospace; font-size:0.85rem"></textarea>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const output = root.querySelector('#ug-output');
    const countLabel = root.querySelector('#ug-count-val');
    const countInput = root.querySelector('#ug-count');

    countInput.addEventListener('input', () => {
      countLabel.textContent = countInput.value;
    });

    root.querySelector('#ug-generate').addEventListener('click', () => {
      const count = parseInt(countInput.value, 10);
      const upper = root.querySelector('#ug-upper').checked;
      const uuids = [];
      for (let i = 0; i < count; i++) {
        let uuid = generateUUID();
        if (upper) uuid = uuid.toUpperCase();
        uuids.push(uuid);
      }
      output.value = uuids.join('\n');
      window.App.toast('Generated!');
    });

    root.querySelector('#ug-copy').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to copy', 'error'); return; }
      window.App.copyText(output.value, 'UUIDs copied');
    });

    root.querySelector('#ug-reset').addEventListener('click', () => {
      output.value = '';
      window.App.toast('Cleared');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'UUID Generator', desc: 'Random UUIDs / GUIDs', icon: 'ID', category: 'dev', render, onMount };
})();
