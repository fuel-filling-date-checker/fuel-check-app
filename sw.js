const CACHE_NAME = 'fuel-check-v1.1.0';
const ASSETS = [
  '/fuel-check-app/',
  '/fuel-check-app/index.html',
  '/fuel-check-app/mileage-calculator.html',
  '/fuel-check-app/manifest.json',
  '/fuel-check-app/icon.svg'
];

// Install Event
self.addEventListener('install', (e) => {
  self.skipWaiting(); // අලුත් Update එක ආපු ගමන් පරණ එක අයින් කරලා මේක Active කරගන්න
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

// Activate Event (පරණ Cache මකා දැමීම)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Old cache removed:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Network-First Strategy)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // ඉන්ටර්නෙට් එකෙන් අලුත් එක ආවා නම්, ඒක අලුතින් Cache එකට සේව් කරගන්නවා
        if(response && response.status === 200 && response.type === 'basic') {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(e.request, responseToCache);
            });
        }
        return response; // අලුත්ම පිටුව පෙන්වනවා
      })
      .catch(() => {
        // ඉන්ටර්නෙට් නැත්නම් (Offline), කලින් සේව් කරපු එක පෙන්වනවා
        return caches.match(e.request);
      })
  );
});
