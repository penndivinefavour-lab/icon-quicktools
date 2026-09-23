// Text Diff Tool v1.1
(function () {
  const id = 'text-diff';

  function diffText(text1, text2) {
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const maxLen = Math.max(lines1.length, lines2.length);
    const result = [];
    
    for (let i = 0; i < maxLen; i++) {
      const line1 = lines1[i] || '';
      const line2 = lines2[i] || '';
      if (line1 === line2) {
        result.push({ type: 'same', line: line1, num: i + 1 });
      } else {
        if (line1) result.push({ type: 'removed', line: line1, num: i + 1 });
        if (line2) result.push({ type: 'added', line: line2, num: i + 1 });
      }
    }
    return result;
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Compare two texts side by side. See what was added, removed, or unchanged.</p>
      <div style="display:flex; gap:16px; flex-wrap:wrap">
        <div style="flex:1; min-width:280px">
          <label>Original</label>
          <textarea id="diff-original" class="input" placeholder="Original text…" rows="8" style="font-family:monospace; font-size:0.85rem"></textarea>
        </div>
        <div style="flex:1; min-width:280px">
          <label>Modified</label>
          <textarea id="diff-modified" class="input" placeholder="Modified text…" rows="8" style="font-family:monospace; font-size:0.85rem"></textarea>
        </div>
      </div>
      <div class="actions" style="margin-top:16px">
        <button id="diff-compare" class="btn btn-primary">Compare</button>
        <button id="diff-clear" class="btn btn-ghost">Clear</button>
      </div>
      <div class="stats-row" style="margin-top:16px">
        <div class="stat-box"><div class="stat-box-value" id="diff-added">0</div><div class="stat-box-label">Added</div></div>
        <div class="stat-box"><div class="stat-box-value" id="diff-removed">0</div><div class="stat-box-label">Removed</div></div>
        <div class="stat-box"><div class="stat-box-value" id="diff-unchanged">0</div><div class="stat-box-label">Unchanged</div></div>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Result</label>
        <div id="diff-output" class="input" style="min-height:100px; background:#fafbfe; font-family:monospace; font-size:0.85rem; white-space:pre-wrap; overflow-wrap:anywhere">Compare two texts to see differences…</div>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const original = root.querySelector('#diff-original');
    const modified = root.querySelector('#diff-modified');
    const output = root.querySelector('#diff-output');
    const addedEl = root.querySelector('#diff-added');
    const removedEl = root.querySelector('#diff-removed');
    const unchangedEl = root.querySelector('#diff-unchanged');

    root.querySelector('#diff-compare').addEventListener('click', () => {
      const t1 = original.value;
      const t2 = modified.value;
      if (!t1 && !t2) {
        output.textContent = 'Compare two texts to see differences…';
        addedEl.textContent = '0';
        removedEl.textContent = '0';
        unchangedEl.textContent = '0';
        return;
      }

      const result = diffText(t1, t2);
      let added = 0, removed = 0, unchanged = 0;
      let html = '';
      for (const item of result) {
        if (item.type === 'same') {
          unchanged++;
          html += `<div style="color:var(--text-muted)">  ${item.line}</div>`;
        } else if (item.type === 'added') {
          added++;
          html += `<div style="background:rgba(56,142,60,0.1); color:#2e7d32">+ ${item.line}</div>`;
        } else {
          removed++;
          html += `<div style="background:rgba(211,47,47,0.1); color:#c62828">- ${item.line}</div>`;
        }
      }
      output.innerHTML = html || '<span style="color:var(--text-light)">No differences found.</span>';
      addedEl.textContent = added;
      removedEl.textContent = removed;
      unchangedEl.textContent = unchanged;
    });

    root.querySelector('#diff-clear').addEventListener('click', () => {
      original.value = '';
      modified.value = '';
      output.textContent = 'Compare two texts to see differences…';
      addedEl.textContent = '0';
      removedEl.textContent = '0';
      unchangedEl.textContent = '0';
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Text Diff', desc: 'Compare two texts', icon: '±', category: 'developer', render, onMount };
})();
