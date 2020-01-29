let version = '0.1';

let CACHE_NAME = 'fsm-simulator-cache-' + version;
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

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => {
        return cache.addAll(urlsToCache);
    }));
});

self.addEventListener('message', event  => {
    if(event.data === 'skipWaiting')
        self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys().then(cacheNames => {
        return Promise.all(
            cacheNames.filter(cacheName => {
                return cacheName != CACHE_NAME;
            }).map(cacheName => {
                return caches.delete(cacheName);
            })
        );
    }));
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            // Cache hit - return response
            if (response) return response;
    
            return fetch(event.request).then(response => {
                // Check if we received a valid response
                if(!response || response.status !== 200 || response.type !== 'basic')
                    return response;
    
                // IMPORTANT: Clone the response. A response is a stream
                // and because we want the browser to consume the response
                // as well as the cache consuming the response, we need
                // to clone it so we have two streams.
                let responseToCache = response.clone();
    
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, responseToCache);
                });
    
                return response;
            });
        }).catch(err => {
            console.log(err);
        })
    );
});

