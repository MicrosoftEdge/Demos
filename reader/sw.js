const VERSION = "v3";
const CACHE_NAME = `reader-${VERSION}`;

const INITIAL_CACHED_RESOURCES = [
  "./",
  "./text-snippet/text-snippet.js",
  "./text-snippet/text-snippet.css",
  "./theme-selector/theme-selector.js",
  "./theme-selector/theme-selector.css",
  "./theme-selector/themes.json",
  "./highlighter.js",
  "./main-content-extractor.js",
  "./on-paste-html.js",
  "./reader.js",
  "./reader.css",
  "./store.js",
];

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

// On fetch, go to the network first, and then cache.
self.addEventListener("fetch", event => {
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
