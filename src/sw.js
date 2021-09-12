const version = '2.0';
const CACHE_NAME = 'fsm-simulator-cache-' + version;

const urlsToCache = [
    './manifest.webmanifest',
    './bundle.css',
    './bundle.js',
    
    './',
    './index.html',
    './simulator.html',
    './lessons/1.html',
    './lessons/2.html',
    './lessons/3.html',
    './lessons/4.html',

    './favicon.ico',
    './res/icon.svg',
    './res/icon.png',
    './res/icon-maskable.svg',
    './res/icon-maskable.png',
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache =>
        cache.addAll(urlsToCache))
    );
});

self.addEventListener('activate', event =>
    event.waitUntil(caches.keys().then(cacheNames =>
        Promise.all(cacheNames
            .filter(cacheName => cacheName != CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        )
    ))
);

self.addEventListener('fetch', event =>
    event.respondWith(caches
        .match(event.request)
        .then(response => {
            // Cache hit - return response
            if (response) return response;

            return fetch(event.request).then(response => {
                if(!response || response.status !== 200 || response.type !== 'basic')
                    return response;

                const responseClone = response.clone();
                caches.open(CACHE_NAME).then(cache =>
                    cache.put(event.request, responseClone)
                );

                return response;
            });
        })
        .catch(console.log)
));