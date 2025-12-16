// Service Worker for caching website data
const CACHE_NAME = 'jam-site-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/SwedishMethod.html',
  '/ppl.html',
  '/styles.css',
  '/theme.js',
  '/manifest.json',
  '/image/logo.png',
  '/image/emptyjar.png',
  '/image/strawjam.png',
  '/image/bluejam.png'
];

// Install event: cache initial resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event: serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        return response || fetch(event.request).then(networkResponse => {
          // Cache the new response for future use
          if (networkResponse.ok) {
            return caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            });
          }
          return networkResponse;
        });
      }).catch(() => {
        // Offline fallback: could return a custom offline page
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});