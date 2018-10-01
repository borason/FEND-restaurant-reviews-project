const cacheName = 'fend-restaurant-v1';

const cacheAssets = [
  '/',
  '/index.html',
  '/restaurant.html',
  '/css/styles.css',
  '/js/dbhelper.js',
  '/js/main.js',
  '/js/restaurant_info.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.js',
  'https://unpkg.com/leaflet@1.3.1/dist/leaflet.css',
  '/data/restaurants.json',
  '/img/1.jpg',
  '/img/2.jpg',
  '/img/3.jpg',
  '/img/4.jpg',
  '/img/5.jpg',
  '/img/6.jpg',
  '/img/7.jpg',
  '/img/8.jpg',
  '/img/9.jpg',
  '/img/10.jpg'
];

// Install Event
self.addEventListener('install', event => {
  // Waits Until It Opens Cache
  event.waitUntil(
    caches
      .open(cacheName)
      // Caches Assets
      .then(cache => {
        cache.addAll(cacheAssets);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', event => {
  // Remove Unwanted Caches
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cache => {
            if(cache !== cacheName) {
              return caches.delete(cache);
            }
          })
        );
      })
    );
});

// Fetch Event
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Clones Response
        const clonedResponse = response.clone();
        // Opens Cache
        caches.open(cacheName)
          .then(cache => {
            // Adds Cloned Response To Cache
            cache.put(event.request, clonedResponse);
          });
          return response;
      })
        // Error Handling
        .catch(err =>
          // If File In Cache Matches The Request, Then Serves The Cached File
          caches.match(event.request)
            .then(response => response))
        );
});
