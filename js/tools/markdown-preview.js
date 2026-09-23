// Markdown Previewer Tool v1.1 — safe rendering with HTML sanitization
(function () {
  const id = 'markdown-preview';

  // Simple, safe Markdown-to-HTML parser — no regex for headings to avoid conflicts
  function parseMarkdown(md) {
    if (!md) return '';
    let html = md;

    // Escape HTML entities first
    html = html.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    // Code blocks (``` ... ```)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
      return `<pre><code class="lang-${lang}">${code.trim()}</code></pre>`;
    });

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Headers — process in reverse order to avoid conflicts
    html = html.replace(/^######\s+(.+)$/gm, '<h6>$1</h6>');
    html = html.replace(/^#####\s+(.+)$/gm, '<h5>$1</h5>');
    html = html.replace(/^####\s+(.+)$/gm, '<h4>$1</h4>');
    html = html.replace(/^###\s+(.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^##\s+(.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^#\s+(.+)$/gm, '<h1>$1</h1>');

    // Bold and italic
    html = html.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>');
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

    // Links [text](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener" target="_blank">$1</a>');

    // Images ![alt](url)
    html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width:100%; border-radius:8px; margin:8px 0" />');

    // Unordered lists
    html = html.replace(/^\s*[-*]\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');

    // Ordered lists
    html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
    html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ol>$&</ol>');

    // Blockquotes
    html = html.replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>');

    // Horizontal rules
    html = html.replace(/^(---|\*\*\*|___)\s*$/gm, '<hr />');

    // Paragraphs — wrap non-tag lines in <p>
    html = html.replace(/^(?!<[a-z/])((?!<).)+$/gm, '<p>$&</p>');

    // Clean up empty paragraphs
    html = html.replace(/<p>\s*<\/p>/g, '');

    return html;
  }

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">Write Markdown on the left, see a live preview on the right. Safe rendering — no script execution.</p>
      <div style="display:flex; gap:16px; flex-wrap:wrap" class="md-layout">
        <div style="flex:1; min-width:280px">
          <label>Markdown Input</label>
          <textarea id="md-input" class="input" placeholder="# Hello World

This is **bold** and *italic*.

- Item 1
- Item 2
- Item 3

\`\`\`javascript
console.log('code block');
\`\`\`

> A blockquote

[Link](https://example.com)" rows="14" style="font-family:'SF Mono','Cascadia Code','Consolas',monospace; font-size:0.85rem"></textarea>
        </div>
        <div style="flex:1; min-width:280px">
          <label>Preview</label>
          <div id="md-preview" class="input" style="min-height:300px; overflow:auto; line-height:1.6; background:#fafbfe; padding:16px; border-radius:8px; border:1px solid var(--border); font-size:0.9rem">
            <p style="color:var(--text-light)">Preview will appear here…</p>
          </div>
        </div>
      </div>
      <div class="actions">
        <button id="md-copy-html" class="btn btn-secondary btn-icon-text">📋 Copy HTML</button>
        <button id="md-clear" class="btn btn-ghost">Clear</button>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#md-input');
    const preview = root.querySelector('#md-preview');

    function updatePreview() {
      const md = input.value;
      if (!md.trim()) {
        preview.innerHTML = '<p style="color:var(--text-light)">Preview will appear here…</p>';
      } else {
        preview.innerHTML = parseMarkdown(md);
      }
    }

    input.addEventListener('input', updatePreview);

    root.querySelector('#md-copy-html').addEventListener('click', () => {
      const html = preview.innerHTML;
      if (!html || html.includes('Preview will appear here')) {
        window.App.toast('Nothing to copy', 'error');
        return;
      }
      window.App.copyText(html, 'HTML copied');
    });

    root.querySelector('#md-clear').addEventListener('click', () => {
      input.value = '';
      updatePreview();
      window.App.toast('Cleared');
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name: 'Markdown Preview', desc: 'Write & preview Markdown', icon: 'MD', category: 'text', render, onMount };
})();
