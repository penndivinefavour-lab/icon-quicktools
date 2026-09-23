// Text Cleaner Tool
(function () {
  const id = 'text-cleaner';

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Clean up messy text — remove extra whitespace, fix line breaks, change case.</p>
      <div class="field">
        <label>Input text</label>
        <textarea id="tc-input" class="input" placeholder="Paste your messy text here…" rows="5"></textarea>
      </div>
      <div class="options-row">
        <label class="option"><input type="checkbox" id="tc-trim" checked> Trim edges</label>
        <label class="option"><input type="checkbox" id="tc-collapse" checked> Collapse whitespace</label>
        <label class="option"><input type="checkbox" id="tc-blank" checked> Remove blank lines</label>
      </div>
      <div class="options-row">
        <label class="option"><input type="radio" name="tc-case" value="none" checked> No case change</label>
        <label class="option"><input type="radio" name="tc-case" value="lower"> lowercase</label>
        <label class="option"><input type="radio" name="tc-case" value="upper"> UPPERCASE</label>
        <label class="option"><input type="radio" name="tc-case" value="title"> Title Case</label>
        <label class="option"><input type="radio" name="tc-case" value="sentence"> Sentence case</label>
      </div>
      <div class="actions">
        <button id="tc-clean" class="btn btn-primary">Clean Text</button>
        <button id="tc-copy" class="btn btn-secondary btn-icon-text">📋 Copy</button>
        <button id="tc-reset" class="btn btn-ghost">Reset</button>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Result</label>
        <textarea id="tc-output" class="input" readonly placeholder="Cleaned text will appear here…" rows="5"></textarea>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#tc-input');
    const output = root.querySelector('#tc-output');

    function clean() {
      let text = input.value;
      if (!text) {
        output.value = '';
        return;
      }

      const trim = root.querySelector('#tc-trim').checked;
      const collapse = root.querySelector('#tc-collapse').checked;
      const blank = root.querySelector('#tc-blank').checked;
      const caseVal = root.querySelector('input[name="tc-case"]:checked').value;

      if (trim) text = text.trim();
      if (collapse) text = text.replace(/[ \t]+/g, ' ');
      if (blank) text = text.replace(/\n\s*\n/g, '\n');

      switch (caseVal) {
        case 'lower':
          text = text.toLowerCase();
          break;
        case 'upper':
          text = text.toUpperCase();
          break;
        case 'title':
          text = text.replace(
            /\w\S*/g,
            w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
          );
          break;
        case 'sentence':
          text = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
          break;
      }

      output.value = text;
    }

    root.querySelector('#tc-clean').addEventListener('click', () => {
      clean();
      window.App.toast('Text cleaned!');
    });

    root.querySelector('#tc-copy').addEventListener('click', () => {
      if (!output.value) {
        window.App.toast('Nothing to copy', 'error');
        return;
      }
      window.App.copyText(output.value, 'Text copied');
    });

    root.querySelector('#tc-reset').addEventListener('click', () => {
      input.value = '';
      output.value = '';
      window.App.toast('Reset');
    });

    // Live clean on input
    input.addEventListener('input', clean);
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Text Cleaner', desc: 'Fix whitespace & case', icon: 'Aa', category: 'text', render, onMount };
})();
