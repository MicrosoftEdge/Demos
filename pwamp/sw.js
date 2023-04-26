const VERSION = "v41";
const CACHE_NAME = `pwamp-${VERSION}`;

// Those are all the resources our app needs to work.
// We'll cache them on install.
const INITIAL_CACHED_RESOURCES = [
  "./",
  "./index.html",
  "./skins/default.css",
  "./about.css",
  "./album-art-placeholder.png",
  "./app.js",
  "./audio-metadata-parse-worker.js",
  "./exporter.js",
  "./file-launch-handler.js",
  "./importer.js",
  "./index.html",
  "./keys.js",
  "./media-session.js",
  "./parseAudioMetadata.js",
  "./player.js",
  "./popover.min.js",
  "./protocol-launch-handler.js",
  "./recorder.js",
  "./share-target-launch-handler.js",
  "./skin.js",
  "./song-ui-factory.js",
  "./store.js",
  "./utils.js",
  "./visualizer.js",
  "./visualizer.png",
  "./widgets/mini-player.json",
  "./widgets/mini-player-data.json",
  "./idb-keyval.js"
];

// Add a cache-busting query string to the pre-cached resources.
// This is to avoid loading these resources from the disk cache.
const INITIAL_CACHED_RESOURCES_WITH_VERSIONS = INITIAL_CACHED_RESOURCES.map(path => {
  return `${path}?v=${VERSION}`;
});

// On install, fill the cache with all the resources we know we need.
// Install happens when the app is used for the first time, or when a
// new version of the SW is detected by the browser.
// In the latter case, the old SW is kept around until the new one is
// activated by a new client.
self.addEventListener("install", event => {
  self.skipWaiting();

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(INITIAL_CACHED_RESOURCES_WITH_VERSIONS);
  })());
});

// Activate happens after install, either when the app is used for the
// first time, or when a new version of the SW was installed.
// We use the activate event to delete old caches and avoid running out of space.
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names.map(name => {
      if (name !== CACHE_NAME) {
        return caches.delete(name);
      }
    }));
    await clients.claim();
  })());
});

// Main fetch handler.
// A cache-first strategy is used, with a fallback to the network.
// The static resources fetched here will not have the cache-busting query
// string. So we need to add it to match the cache.
self.addEventListener("fetch", event => {
  const url = new URL(event.request.url);

  // Don't care about other-origin URLs.
  if (url.origin !== location.origin) {
    return;
  }

  // Don't care about anything else than GET.
  if (event.request.method !== 'GET') {
    return;
  }

  // Don't care about widget requests.
  if (url.pathname.includes("/widgets/")) {
    return;
  }

  // On fetch, go to the cache first, and then network.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const versionedUrl = `${event.request.url}?v=${VERSION}`;
    const cachedResponse = await cache.match(versionedUrl);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      const fetchResponse = await fetch(versionedUrl);
      cache.put(versionedUrl, fetchResponse.clone());
      return fetchResponse;
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

// Handle the mini-player widget updates in another script.
importScripts('./sw-widgets.js');
