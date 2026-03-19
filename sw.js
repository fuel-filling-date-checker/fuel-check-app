const CACHE_NAME = 'fuel-check-v2';
const ASSETS = [
  '/fuel-check-app/',
  '/fuel-check-app/index.html',
  '/fuel-check-app/manifest.json',
  '/fuel-check-app/icon.svg'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Fetch Event (Offline Support)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
