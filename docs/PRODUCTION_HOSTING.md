# Production Hosting Guide

## Current State

This project is a **static HTML/CSS/JS application** with no backend, no database, and no server-side logic. The PHP `php -S` server is **for development only** — do not use it in production.

## Deployment Checklist

Before going public, ensure:

- [ ] **Domain name** configured and pointing to your server
- [ ] **SSL certificate** (HTTPS) — required for clipboard API, service workers, and modern browser features
- [ ] **Static file server** configured (Nginx, Apache, Caddy, or Vercel/Netlify)
- [ ] **Cache headers** set for CSS/JS (1 year with hash busting)
- [ ] **Google Fonts** — consider self-hosting Poppins for privacy/offline
- [ ] **Favicon** added
- [ ] **robots.txt** and **sitemap.xml** configured
- [ ] **Analytics** (optional, privacy-respecting)
- [ ] **Error pages** (404, 500)
- [ ] **Gzip/Brotli compression** enabled

## Recommended Deployment Options

### Option 1: Static Hosting (Simplest, Best for v1)

Push to a static host — zero server management.

| Provider | Pros | Notes |
|----------|------|-------|
| **Netlify** | Free tier, drag-and-drop deploy, instant SSL, forms built-in | Just upload the folder |
| **Vercel** | Free tier, Git integration, edge network | Connect repo, auto-deploy |
| **GitHub Pages** | Free, simple, custom domain | Push to `gh-pages` branch |
| **Cloudflare Pages** | Free, fast global CDN, unlimited bandwidth | Best performance |

**Deploy to Netlify (fastest):**
1. Go to [netlify.com](https://netlify.com)
2. Drag the `ICON QuickTools` folder onto the deploy area
3. Done — you get a live URL in seconds

### Option 2: Nginx on a VPS

If you already have a Linux server:

```nginx
server {
    listen 80;
    server_name quicktools.iconstudios.com;
    root /var/www/icon-quicktools;
    index index.html;

    # Cache static assets
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Enable gzip
    gzip on;
    gzip_types text/css application/javascript application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
```

### Option 3: Docker (for consistency)

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
```

Build and run:
```bash
docker build -t icon-quicktools .
docker run -p 8080:80 icon-quicktools
```

## What NOT to Do

- ❌ Don't use `php -S` in production (single-threaded, unsecured, dev only)
- ❌ Don't add a backend unless you actually need server-side processing
- ❌ Don't use a heavy framework for a static site
- ❌ Don't introduce a database — all tools are client-side

## Future Enhancement: Service Worker

For full offline support (after first visit), add a service worker:

```javascript
// sw.js — minimal offline cache
self.addEventListener('install', e => {
  e.waitUntil(caches.open('quicktools-v1').then(cache => {
    return cache.addAll([
      '/',
      '/css/style.css',
      '/js/app.js',
      '/js/tools/text-cleaner.js',
      // ... all tool files
      '/js/vendor/qrcode.min.js'
    ]));
  }));
});
```

This is **not required for v1** but adds resilience.

## Post-Deployment

After going live:
1. Test on real mobile devices (iOS Safari, Android Chrome)
2. Test with slow 3G connection
3. Verify all 10 tools work end-to-end
4. Check console for errors
5. Test back button / deep links (`#json-formatter`)
6. Run Lighthouse audit for performance, accessibility, PWA

## Cost Estimate

For a static site with moderate traffic:
- **Free** — Netlify/Vercel/GitHub Pages
- **~$5/month** — Small VPS (if you need custom server)
- **$0** — Cloudflare Pages with custom domain (free plan is generous)
