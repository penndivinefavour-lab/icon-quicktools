# Architecture Document

## Overview

ICON QuickTools is a **static, single-page web application** built with vanilla HTML, CSS, and JavaScript. No build tools, no framework, no backend.

## Design Decisions

### Why Static?

- **Speed**: No server round-trips. Tools execute instantly in the browser.
- **Offline**: After first load, everything works without internet.
- **Simplicity**: No database, no auth, no sessions, no API rate limits.
- **Hosting**: Any static file server works. Free tiers on Netlify/Vercel/etc.
- **Maintainability**: Pure HTML/CSS/JS. No build step to break.

### Why Vanilla JS?

- Android/Termux: Heavy npm packages are slow to install and run.
- Performance: Native DOM APIs are fast; no virtual DOM overhead.
- Learning curve: Simple enough to extend without learning a framework.
- Size: Total JS is ~35KB (excluding the 20KB QR library). No megabytes of framework code.

### Why PHP Dev Server?

- Already installed in Termux.
- Zero configuration: `php -S` is a one-liner.
- Serves static files efficiently.
- **Not used in production** — purely local development.

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
│  │    ├── .topbar (back btn + tool title)           │
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
- Each tool manages its own internal state (input values, counters, etc.).

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

## Responsive Strategy

- **Mobile-first**: Base styles are for small screens.
- **Grid layout**: `grid-template-columns: repeat(auto-fill, minmax(155px, 1fr))` adapts from 1 to many columns.
- **Breakpoints**: 480px, 720px, 960px, 1280px — each adds more columns and increases font sizes.
- **Touch targets**: Minimum 40px height for buttons, 42px for primary actions.
- **Sticky header**: Always accessible navigation.

## Performance Optimizations

- No external runtime dependencies (only Poppins font from Google).
- QR library vendored locally — no CDN call at runtime.
- CSS is a single file (~13KB), JS modules are small (~2-5KB each).
- No images except the QR canvas output.
- Animations use `transform` and `opacity` (GPU-accelerated).
- `prefers-reduced-motion` respected for accessibility.

## Security Considerations

- **No user data stored** — all processing happens in the browser.
- **No eval() or innerHTML with user input** — tool templates use safe string interpolation.
- **Clipboard API** requires HTTPS or localhost (with fallback for non-secure).
- **No external APIs called** — all tools are pure computation.

## Future Architecture Additions (Not in v1)

- Service worker for offline caching
- Web Share API integration
- Tool-specific share URLs
- Dark mode toggle
- Tool usage statistics (client-side only)
