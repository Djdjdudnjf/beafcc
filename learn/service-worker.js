/* Service Worker for Etqan HTML PWA */
const CACHE_NAME = 'etqan-html-v1';
const urlsToCache = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/js/highlight.js',
  './assets/js/i18n.js',
  './assets/js/lessons.js',
  './assets/js/playground.js',
  './assets/js/quiz.js',
  './assets/js/reference.js',
  './assets/js/videos.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* Installation: cache all assets */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Caching assets on install');
        return cache.addAll(urlsToCache)
          .catch(err => {
            console.warn('[SW] Some assets failed to cache:', err);
            return caches.addAll(urlsToCache.filter(url => {
              return !url.includes('.png');
            }));
          });
      })
  );
  self.skipWaiting();
});

/* Activation: clean up old caches */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

/* Fetch: cache-first strategy for assets, network-first for others */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Only handle http/https requests */
  if (!url.protocol.startsWith('http')) {
    return;
  }

  /* Cache-first for CSS, JS, images, fonts */
  if (
    request.url.includes('/assets/') ||
    request.url.includes('fonts.googleapis.com') ||
    request.url.includes('fonts.gstatic.com') ||
    request.url.endsWith('.png') ||
    request.url.endsWith('.svg')
  ) {
    event.respondWith(
      caches.match(request)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(request)
            .then(response => {
              if (!response || response.status !== 200 || response.type === 'error') {
                return response;
              }
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then(cache => {
                cache.put(request, responseToCache);
              });
              return response;
            })
            .catch(() => {
              /* Offline fallback */
              return new Response('Offline - Content not available', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  } else {
    /* Network-first for HTML and API calls */
    event.respondWith(
      fetch(request)
        .then(response => {
          if (!response || response.status !== 200) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          /* Try cache as fallback */
          return caches.match(request)
            .then(response => {
              if (response) {
                return response;
              }
              /* Last resort: offline page */
              return new Response('Offline - Content not available', {
                status: 503,
                statusText: 'Service Unavailable'
              });
            });
        })
    );
  }
});

/* Handle messages from the main app */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
