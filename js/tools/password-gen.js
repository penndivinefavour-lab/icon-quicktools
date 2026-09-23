// Password Generator Tool v1.1 — uses crypto.getRandomValues for security
(function () {
  const id = 'password-gen';

  function generate(length, upper, lower, numbers, symbols) {
    let chars = '';
    if (upper) chars += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (lower) chars += 'abcdefghijklmnopqrstuvwxyz';
    if (numbers) chars += '0123456789';
    if (symbols) chars += '!@#$%^&*()-_=+[]{}|;:,.<>?';
    if (!chars) chars = 'abcdefghijklmnopqrstuvwxyz';

    // Use crypto.getRandomValues when available for better security
    let password = '';
    if (window.crypto && window.crypto.getRandomValues) {
      const arr = new Uint32Array(length);
      window.crypto.getRandomValues(arr);
      for (let i = 0; i < length; i++) {
        password += chars.charAt(arr[i] % chars.length);
      }
    } else {
      // Fallback (less secure, but functional)
      for (let i = 0; i < length; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
      }
    }
    return password;
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Generate strong, random passwords using cryptographically secure randomness.</p>
      <div class="options-row" style="flex-direction:column; align-items:stretch; gap:12px">
        <label class="option" style="justify-content:space-between">
          <span>Length: <strong id="pg-length-val">16</strong></span>
          <input type="range" id="pg-length" min="6" max="64" value="16" style="width:140px" />
        </label>
        <label class="option"><input type="checkbox" id="pg-upper" checked> Uppercase (A-Z)</label>
        <label class="option"><input type="checkbox" id="pg-lower" checked> Lowercase (a-z)</label>
        <label class="option"><input type="checkbox" id="pg-numbers" checked> Numbers (0-9)</label>
        <label class="option"><input type="checkbox" id="pg-symbols"> Symbols (!@#$…)</label>
      </div>
      <div class="actions">
        <button id="pg-generate" class="btn btn-primary">Generate</button>
        <button id="pg-copy" class="btn btn-secondary btn-icon-text">📋 Copy</button>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Password</label>
        <input id="pg-output" class="input" readonly placeholder="Click Generate…" style="font-family:monospace; font-size:1.1rem; letter-spacing:0.04em" />
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const output = root.querySelector('#pg-output');
    const lengthLabel = root.querySelector('#pg-length-val');
    const lengthInput = root.querySelector('#pg-length');

    lengthInput.addEventListener('input', () => {
      lengthLabel.textContent = lengthInput.value;
    });

    function generatePassword() {
      const len = parseInt(lengthInput.value, 10);
      const upper = root.querySelector('#pg-upper').checked;
      const lower = root.querySelector('#pg-lower').checked;
      const numbers = root.querySelector('#pg-numbers').checked;
      const symbols = root.querySelector('#pg-symbols').checked;
      if (!upper && !lower && !numbers && !symbols) {
        window.App.toast('Select at least one character set', 'error');
        return;
      }
      output.value = generate(len, upper, lower, numbers, symbols);
    }

    root.querySelector('#pg-generate').addEventListener('click', generatePassword);
    root.querySelector('#pg-copy').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to copy', 'error'); return; }
      window.App.copyText(output.value, 'Password copied');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Password Gen', desc: 'Strong passwords (crypto-secure)', icon: '***', category: 'security', render, onMount };
})();
