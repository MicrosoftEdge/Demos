const CACHE_NAME = "pwa-origin-migration-new-v2";

self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll([
      "./",
      "./index.html",
      "./app.js",
      "./style.css",
      "./manifest.json",
      "./icon-192.png",
      "./icon-512.png"
    ]);
  })());
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) { return cached; }
    try {
      const response = await fetch(event.request);
      cache.put(event.request, response.clone());
      return response;
    } catch (e) {
      return cached || Response.error();
    }
  })());
});
