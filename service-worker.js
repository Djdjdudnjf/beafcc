/* =============================================================
   Service Worker — إتقان بايثون / Etqan Python PWA
   ============================================================= */
const CACHE_NAME = 'etqan-python-v2';

/* ملفات المنصة نفسها — تُخزَّن عند التثبيت */
const CORE_ASSETS = [
  './',
  './index.html',
  './assets/css/style.css',
  './assets/js/app.js',
  './assets/js/highlight.js',
  './assets/js/i18n.js',
  './assets/js/lessons.js',
  './assets/js/playground.js',
  './assets/js/pyrunner.js',
  './assets/js/quiz.js',
  './assets/js/reference.js',
  './assets/js/videos.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* هل الطلب لملفات مفسّر بايثون؟ حجمها كبير وثابتة، فتُخزَّن عند أول استعمال */
function isPyodideAsset(url) {
  return url.hostname === 'cdn.jsdelivr.net' && url.pathname.indexOf('/pyodide/') >= 0;
}

/* هل الطلب لأصل ثابت من أصول المنصة أو الخطوط؟ */
function isStaticAsset(url) {
  return url.pathname.indexOf('/assets/') >= 0 ||
         url.hostname === 'fonts.googleapis.com' ||
         url.hostname === 'fonts.gstatic.com' ||
         /\.(png|svg|woff2?)$/.test(url.pathname);
}

/* التثبيت: خزّن ملفات المنصة الأساسية */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS))
      .catch(err => console.warn('[SW] precache incomplete:', err))
  );
  self.skipWaiting();
});

/* التفعيل: احذف النسخ القديمة */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(names => Promise.all(
      names.map(name => name === CACHE_NAME ? null : caches.delete(name))
    ))
  );
  self.clients.claim();
});

/* خزّن نسخة من الاستجابة إن كانت صالحة */
function cachePut(request, response) {
  if (!response || response.status !== 200 || response.type === 'error') return response;
  const copy = response.clone();
  caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {});
  return response;
}

self.addEventListener('fetch', event => {
  const { request } = event;
  if (request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (!url.protocol.startsWith('http')) return;

  /* أولوية التخزين: الأصول الثابتة وملفات بايثون — أسرع، وتعمل بلا اتصال */
  if (isStaticAsset(url) || isPyodideAsset(url)) {
    event.respondWith(
      caches.match(request).then(hit => hit || fetch(request)
        .then(res => cachePut(request, res))
        .catch(() => new Response('Offline', { status: 503, statusText: 'Service Unavailable' })))
    );
    return;
  }

  /* أولوية الشبكة لبقية الطلبات مع الرجوع للمخزَّن عند انقطاع الاتصال */
  event.respondWith(
    fetch(request)
      .then(res => cachePut(request, res))
      .catch(() => caches.match(request).then(hit =>
        hit || caches.match('./index.html') ||
        new Response('Offline', { status: 503, statusText: 'Service Unavailable' })
      ))
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
});
