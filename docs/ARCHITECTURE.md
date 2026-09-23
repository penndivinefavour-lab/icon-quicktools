# Architecture Document

## Overview

ICON QuickTools is a **static, single-page web application** built with vanilla HTML, CSS, and JavaScript. No build tools, no framework, no backend. Deployed to GitHub Pages.

## Design Decisions

### Why Static?

- **Speed**: No server round-trips. Tools execute instantly in the browser.
- **Offline**: After first load, everything works without internet.
- **Simplicity**: No database, no auth, no sessions, no API rate limits.
- **Hosting**: Any static file server works. Free tiers on GitHub Pages, Netlify, Vercel.
- **Maintainability**: Pure HTML/CSS/JS. No build step to break.

### Why Vanilla JS?

- Android/Termux: Heavy npm packages are slow to install and run.
- Performance: Native DOM APIs are fast; no virtual DOM overhead.
- Learning curve: Simple enough to extend without learning a framework.
- Size: Total JS is ~45KB. No megabytes of framework code.

### Why GitHub Pages?

- Free, reliable, HTTPS-enforced, global CDN.
- Integrates with `gh` CLI for one-command deployment.
- No account management, no billing, no surprise charges.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│ index.html (single shell)                           │
│  ├── #home-screen (active by default)               │
│  │    ├── .topbar (brand + about btn)               │
│  │    ├── .hero (headline + description)            │
│  │    ├── .search-wrap (input)                      │
│  │    ├── .category-filters (chips)                 │
│  │    ├── .tools-grid (tool cards)                  │
│  │    └── .footer                                   │
│  ├── #tool-screen                                   │
│  │    ├── .topbar (back btn + tool title + fav)     │
│  │    └── #tool-body (dynamic content)              │
│  └── #about-screen                                  │
│       └── .about-body                               │
└─────────────────────────────────────────────────────┘

App Flow:
  Home Screen
    │
    ├── Click tool card ──► Tool Screen (dynamic render)
    │                          │
    │                          ├── Tool UI built from ToolRegistry[id].render()
    │                          ├── Event listeners from ToolRegistry[id].onMount()
    │                          └── User interacts, results displayed
    │
    └── Click about ──► About Screen
```

## Module System

Each tool is a self-contained module:

```javascript
(function () {
  const id = 'my-tool';  // unique identifier

  function render() {
    // Returns a DOM element (div) with the tool's UI
    const wrap = document.createElement('div');
    wrap.innerHTML = `...`;
    return wrap;
  }

  function onMount(root) {
    // Called after render() output is inserted into DOM
    // root = the container element
    // Add event listeners, set up state, etc.
    root.querySelector('#some-btn').addEventListener('click', () => { ... });
  }

  // Register globally
  if (!window.ToolRegistry) window.ToolRegistry = {};
  window.ToolRegistry[id] = { id, name, desc, icon, category, render, onMount };
})();
```

This pattern:
- Avoids global namespace pollution (IIFE)
- Makes tools self-contained and testable
- Enables lazy loading (only render when needed)
- Allows tools to be added without modifying core app code

## State Management

- **No global state** beyond current screen and search query.
- **URL hash** is the source of truth for navigation (`#tool-id`).
- **History API** (`pushState`/`popState`) enables back button support.
- **localStorage** for favorites (`qt-favorites`) and recently used (`qt-recently-used`).
- Each tool manages its own internal state (input values, counters, etc.).

## Favorites & Recently Used

- Stored in localStorage as JSON arrays.
- Favorites shown first on home screen with gold border.
- Recently used tracks last 6 tools, shown in order.

## Component System

CSS is organized as a component library:

- `.btn`, `.btn-primary`, `.btn-secondary`, `.btn-ghost` — button variants
- `.input`, `.output-area` — form elements
- `.field` — label + input wrapper
- `.tool-card` — home screen tool cards
- `.category-filters`, `.cat-chip` — filter tabs
- `.stats-row`, `.stat-box` — statistics display
- `.options-row`, `.option` — form options (checkboxes, ranges)
- `.toast`, `.toast-container` — notifications
- `.screen` — full-page screens with `.active` state
- `.tool-card-fav` — favorite tool card styling
- `#fav-btn` — favorites toggle button

## Responsive Strategy

- **Mobile-first**: Base styles are for small screens.
- **Grid layout**: `grid-template-columns: repeat(auto-fill, minmax(155px, 1fr))` adapts from 1 to many columns.
- **Breakpoints**: 480px, 720px, 960px, 1280px — each adds more columns and increases font sizes.
- **Touch targets**: Minimum 40px height for buttons, 42px for primary actions.
- **Sticky header**: Always accessible navigation.

## PWA Layer

### Manifest (`manifest.json`)
- App name, icons, theme color, display mode, categories.
- Enables "Add to Home Screen" on supported browsers.

### Service Worker (`sw.js`)
- **Install**: Pre-caches all static assets.
- **Activate**: Cleans old cache versions.
- **Fetch**: 
  - HTML pages: network-first with cache fallback
  - Static assets: cache-first with network fallback
  - Navigation requests: offline page fallback
- Uses `CACHE_NAME` for versioning.

### Service Worker Registration
```javascript
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
```

## Performance Optimizations

- No external runtime dependencies (only Poppins font from Google).
- QR library vendored locally — no CDN call at runtime.
- CSS is a single file (~14KB), JS modules are small (~2-5KB each).
- No images except the QR canvas output and generated icons.
- Animations use `transform` and `opacity` (GPU-accelerated).
- `prefers-reduced-motion` respected for accessibility.
- Service worker caches assets for instant repeat loads.

## Security Considerations

- **No user data stored** — all processing happens in the browser.
- **No eval() or innerHTML with user input** — tool templates use safe string interpolation.
- **HTML entity escaping** in Markdown previewer to prevent XSS.
- **JWT decoding** clearly warns that decoding ≠ verification.
- **Clipboard API** requires HTTPS or localhost.
- **No external APIs called** — all tools are pure computation.
- **Image compression** uses canvas.toBlob — no upload to any server.

## SEO & Metadata

- **Open Graph** tags for social sharing.
- **Twitter Card** tags for Twitter.
- **Canonical URL** for search engines.
- **robots.txt** allowing all crawlers.
- **404.html** for custom not-found page.
- **Semantic HTML** with proper heading hierarchy.
- **Accessibility labels** on interactive elements.

## Future Architecture Additions (Not in v1.1)

- Tool-specific keyboard shortcuts
- Dark mode toggle
- i18n support (French + English)
- Web Share API integration (partially done)
- Shareable tool result links
- Usage statistics (client-side only)
