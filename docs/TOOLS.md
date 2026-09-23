# Tools Catalog & Development Guide

## Current Tools (v1.1 - 17 tools)

### Text Category

| Tool | File | What It Does |
|------|------|-------------|
| Text Cleaner | `js/tools/text-cleaner.js` | Trim edges, collapse whitespace, remove blank lines, case conversion |
| Word Counter | `js/tools/counter.js` | Real-time words, chars, lines, paragraphs |
| Markdown Preview | `js/tools/markdown-preview.js` | Write Markdown, see live preview (safe rendering) |

### Developer Category

| Tool | File | What It Does |
|------|------|-------------|
| JSON Formatter | `js/tools/json-formatter.js` | Pretty-print, minify, validate with error location |
| URL Encoder | `js/tools/url-coder.js` | Encode/decode percent-encoded URLs |
| Base64 | `js/tools/base64.js` | Encode/decode Base64 (UTF-8 safe) |
| Regex Tester | `js/tools/regex-tester.js` | Test regex patterns with real-time matching |
| Text Diff | `js/tools/text-diff.js` | Compare two texts, see added/removed/unchanged |

### Data Category

| Tool | File | What It Does |
|------|------|-------------|
| CSV ↔ JSON | `js/tools/csv-json.js` | Convert between CSV and JSON formats |
| Timestamp | `js/tools/timestamp.js` | Epoch ↔ date, live clock, ISO + local |

### Security Category

| Tool | File | What It Does |
|------|------|-------------|
| Password Gen | `js/tools/password-gen.js` | Configurable length & character sets (crypto-secure) |
| UUID Generator | `js/tools/uuid-gen.js` | RFC4122 v4 UUIDs, batch generate |
| Hash Generator | `js/tools/hash-gen.js` | SHA-1, SHA-256, SHA-384, SHA-512 via Web Crypto |
| JWT Decoder | `js/tools/jwt-decode.js` | Decode JWT header & payload (no verification!) |

### Media Category

| Tool | File | What It Does |
|------|------|-------------|
| Image Compress | `js/tools/image-compress.js` | Compress/resize images locally (no upload) |
| QR Code | `js/tools/qr-generator.js` | Generate QR codes, download as PNG |

### Utilities Category

| Tool | File | What It Does |
|------|------|-------------|
| Color Converter | `js/tools/color-converter.js` | HEX ↔ RGB ↔ HSL with live preview |

---

## Adding New Tools

### Step 1: Create the Tool File

Create `js/tools/my-tool.js`:

```javascript
(function () {
  const id = 'my-tool';  // unique, kebab-case

  function render() {
    const wrap = document.createElement('div');
    wrap.innerHTML = `
      <p class="tool-desc">What this tool does.</p>
      <div class="field">
        <label>Input</label>
        <textarea id="mt-input" class="input" rows="4"></textarea>
      </div>
      <div class="actions">
        <button id="mt-process" class="btn btn-primary">Process</button>
        <button id="mt-copy" class="btn btn-secondary">📋 Copy</button>
        <button id="mt-reset" class="btn btn-ghost">Reset</button>
      </div>
      <div class="field" style="margin-top:16px">
        <label>Output</label>
        <textarea id="mt-output" class="input" readonly rows="4"></textarea>
      </div>
    `;
    return wrap;
  }

  function onMount(root) {
    const input = root.querySelector('#mt-input');
    const output = root.querySelector('#mt-output');

    root.querySelector('#mt-process').addEventListener('click', () => {
      output.value = input.value.toUpperCase(); // example
    });

    root.querySelector('#mt-copy').addEventListener('click', () => {
      if (!output.value) { window.App.toast('Nothing to copy', 'error'); return; }
      window.App.copyText(output.value, 'Copied');
    });

    root.querySelector('#mt-reset').addEventListener('click', () => {
      input.value = '';
      output.value = '';
    });
  }

  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = {
    id,
    name: 'My Tool',
    desc: 'Short description',
    icon: 'MT',
    category: 'text', // text | developer | data | security | media | utilities
    render,
    onMount
  };
})();
```

### Step 2: Register in app.js

Add to the `TOOLS` array in `js/app.js`:

```javascript
{ id: 'my-tool', name: 'My Tool', desc: 'Short description', icon: 'MT', category: 'text', tag: 'Text' },
```

### Step 3: Add Script Tag

Add to `index.html` before `js/app.js`:

```html
<script src="js/tools/my-tool.js"></script>
```

### Step 4: Test

Run the QA test harness:
```bash
node test-qa.js
```

---

## Category System

Categories are defined in `js/app.js`:

```javascript
const CATEGORIES = [
  { id: 'all', name: 'All', icon: '◯' },
  { id: 'text', name: 'Text', icon: 'Aa' },
  { id: 'developer', name: 'Developer', icon: '{ }' },
  { id: 'data', name: 'Data', icon: '⇄' },
  { id: 'security', name: 'Security', icon: '🔒' },
  { id: 'media', name: 'Media', icon: '🖼' },
  { id: 'utilities', name: 'Utilities', icon: '◉' },
];
```

To add a new category:
1. Add it to the `CATEGORIES` array
2. Set tools to use the new category ID
3. The filter chip is auto-generated

---

## Available App APIs

When writing tools, use these via `window.App`:

| Method | Description |
|--------|-------------|
| `App.toast(msg, type)` | Show notification ('', 'success', 'error') |
| `App.copyText(text, label)` | Copy to clipboard with fallback |
| `App.downloadText(text, filename, mime)` | Trigger file download |
| `App.openTool(id)` | Navigate to another tool |
| `App.goHome()` | Return to home screen |

---

## Future Tool Categories (Planned)

- **Image Utilities**: Compress, resize, convert formats
- **Business Utilities**: Invoice generator, price calculator
- **AI Utilities**: Prompt formatter, token counter
- **Developer Utilities**: Hash generator, regex tester, diff checker
- **Automation Utilities**: Batch processor, template filler

---

## Tool Design Principles

1. **Fast**: Results appear instantly or with a single click
2. **Clear**: Descriptive labels, obvious actions
3. **Forgiving**: Empty input shouldn't break anything
4. **Copyable**: Every output has a copy button
5. **Resettable**: Clear/reset button for starting over
6. **Live where possible**: Real-time updates feel more responsive
7. **Consistent**: Reuse the CSS component classes
8. **Safe**: No eval, no unsanitized input, no data leaks
