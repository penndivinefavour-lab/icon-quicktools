# ICON QuickTools

**Free, fast, mobile-first web utility platform by ICON Studios.**

A polished, offline-ready collection of 17+ everyday tools — text processing, encoding, conversion, image utilities, developer tools, security tools, and more. No sign-up, no tracking, no bloat.

**Live URL:** https://penndivinefavour-lab.github.io/icon-quicktools/

---

## Quick Start (Local Development)

```bash
cd "/data/data/com.termux/files/home/ICON Studios 2026/ICON QuickTools"
php -S 0.0.0.0:8000
```

Then open **http://localhost:8000** on your phone or any device on the same Wi-Fi network.

---

## Project Structure

```
ICON QuickTools/
├── index.html              # Entry point — single HTML shell
├── 404.html                # Custom 404 page
├── manifest.json           # PWA manifest
├── sw.js                   # Service worker (offline caching)
├── robots.txt              # SEO robots file
├── css/
│   └── style.css           # All styles (design system + components)
├── icons/
│   ├── icon-16.png         # Favicon
│   ├── icon-32.png         # Favicon
│   ├── icon-192.png        # PWA icon
│   ├── icon-512.png        # PWA icon
│   └── generate_icons.py   # Icon generation script
├── js/
│   ├── app.js              # Main app: routing, search, categories, navigation
│   ├── tools/              # Individual tool modules (1 per file)
│   │   ├── text-cleaner.js
│   │   ├── counter.js
│   │   ├── markdown-preview.js
│   │   ├── json-formatter.js
│   │   ├── url-coder.js
│   │   ├── base64.js
│   │   ├── regex-tester.js
│   │   ├── text-diff.js
│   │   ├── csv-json.js
│   │   ├── timestamp.js
│   │   ├── password-gen.js
│   │   ├── uuid-gen.js
│   │   ├── hash-gen.js
│   │   ├── jwt-decode.js
│   │   ├── image-compress.js
│   │   ├── color-converter.js
│   │   └── qr-generator.js
│   └── vendor/
│       └── qrcode.min.js   # QR code library (vendored, offline-ready)
└── docs/
    ├── README.md           # This file
    ├── LOCAL_HOSTING.md    # Running locally, LAN access, Termux tips
    ├── PRODUCTION_HOSTING.md  # Deployment checklist & options
    ├── ARCHITECTURE.md     # Technical design decisions
    ├── TOOLS.md            # Tool catalog & adding new tools
    └── QA_REPORT.md        # Test results
```

---

## Tools Included (17)

| Tool | Category | What It Does |
|------|----------|-------------|
| **Text Cleaner** | Text | Whitespace cleanup, case conversion (lower, upper, title, sentence) |
| **Word Counter** | Text | Real-time words, characters, lines, paragraphs |
| **Markdown Preview** | Text | Write Markdown, see live preview (safe rendering) |
| **JSON Formatter** | Dev | Pretty-print, minify, validate with error location |
| **URL Encoder** | Dev | Encode / decode percent-encoded URLs |
| **Base64** | Dev | Encode / decode Base64 (UTF-8 safe) |
| **Regex Tester** | Dev | Test regex patterns with real-time matching |
| **Text Diff** | Dev | Compare two texts, see added/removed/unchanged |
| **CSV ↔ JSON** | Data | Convert between CSV and JSON formats |
| **Timestamp** | Data | Unix epoch ↔ human date, live clock |
| **Password Gen** | Security | Configurable length & character sets (crypto-secure) |
| **UUID Generator** | Security | RFC4122 v4 UUIDs, batch generate |
| **Hash Generator** | Security | SHA-1, SHA-256, SHA-384, SHA-512 via Web Crypto |
| **JWT Decoder** | Security | Decode JWT header & payload (no verification) |
| **Image Compress** | Media | Compress/resize images locally (no upload) |
| **QR Code** | Media | Generate QR codes, download as PNG |
| **Color Converter** | Utils | HEX ↔ RGB ↔ HSL with live preview |

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
| **PWA** | Installable, offline-capable via service worker |

---

## Architecture Highlights

- **Modular tools**: Each tool is a self-contained IIFE that registers itself to `window.ToolRegistry`. Adding a new tool = add one file + one entry in the TOOLS array.
- **SPA navigation**: Single-page app with hash-based routing (`#tool-id`). Browser back button works naturally.
- **Screen system**: Three screens (home, tool, about) with smooth transitions.
- **Search & filter**: Real-time search across names, descriptions, tags, and categories.
- **Favorites & recently used**: Stored in localStorage — no account needed.
- **Toast notifications**: Non-intrusive feedback for copy, download, success, and error states.
- **Offline-ready**: All tools work without internet after initial page load.
- **Mobile-first**: 15px base font, 40px touch targets, responsive grid, sticky header.
- **PWA**: Service worker caches all assets for full offline support.

---

## Deployment

**Production URL:** https://penndivinefavour-lab.github.io/icon-quicktools/

**Hosting:** GitHub Pages (free, static, HTTPS enforced)

**Deployment method:** Push to `main` branch → GitHub Actions auto-deploys.

---

## Brand Compliance

- Colors: Deep Navy `#1A2744`, Rich Purple `#6B21A8`, Gold `#F5C518`, White, Charcoal
- Typography: Poppins (400/500/600/700) via Google Fonts
- Visual style: Clean, spacious, premium — no generic AI-dashboard look
- Icon: Diamond mark `◆` in gold circle on navy

---

## Version

**v1.1** — September 23, 2026

**Creator:** Divine Favour · ICON Studios · Yaoundé, Cameroon
