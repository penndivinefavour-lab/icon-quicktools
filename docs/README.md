# ICON QuickTools

**Free, fast, mobile-first web utility platform by ICON Studios.**

A polished, offline-ready collection of everyday tools — text processing, encoding, conversion, generation, and more. No sign-up, no tracking, no bloat.

---

## Quick Start

```bash
cd "/data/data/com.termux/files/home/ICON Studios 2026/ICON QuickTools"
php -S 0.0.0.0:8000
```

Then open **http://localhost:8000** on your phone or any device on the same Wi-Fi network.

For LAN access, find your phone's IP with `ifconfig` and open `http://<your-ip>:8000`.

---

## Project Structure

```
ICON QuickTools/
├── index.html              # Entry point — single HTML shell
├── css/
│   └── style.css           # All styles (design system + components)
├── js/
│   ├── app.js              # Main app: routing, search, categories, navigation
│   ├── tools/              # Individual tool modules (1 per file)
│   │   ├── text-cleaner.js
│   │   ├── counter.js
│   │   ├── json-formatter.js
│   │   ├── url-coder.js
│   │   ├── base64.js
│   │   ├── password-gen.js
│   │   ├── uuid-gen.js
│   │   ├── timestamp.js
│   │   ├── color-converter.js
│   │   └── qr-generator.js
│   └── vendor/
│       └── qrcode.min.js   # QR code library (vendored, offline-ready)
├── docs/
│   ├── README.md           # This file
│   ├── LOCAL_HOSTING.md    # Running locally, LAN access, Termux tips
│   ├── PRODUCTION_HOSTING.md  # Deployment checklist & options
│   ├── ARCHITECTURE.md     # Technical design decisions
│   ├── TOOLS.md            # Tool catalog & adding new tools
│   └── QA_REPORT.md        # Test results
└── test-qa.js              # Automated QA test harness
```

---

## Tools Included

| Tool | Category | What It Does |
|------|----------|-------------|
| **Text Cleaner** | Text | Whitespace cleanup, case conversion (lower, upper, title, sentence) |
| **Word Counter** | Text | Real-time words, characters, lines, paragraphs |
| **JSON Formatter** | Dev | Pretty-print, minify, validate with error location |
| **URL Encoder** | Dev | Encode / decode percent-encoded URLs |
| **Base64** | Dev | Encode / decode Base64 (UTF-8 safe) |
| **Password Gen** | Security | Configurable length & character sets |
| **UUID Generator** | Dev | RFC4122 v4 UUIDs, batch generate |
| **Timestamp** | Dev | Unix epoch ↔ human date, live clock |
| **Color Picker** | Design | HEX ↔ RGB ↔ HSL with live preview |
| **QR Code** | Dev | Generate QR codes, download as PNG |

---

## Technology Choices

| Choice | Reason |
|--------|--------|
| **Static HTML/CSS/JS** | Zero build step, instant load, works offline, trivial to host |
| **No framework** | No React, Vue, or build tools — keeps it fast on low-end Android devices |
| **Poppins typography** | Premium, geometric sans-serif; matches ICON Studios brand |
| **Purple/Navy/Gold** | ICON Studios brand colors (#6b21a8 / #1a2744 / #f5c518) |
| **PHP dev server** | Simple local hosting via `php -S` — no app server required |
| **qrcode.min.js** | Single vendored file (~20KB) for QR generation — no external CDN at runtime |
| **No database** | All tools are pure client-side computation |
| **No accounts** | Everything runs locally in the browser |

---

## Architecture Highlights

- **Modular tools**: Each tool is a self-contained IIFE that registers itself to `window.ToolRegistry`. Adding a new tool = add one file + one entry in the TOOLS array.
- **SPA navigation**: Single-page app with hash-based routing (`#tool-id`). Browser back button works naturally.
- **Screen system**: Three screens (home, tool, about) with smooth transitions.
- **Search & filter**: Real-time search across names, descriptions, tags, and categories.
- **Toast notifications**: Non-intrusive feedback for copy, download, success, and error states.
- **Offline-ready**: All tools work without internet after initial page load.
- **Mobile-first**: 15px base font, 40px touch targets, responsive grid, sticky header.

---

## Brand Compliance

- Colors: Deep Navy `#1A2744`, Rich Purple `#6B21A8`, Gold `#F5C518`, White, Charcoal
- Typography: Poppins (400/500/600/700) via Google Fonts
- Visual style: Clean, spacious, premium — no generic AI-dashboard look
- Icon: Diamond mark `◆` in gold circle on navy

---

## Version

v1.0 — Initial release (September 2026)

**Creator:** Divine Favour · ICON Studios · Yaoundé, Cameroon
