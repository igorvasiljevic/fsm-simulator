let CACHE_NAME = 'fsm-simulator-cache';
let urlsToCache = [
    './index.html',
    './style.css',
    './manifest.webmanifest',
    './fsm.js',
    './main.js',
    './res/icon.png',
    './res/grid.png',
    './res/clear.svg'
];

self.addEventListener('install', function(event) {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME)
              .then(function(cache) {
                  return cache.addAll(urlsToCache);
              })
    );
});

// self.addEventListener('message', (event) => {
//     if(event.data.action === 'skipWaiting') {
//         self.skipWaiting();
//     }
// });

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request)
              .then(function(response) {
                // Cache hit - return response
                if (response) {
                    return response;
                }
        
                return fetch(event.request).then(
                    function(response) {
                    // Check if we received a valid response
                    if(!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
        
                    // IMPORTANT: Clone the response. A response is a stream
                    // and because we want the browser to consume the response
                    // as well as the cache consuming the response, we need
                    // to clone it so we have two streams.
                    var responseToCache = response.clone();
        
                    caches.open(CACHE_NAME)
                        .then(function(cache) {
                        cache.put(event.request, responseToCache);
                        });
        
                    return response;
                    }
                );
              })
      );
  });

