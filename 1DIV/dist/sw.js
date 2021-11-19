// UPDATED: 2021-11-19

const CACHE_NAME = '1DIV-cache-v1';

const INITIAL_CACHED_RESOURCES = [
  './',
  './index.html',
  './favicon.ico',
  './app.css',
  './bundle.js',
  './offline.html'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(INITIAL_CACHED_RESOURCES);
  })());
});

self.addEventListener('fetch', event => {
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    // Try the cache first.
    const cachedResponse = await cache.match(event.request);
    if (cachedResponse !== undefined) {
      // Cache hit, let's send the cached resource.
      return cachedResponse;
    } else {
      // Nothing in cache, let's go to the network.

      try {
        const fetchResponse = await fetch(event.request);
        // Save the new resource in the cache (responses are streams, so we need to clone in order to use it here).
        cache.put(event.request, fetchResponse.clone());

        // And return it.
        return fetchResponse;
      } catch (e) {
        // Fetching didn't work let's go to the error page.
        if (event.request.mode === 'navigate') {
          await rememberRequestedTip(event.request.url);
          const errorResponse = await cache.match('./offline.html');
          return errorResponse;
        }
      }
    }
  })());
});
