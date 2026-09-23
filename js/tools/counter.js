// Word & Character Counter Tool
(function () {
  const id = 'counter';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Count words, characters, lines, and paragraphs in real time.</p>
      <div class="field">
        <label>Type or paste text…</label>
        <textarea id="cnt-input" class="input" placeholder="Start typing…" rows="6"></textarea>
      </div>
      <div class="stats-row" id="cnt-stats"></div>
      <div class="actions">
        <button id="cnt-copy" class="btn btn-secondary btn-icon-text">📋 Copy All</button>
        <button id="cnt-reset" class="btn btn-ghost">Clear</button>
      </div>
    `;
    return wrap;
  }

  function countStats(text) {
    if (!text) return { chars: 0, noSpaces: 0, words: 0, lines: 0, paragraphs: 0 };
    const chars = text.length;
    const noSpaces = text.replace(/\s/g, '').length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const lines = text.split('\n').length;
    const paragraphs = text.trim() ? text.split(/\n\s*\n/).filter(p => p.trim()).length : 0;
    return { chars, noSpaces, words, lines, paragraphs };
  }

  function renderStats(root, stats) {
    const container = root.querySelector('#cnt-stats');
    const items = [
      { label: 'Words', value: stats.words },
      { label: 'Characters', value: stats.chars },
      { label: 'No Spaces', value: stats.noSpaces },
      { label: 'Lines', value: stats.lines },
      { label: 'Paragraphs', value: stats.paragraphs },
    ];
    container.innerHTML = items.map(
      item =>
        `<div class="stat-box"><div class="stat-box-value">${item.value.toLocaleString()}</div><div class="stat-box-label">${item.label}</div></div>`
    ).join('');
  }

  function onMount(root) {
    const input = root.querySelector('#cnt-input');
    renderStats(root, { chars: 0, noSpaces: 0, words: 0, lines: 0, paragraphs: 0 });

    input.addEventListener('input', () => {
      const stats = countStats(input.value);
      renderStats(root, stats);
    });

    root.querySelector('#cnt-copy').addEventListener('click', () => {
      if (!input.value) {
        window.App.toast('Nothing to copy', 'error');
        return;
      }
      const stats = countStats(input.value);
      const summary =
        `Words: ${stats.words}\n` +
        `Characters: ${stats.chars}\n` +
        `Characters (no spaces): ${stats.noSpaces}\n` +
        `Lines: ${stats.lines}\n` +
        `Paragraphs: ${stats.paragraphs}\n\n` +
        `---\n\n${input.value}`;
      window.App.copyText(summary, 'Stats copied');
    });

    root.querySelector('#cnt-reset').addEventListener('click', () => {
      input.value = '';
      renderStats(root, { chars: 0, noSpaces: 0, words: 0, lines: 0, paragraphs: 0 });
      window.App.toast('Cleared');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Word Counter', desc: 'Words, chars, lines', icon: '#', category: 'text', render, onMount };
})();
