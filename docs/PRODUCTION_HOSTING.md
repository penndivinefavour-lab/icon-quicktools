# Production Hosting Guide

## Current State

This project is a **static HTML/CSS/JS application** with no backend, no database, and no server-side logic. The PHP `php -S` server is **for development only** — do not use it in production.

## Current Deployment

**Production URL:** https://penndivinefavour-lab.github.io/icon-quicktools/

**Hosting Platform:** GitHub Pages (free, static, HTTPS enforced)

**Deployment Method:** Push to `main` branch → GitHub Actions auto-deploys via Pages.

## Deploying Updates

```bash
cd "/data/data/com.termux/files/home/ICON Studios 2026/ICON QuickTools"
git add -A
git commit -m "your changes"
git push origin main
```

Within 1-2 minutes, changes will be live at the production URL.

## Verifying Deployment

After pushing, check the deployment status:

```bash
gh run list --repo penndivinefavour-lab/icon-quicktools --limit 3
```

Or open the Actions tab: https://github.com/penndivinefavour-lab/icon-quicktools/actions

## Alternative Deployment Options

### Netlify
1. Go to [netlify.com](https://netlify.com)
2. Create new site → Import from GitHub → select `icon-quicktools`
3. Build settings: no build command, publish directory: root
4. Done — instant deploy with preview URLs

### Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import project → select GitHub repo
3. Framework: Other, Output: static
4. Deploy

### Cloudflare Pages
1. Go to dash.cloudflare.com → Pages
2. Create project → Connect to Git → select repo
3. Build: none, Output: /
4. Get `*.pages.dev` URL + custom domain support

### Manual / Any Static Host

Upload these files to any web server:
- `index.html` (required)
- `404.html` (optional, for custom 404s)
- `css/style.css`
- `js/` (all files)
- `icons/` (all PNGs)
- `manifest.json`
- `sw.js`
- `robots.txt`

## Domain Configuration

To use a custom domain (e.g., `quicktools.iconstudios.com`):

### For GitHub Pages:
1. Add a `CNAME` file with your domain
2. Configure DNS: CNAME record pointing to `penndivinefavour-lab.github.io`
3. In repo Settings → Pages → Custom domain
4. Enable HTTPS enforcement

## Cost Estimate

For a static site with moderate traffic:
- **Free** — GitHub Pages (100GB bandwidth/month)
- **Free** — Netlify (100GB bandwidth/month)
- **Free** — Vercel (100GB bandwidth/month)
- **Free** — Cloudflare Pages (unlimited bandwidth)

## Performance Tips

1. **Cache headers**: GitHub Pages sets appropriate cache headers automatically
2. **CDN**: GitHub Pages, Netlify, Vercel, and Cloudflare all use global CDNs
3. **Compression**: All modern static hosts gzip/Brotli automatically
4. **Service worker**: Our SW handles offline caching and repeat visits

## Monitoring

To check if the site is up:
```bash
curl -sI https://penndivinefavour-lab.github.io/icon-quicktools/ | head -5
```

## Security

- HTTPS is enforced (GitHub Pages provides SSL)
- No secrets in the repo (`.gitignore` excludes .env files)
- Service worker scope is limited to the app origin
- No external APIs called (except Google Fonts on first load)
