// Service Worker for ICON QuickTools v1.1
const CACHE_NAME = 'quicktools-v1.1';
const OFFLINE_URL = '/';

const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/app.js',
  '/js/vendor/qrcode.min.js',
  '/js/tools/text-cleaner.js',
  '/js/tools/counter.js',
  '/js/tools/json-formatter.js',
  '/js/tools/url-coder.js',
  '/js/tools/base64.js',
  '/js/tools/password-gen.js',
  '/js/tools/uuid-gen.js',
  '/js/tools/timestamp.js',
  '/js/tools/color-converter.js',
  '/js/tools/qr-generator.js',
  '/js/tools/image-compress.js',
  '/js/tools/markdown-preview.js',
  '/js/tools/regex-tester.js',
  '/js/tools/hash-gen.js',
  '/js/tools/jwt-decode.js',
  '/js/tools/text-diff.js',
  '/js/tools/csv-json.js',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install: cache all assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => 
      Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

// Fetch: network-first with cache fallback, cache-first for static assets
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // For HTML pages: network first, fallback to cache
  if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request).then(r => r || caches.match(OFFLINE_URL)))
    );
    return;
  }

  // For static assets: cache first, fallback to network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // Cache new static assets for future use
        if (response.ok && (url.pathname.endsWith('.css') || url.pathname.endsWith('.js') || url.pathname.endsWith('.png'))) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // For navigation requests, return offline page
        if (event.request.mode === 'navigate') {
          return caches.match(OFFLINE_URL);
        }
      });
    })
  );
});

// Handle service worker updates
self.addEventListener('message', event => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
