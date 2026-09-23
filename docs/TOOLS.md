# Tools Catalog & Development Guide

## Current Tools (v1)

### Text Cleaner
- **File**: `js/tools/text-cleaner.js`
- **Category**: Text
- **Features**: Trim edges, collapse whitespace, remove blank lines, case conversion (lower, upper, title, sentence)
- **Live update**: Yes — cleans on every keystroke
- **Copy/Reset**: Yes

### Word & Character Counter
- **File**: `js/tools/counter.js`
- **Category**: Text
- **Features**: Words, characters, characters (no spaces), lines, paragraphs
- **Live update**: Yes — counts on every keystroke
- **Copy**: Yes (includes summary + full text)

### JSON Formatter
- **File**: `js/tools/json-formatter.js`
- **Category**: Dev
- **Features**: Pretty-print (2-space indent), minify, validate with error location
- **Live update**: No — button-triggered
- **Copy**: Yes
- **Error feedback**: Line/column info when available

### URL Encoder/Decoder
- **File**: `js/tools/url-coder.js`
- **Category**: Dev
- **Features**: Encode (encodeURIComponent), decode (decodeURIComponent)
- **Live update**: No — button-triggered
- **Copy**: Yes

### Base64 Encoder/Decoder
- **File**: `js/tools/base64.js`
- **Category**: Dev
- **Features**: Encode/decode with UTF-8 support (btoa/atob with unicode handling)
- **Live update**: No — button-triggered
- **Copy**: Yes

### Password Generator
- **File**: `js/tools/password-gen.js`
- **Category**: Security
- **Features**: Configurable length (6–64), uppercase, lowercase, numbers, symbols
- **Live update**: No — button-triggered
- **Copy**: Yes

### UUID Generator
- **File**: `js/tools/uuid-gen.js`
- **Category**: Dev
- **Features**: Batch generate (1–20), uppercase toggle, uses crypto.randomUUID when available
- **Live update**: No — button-triggered
- **Copy**: Yes (all UUIDs)

### Timestamp Converter
- **File**: `js/tools/timestamp.js`
- **Category**: Dev
- **Features**: Epoch ↔ date, auto-detects seconds vs milliseconds, live "now" clock, ISO + local formats, date → epoch
- **Live update**: Yes — "now" clock updates every second
- **Copy**: Yes

### Color Converter
- **File**: `js/tools/color-converter.js`
- **Category**: Design
- **Features**: HEX ↔ RGB ↔ HSL, live preview, short HEX support (#fff)
- **Live update**: Yes — converts on input
- **Copy**: Yes (each format)

### QR Code Generator
- **File**: `js/tools/qr-generator.js`
- **Category**: Dev
- **Features**: Any text/URL, configurable size (100–400px), dark/light inversion, PNG download
- **Library**: qrcode.min.js (vendored)
- **Download**: Yes (PNG via canvas)

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
    category: 'text', // text | dev | security | design
    render,
    onMount
  };
})();
```

### Step 2: Register in app.js

Add to the `TOOLS` array in `js/app.js`:

```javascript
{
  id: 'my-tool',
  name: 'My Tool',
  desc: 'Short description',
  icon: 'MT',
  category: 'text',
  tag: 'Text',
},
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
  { id: 'all', name: 'All' },
  { id: 'text', name: 'Text' },
  { id: 'dev', name: 'Dev' },
  { id: 'security', name: 'Security' },
  { id: 'design', name: 'Design' },
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
