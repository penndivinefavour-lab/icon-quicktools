// Timestamp / Date Converter Tool
(function () {
  const id = 'timestamp';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Convert between Unix timestamps (epoch) and human-readable dates.</p>
      <div class="stats-row">
        <div class="stat-box">
          <div class="stat-box-value" id="ts-now">—</div>
          <div class="stat-box-label">Now (seconds)</div>
        </div>
        <div class="stat-box">
          <div class="stat-box-value" id="ts-now-ms">—</div>
          <div class="stat-box-label">Now (ms)</div>
        </div>
      </div>
      <div class="field">
        <label>Timestamp (seconds or milliseconds)</label>
        <input id="ts-input" class="input" placeholder="e.g. 1699999999 or 1699999999000" />
      </div>
      <div class="actions">
        <button id="ts-convert" class="btn btn-primary">Convert</button>
        <button id="ts-copy" class="btn btn-secondary btn-icon-text">📋 Copy</button>
        <button id="ts-now-btn" class="btn btn-ghost">Use Now</button>
      </div>
      <div id="ts-result" style="margin-top:16px"></div>
      <hr style="border:none; border-top:1px solid var(--border); margin:24px 0" />
      <div class="field">
        <label>Date → Timestamp</label>
        <input id="ts-date-input" class="input" placeholder="e.g. 2026-09-23 14:30:00" />
      </div>
      <div class="actions">
        <button id="ts-to-epoch" class="btn btn-secondary">To Timestamp</button>
      </div>
      <div id="ts-epoch-result" style="margin-top:12px"></div>
    `;
    return wrap;
  }

  function formatDate(date) {
    const pad = n => String(n).padStart(2, '0');
    return (
      date.getFullYear() +
      '-' +
      pad(date.getMonth() + 1) +
      '-' +
      pad(date.getDate()) +
      ' ' +
      pad(date.getHours()) +
      ':' +
      pad(date.getMinutes()) +
      ':' +
      pad(date.getSeconds())
    );
  }

  function onMount(root) {
    const input = root.querySelector('#ts-input');
    const output = root.querySelector('#ts-result');
    const nowSec = root.querySelector('#ts-now');
    const nowMs = root.querySelector('#ts-now-ms');
    const dateInput = root.querySelector('#ts-date-input');
    const epochResult = root.querySelector('#ts-epoch-result');

    // Update "now" every second
    function updateNow() {
      const now = Date.now();
      nowSec.textContent = Math.floor(now / 1000);
      nowMs.textContent = now;
    }
    updateNow();
    const nowInterval = setInterval(updateNow, 1000);

    root.querySelector('#ts-convert').addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) {
        output.innerHTML = '<span class="badge badge-error">Enter a timestamp</span>';
        return;
      }
      let ts = parseInt(val, 10);
      if (isNaN(ts)) {
        output.innerHTML = '<span class="badge badge-error">Invalid number</span>';
        return;
      }
      // Detect seconds vs ms (ms are typically > 1e12)
      let date;
      if (ts > 1e12) {
        date = new Date(ts);
      } else {
        date = new Date(ts * 1000);
      }
      if (isNaN(date.getTime())) {
        output.innerHTML = '<span class="badge badge-error">Invalid date</span>';
        return;
      }
      output.innerHTML =
        '<div class="stats-row">' +
        '<div class="stat-box"><div class="stat-box-value" style="font-size:0.95rem">' +
        formatDate(date) +
        '</div><div class="stat-box-label">Local</div></div>' +
        '<div class="stat-box"><div class="stat-box-value" style="font-size:0.95rem">' +
        date.toISOString() +
        '</div><div class="stat-box-label">UTC (ISO)</div></div>' +
        '<div class="stat-box"><div class="stat-box-value" style="font-size:0.95rem">' +
        Math.floor(date.getTime() / 1000) +
        '</div><div class="stat-box-label">Epoch (s)</div></div>' +
        '</div>';
    });

    root.querySelector('#ts-copy').addEventListener('click', () => {
      const val = input.value.trim();
      if (!val) { window.App.toast('Nothing to copy', 'error'); return; }
      let ts = parseInt(val, 10);
      if (ts > 1e12) ts = Math.floor(ts / 1000);
      window.App.copyText(String(ts), 'Timestamp copied');
    });

    root.querySelector('#ts-now-btn').addEventListener('click', () => {
      input.value = Math.floor(Date.now() / 1000);
      root.querySelector('#ts-convert').click();
    });

    root.querySelector('#ts-to-epoch').addEventListener('click', () => {
      const val = dateInput.value.trim();
      if (!val) {
        epochResult.innerHTML = '<span class="badge badge-error">Enter a date</span>';
        return;
      }
      const date = new Date(val);
      if (isNaN(date.getTime())) {
        epochResult.innerHTML = '<span class="badge badge-error">Invalid date format</span>';
        return;
      }
      epochResult.innerHTML =
        '<div class="stats-row">' +
        '<div class="stat-box"><div class="stat-box-value" style="font-size:0.95rem">' +
        Math.floor(date.getTime() / 1000) +
        '</div><div class="stat-box-label">Epoch (s)</div></div>' +
        '<div class="stat-box"><div class="stat-box-value" style="font-size:0.95rem">' +
        date.getTime() +
        '</div><div class="stat-box-label">Epoch (ms)</div></div>' +
        '</div>';
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Timestamp', desc: 'Epoch ↔ Date', icon: 'T', category: 'dev', render, onMount };
})();
