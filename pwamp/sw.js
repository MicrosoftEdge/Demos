const VERSION = "v2";
const CACHE_NAME = `pwamp-${VERSION}`;

const INITIAL_CACHED_RESOURCES = [
  "./",
  "./skins/default.css",
  "./app.js",
  "./exporter.js",
  "./importer.js",
  "./player.js",
  "./popup-polyfill.js",
  "./recorder.js",
  "./skin.js",
  "./song-ui-factory.js",
  "./store.js",
  "./utils.js",
  "./visualizer.js",
];

// On install, fill the cache with all the resources we know we need.
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(INITIAL_CACHED_RESOURCES);
  })());
});

// Use the activate event to delete old caches and avoid running out of space.
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(name => {
      if (name !== CACHE_NAME) {
        return caches.delete(name);
      }
    }));
  })());
});

self.addEventListener("fetch", event => {
  // On fetch, go to the network first (and cache the response), and then cache.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);

    try {
      const fetchResponse = await fetch(event.request);
      cache.put(event.request, fetchResponse.clone());
      return fetchResponse;
    } catch (e) {
      const cachedResponse = await cache.match(event.request);
      return cachedResponse;
    }
  })());
});

// Special fetch handler for song file sharing.
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  if (event.request.method === 'POST' && url.pathname === '/handle-shared-song') {
    event.respondWith((async () => {
      const data = await event.request.formData();

      const filename = data.get('title');
      const file = data.get('audioFile');

      // Do something with the shared data here.

      return Response.redirect('../', 303);
    })());
  }
});
