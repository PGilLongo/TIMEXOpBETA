/* TIMEX PWA Service Worker
   - Cache-first for app shell (HTML/CSS/JS/icons)
   - Network-first for external resources (CDN tiles, etc.)
*/
const CACHE_NAME = "timex-pwa-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./NAVEGADOR.html",
  "./PDF TIMEX.html",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;

  // Only handle GET
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // App shell: cache-first
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => cached || fetch(req).then((resp) => {
        // Cache new same-origin files
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
        return resp;
      }))
    );
    return;
  }

  // External: network-first with cache fallback
  event.respondWith(
    fetch(req).then((resp) => {
      const copy = resp.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
      return resp;
    }).catch(() => caches.match(req))
  );
});
