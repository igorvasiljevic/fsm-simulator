let version = '0.2';

let CACHE_NAME = 'fsm-simulator-cache-' + version;
let urlsToCache = [
    './',
    './index.html',
    './index.js',
    './swsetup.js',
    './manifest.webmanifest',

    './src/constants.js',
    './src/fsm.js',
    './src/fsmcanvas.js',

    './components/canvas.js',
    './components/tabs.js',

    './css/canvas.css',
    './css/tabs.css',
    './css/style.css',

    './res/grid.svg',
    './res/more.svg',
    './res/clear.svg'
];

self.addEventListener('install', event => {
    self.skipWaiting();
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
});

self.addEventListener('activate', event => event.waitUntil(caches.keys().then(cacheNames =>
    Promise.all(cacheNames
        .filter(cacheName => cacheName != CACHE_NAME)
        .map(cacheName => caches.delete(cacheName))
    )
)));

self.addEventListener('fetch', event => event.respondWith(
    caches.match(event.request).then(response => {
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
    }).catch(err => console.log(err))
));