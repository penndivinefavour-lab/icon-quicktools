// JWT Decoder Tool v1.1 — decode only, no signature verification
(function () {
  const id = 'jwt-decode';

  function decodeJWT(token) {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    try {
      const header = JSON.parse(atob(parts[0]));
      const payload = JSON.parse(atob(parts[1]));
      return { header, payload };
    } catch (e) {
      return null;
    }
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Decode JWT (JSON Web Token) header and payload. <strong style="color:var(--error)">Note: Decoding does NOT verify the signature — only use for inspection, not authorization.</strong></p>
      <div class="field">
        <label>JWT Token</label>
        <textarea id="jwt-input" class="input" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c" rows="3" style="font-family:monospace; font-size:0.85rem"></textarea>
      </div>
      <div class="actions">
        <button id="jwt-decode-btn" class="btn btn-primary">Decode</button>
        <button id="jwt-reset" class="btn btn-ghost">Clear</button>
      </div>
      <div id="jwt-results" style="margin-top:16px"></div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#jwt-input');
    const results = root.querySelector('#jwt-results');

    root.querySelector('#jwt-decode-btn').addEventListener('click', () => {
      const token = input.value.trim();
      if (!token) { window.App.toast('Enter a JWT first', 'error'); return; }

      const decoded = decodeJWT(token);
      if (!decoded) {
        results.innerHTML = '<span class="badge badge-error">Invalid JWT format — must have 3 parts (header.payload.signature)</span>';
        return;
      }

      results.innerHTML = `
        <div class="field">
          <label>Header</label>
          <pre class="input" style="font-family:monospace; font-size:0.85rem; background:#fafbfe; white-space:pre-wrap; overflow-wrap:anywhere">${JSON.stringify(decoded.header, null, 2)}</pre>
        </div>
        <div class="field">
          <label>Payload</label>
          <pre class="input" style="font-family:monospace; font-size:0.85rem; background:#fafbfe; white-space:pre-wrap; overflow-wrap:anywhere">${JSON.stringify(decoded.payload, null, 2)}</pre>
        </div>
        <div class="actions">
          <button id="jwt-copy-header" class="btn btn-secondary btn-small btn-icon-text">📋 Copy Header</button>
          <button id="jwt-copy-payload" class="btn btn-secondary btn-small btn-icon-text">📋 Copy Payload</button>
        </div>
      `;

      root.querySelector('#jwt-copy-header').addEventListener('click', () => {
        window.App.copyText(JSON.stringify(decoded.header, null, 2), 'Header copied');
      });
      root.querySelector('#jwt-copy-payload').addEventListener('click', () => {
        window.App.copyText(JSON.stringify(decoded.payload, null, 2), 'Payload copied');
      });
    });

    root.querySelector('#jwt-reset').addEventListener('click', () => {
      input.value = '';
      results.innerHTML = '';
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'JWT Decoder', desc: 'Decode JWT header & payload', icon: 'JWT', category: 'security', render, onMount };
})();
