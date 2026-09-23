// CSV to JSON Converter Tool v1.1
(function () {
  const id = 'csv-json';

  function csvToJson(csv) {
    const lines = csv.split(/\r?\n/).filter(line => line.trim());
    if (lines.length < 2) return [];
    const headers = lines[0].split(',').map(h => h.trim());
    const result = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      const obj = {};
      headers.forEach((h, idx) => {
        obj[h] = values[idx] || '';
      });
      result.push(obj);
    }
    return result;
  }

  function jsonToCsv(json) {
    if (!json.length) return '';
    const headers = Object.keys(json[0]);
    const rows = json.map(obj => headers.map(h => obj[h] ?? '').join(','));
    return [headers.join(','), ...rows].join('\n');
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Convert between CSV and JSON formats. Simple conversion without external dependencies.</p>
      <div class="field">
        <label for="cj-input">Input</label>
        <textarea id="cj-input" class="input" placeholder='name,age,city
Alice,30,New York
Bob,25,London' rows="8" style="font-family:monospace; font-size:0.85rem"></textarea>
      </div>
      <div class="options-row">
        <label class="option"><input type="radio" name="cj-dir" value="csv-to-json" checked> CSV → JSON</label>
        <label class="option"><input type="radio" name="cj-dir" value="json-to-csv"> JSON → CSV</label>
      </div>
      <div class="actions">
        <button id="cj-convert" class="btn btn-primary">Convert</button>
        <button id="cj-copy" class="btn btn-secondary btn-icon-text">📋 Copy</button>
        <button id="cj-download" class="btn btn-secondary">📥 Download</button>
        <button id="cj-clear" class="btn btn-ghost">Clear</button>
      </div>
      <div id="cj-status" style="margin:8px 0; min-height:20px"></div>
      <div class="field">
        <label>Output</label>
        <textarea id="cj-output" class="input" readonly placeholder="Result will appear here…" rows="8" style="font-family:monospace; font-size:0.85rem"></textarea>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#cj-input');
    const output = root.querySelector('#cj-output');
    const status = root.querySelector('#cj-status');

    root.querySelector('#cj-convert').addEventListener('click', () => {
      const text = input.value.trim();
      if (!text) {
        status.innerHTML = '<span class="badge badge-error">Enter some input first</span>';
        return;
      }

      const dir = root.querySelector('input[name="cj-dir"]:checked').value;
      if (dir === 'csv-to-json') {
        const result = csvToJson(text);
        if (result.length === 0) {
          status.innerHTML = '<span class="badge badge-error">CSV must have a header row + at least one data row</span>';
          return;
        }
        output.value = JSON.stringify(result, null, 2);
        status.innerHTML = `<span class="badge badge-success">${result.length} rows converted</span>`;
      } else {
        try {
          const parsed = JSON.parse(text);
          if (!Array.isArray(parsed)) {
            status.innerHTML = '<span class="badge badge-error">Input must be a JSON array</span>';
            return;
          }
          output.value = jsonToCsv(parsed);
          status.innerHTML = `<span class="badge badge-success">${parsed.length} rows converted</span>`;
        } catch (e) {
          status.innerHTML = `<span class="badge badge-error">${e.message}</span>`;
        }
      }
    });

    root.querySelector('#cj-copy').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to copy', 'error'); return; }
      window.App.copyText(output.value, 'Result copied');
    });

    root.querySelector('#cj-download').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to download', 'error'); return; }
      const dir = root.querySelector('input[name="cj-dir"]:checked').value;
      const ext = dir === 'csv-to-json' ? 'json' : 'csv';
      window.App.downloadText(output.value, `converted.${ext}`);
    });

    root.querySelector('#cj-clear').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      status.innerHTML = '';
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'CSV ↔ JSON', desc: 'Convert between formats', icon: '⇄', category: 'data', render, onMount };
})();
