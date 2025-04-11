const VERSION = 'v8';
const CACHE_NAME = `wami-${VERSION}`;

// Those are all the resources our app needs to work.
// We'll cache them on install.
const INITIAL_CACHED_RESOURCES = [
  './',
  // CSS
  './styles/buttons.css',
  './styles/dialogs.css',
  './styles/editor.css',
  './styles/image-viewer.css',
  './styles/images.css',
  './styles/index.css',
  './styles/layout.css',
  './styles/list-of-flows.css',
  './styles/mobile.css',
  './styles/reset.css',
  './styles/step-chooser.css',
  './styles/welcome.css',
  // JS
  './app.js',
  './flow-runner.js',
  './ui.js',
  './store.js',
  './utils.js',
  './image-viewer.js',
  './steps.js',
  // 3rd party JS
  'https://cdn.jsdelivr.net/npm/wasm-imagemagick/dist/bundles/magickApi.js',
  // Images
  './icons/add-images.png',
  './icons/step-blur.png',
  './icons/step-border.png',
  './icons/step-brightness-contrast.png',
  './icons/step-clone.png',
  './icons/step-colorize.png',
  './icons/step-crop.png',
  './icons/step-edge.png',
  './icons/step-flip.png',
  './icons/step-flop.png',
  './icons/step-grayscale.png',
  './icons/step-negate.png',
  './icons/step-paint.png',
  './icons/step-polaroid.png',
  './icons/step-posterize.png',
  './icons/step-resize-exactly.png',
  './icons/step-resize-height-if-larger.png',
  './icons/step-resize-width-if-larger.png',
  './icons/step-resize.png',
  './icons/step-rotate.png',
  './icons/step-scale.png',
  './icons/step-sepia-tone.png',
  './icons/step-sharpen.png',
  './favicon-96.png',
  './favicon-128.png',
  './favicon-256.png',
  './favicon-512.png',
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
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    cache.addAll(INITIAL_CACHED_RESOURCES_WITH_VERSIONS);
  })());
});

// Activate happens after install, either when the app is used for the
// first time, or when a new version of the SW was installed.
// We use the activate event to delete old caches and avoid running out of space.
self.addEventListener('activate', event => {
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
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Handle share target requests
  if (event.request.method === 'POST' && (event.request.url.includes('/share-target'))) {
    // Immediately redirect to main page
    event.respondWith(Response.redirect('./?share=true', 303));
    
    // Process the form data in the background
    event.waitUntil(
      (async () => {
        try {
          const formData = await event.request.formData();
          
          // Extract data
          const data = {
            title: formData.get('title') || '',
            text: formData.get('text') || '',
            url: formData.get('url') || ''
          };
          
          const files = formData.getAll('windowsActionFiles');
          
          // Store share data for the client to use if there are files
          if (files.length > 0) {
            // Store the files in a temporary cache for the client to access
            const shareCache = await caches.open('share-target-cache');
            
            // Create an object with the share data
            const shareData = {
              title: data.title,
              text: data.text,
              url: data.url,
              timestamp: Date.now(),
              fileCount: files.length
            };
            
            // Store the share data and files
            await shareCache.put('shareData', new Response(JSON.stringify(shareData)));
            
            // Store each file with a unique key
            for (let i = 0; i < files.length; i++) {
              const file = files[i];
              const response = new Response(file);
              await shareCache.put(`file-${i}`, response);
            }
          }
        } catch (error) {
          console.error('Error processing share target data:', error);
        }
      })()
    );
    return;
  }

  // Don't care about other-origin URLs.
  if (url.origin !== location.origin) {
    return;
  }

  // Don't care about anything else than GET.
  if (event.request.method !== 'GET') {
    return;
  }

  // On fetch, go to the cache first, and then network.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match(`${event.request.url}?v=${VERSION}`);

    if (cachedResponse) {
      return cachedResponse;
    } else {
      const fetchResponse = await fetch(event.request);
      cache.put(event.request, fetchResponse.clone());
      return fetchResponse;
    }
  })());
});
