let version = '0.1';

let CACHE_NAME = 'fsm-simulator-cache-' + version;
let urlsToCache = [
    './',
    './index.html',
    './simulator.html',
    './index.js',
    './manifest.webmanifest',
    './styles.css',

    './src/constants.js',
    './src/events.js',
    './src/fsm.js',
    './src/fsmcanvas.js',
    './src/lang.js',
    './src/simulator.js',
    './src/theme.js',
    './src/util.js',

    './res/add_transition.svg',
    './res/delete.svg',
    './res/grid.svg',
    './res/more.svg',
    './res/run.svg',
    './res/set_final_state.svg',
    './res/set_initial_state.svg',
    './res/step.svg',
    './res/theme.svg'
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