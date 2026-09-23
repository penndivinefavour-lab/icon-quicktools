// Hash Generator Tool v1.1 — uses Web Crypto API
(function () {
  const id = 'hash-gen';

  async function generateHash(text, algorithm) {
    if (!text) return '';
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest(algorithm, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Generate cryptographic hashes using the browser's native Web Crypto API.</p>
      <div class="field">
        <label>Input Text</label>
        <textarea id="hg-input" class="input" placeholder="Enter text to hash…" rows="4"></textarea>
      </div>
      <div class="options-row">
        <label class="option"><input type="checkbox" id="hg-sha256" checked> SHA-256</label>
        <label class="option"><input type="checkbox" id="hg-sha1"> SHA-1</label>
        <label class="option"><input type="checkbox" id="hg-sha384"> SHA-384</label>
        <label class="option"><input type="checkbox" id="hg-sha512"> SHA-512</label>
      </div>
      <div class="actions">
        <button id="hg-generate" class="btn btn-primary">Generate</button>
        <button id="hg-reset" class="btn btn-ghost">Clear</button>
      </div>
      <div id="hg-results" style="margin-top:16px"></div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#hg-input');
    const results = root.querySelector('#hg-results');

    root.querySelector('#hg-generate').addEventListener('click', async () => {
      const text = input.value;
      if (!text) { window.App.toast('Enter some text first', 'error'); return; }

      const algorithms = [];
      if (root.querySelector('#hg-sha256').checked) algorithms.push({ name: 'SHA-256', algo: 'SHA-256' });
      if (root.querySelector('#hg-sha1').checked) algorithms.push({ name: 'SHA-1', algo: 'SHA-1' });
      if (root.querySelector('#hg-sha384').checked) algorithms.push({ name: 'SHA-384', algo: 'SHA-384' });
      if (root.querySelector('#hg-sha512').checked) algorithms.push({ name: 'SHA-512', algo: 'SHA-512' });

      if (algorithms.length === 0) {
        window.App.toast('Select at least one algorithm', 'error');
        return;
      }

      results.innerHTML = '<p style="color:var(--text-muted)">Generating…</p>';
      let html = '';
      for (const { name, algo } of algorithms) {
        const hash = await generateHash(text, algo);
        html += `
          <div class="field">
            <label>${name}</label>
            <div style="display:flex; gap:8px; align-items:center">
              <input class="input hg-output" readonly value="${hash}" style="font-family:monospace; font-size:0.85rem" />
              <button class="btn btn-secondary btn-small hg-copy" data-hash="${hash}">📋</button>
            </div>
          </div>`;
      }
      results.innerHTML = html;

      results.querySelectorAll('.hg-copy').forEach(btn => {
        btn.addEventListener('click', () => {
          window.App.copyText(btn.dataset.hash, 'Hash copied');
        });
      });

      window.App.toast('Hashes generated!');
    });

    root.querySelector('#hg-reset').addEventListener('click', () => {
      input.value = '';
      results.innerHTML = '';
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Hash Generator', desc: 'SHA-1/256/384/512', icon: '#', category: 'security', render, onMount };
})();
