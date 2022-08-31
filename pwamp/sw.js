const VERSION = "v11";
const CACHE_NAME = `pwamp-${VERSION}`;

const INITIAL_CACHED_RESOURCES = [
  "./",
  "./skins/default.css",
  "./app.js",
  "./exporter.js",
  "./file-launch-handler.js",
  "./importer.js",
  "./player.js",
  "./popup-polyfill.js",
  "./protocol-launch-handler.js",
  "./recorder.js",
  "./share-target-launch-handler.js",
  "./skin.js",
  "./song-ui-factory.js",
  "./store.js",
  "./utils.js",
  "./visualizer.js",
  "./audio-metadata-parse-worker.js",
  "./parseAudioMetadata.js",
  "./album-art-placeholder.png"
];

// Bust the cache when the version changes.
for (let i = 0; i < INITIAL_CACHED_RESOURCES.length; i++) {
  INITIAL_CACHED_RESOURCES[i] = INITIAL_CACHED_RESOURCES[i] + "?v=" + VERSION;
}

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
  if (event.request.method === 'POST') {
    return;
  }

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

  if (event.request.method !== 'POST' || !url.pathname.includes('/handle-shared-song')) {
    return;
  }

  // Immediately redirect to the start URL, there's nothing to see here.
  event.respondWith(Response.redirect('./'));

  event.waitUntil(async function () {
    const data = await event.request.formData();
    const files = data.getAll('audioFiles');

    // Store the song in a special IDB place for the front-end to pick up later
    // when it starts.
    // Instead of importing idb-keyval here, we just have a few lines of manual
    // IDB code, to store the file in the same keyval store that idb-keyval uses.
    const openReq = indexedDB.open('keyval-store');
    openReq.onupgradeneeded = e => {
      const { target: { result: db } } = e;
      db.createObjectStore("keyval");
    }
    openReq.onsuccess = e => {
      const { target: { result: db } } = e;
      const transaction = db.transaction("keyval", "readwrite");
      const store = transaction.objectStore("keyval");
      store.put(files, 'handle-shared-files');
    }
  }());
});
