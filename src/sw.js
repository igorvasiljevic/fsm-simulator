const version = '2.8';
const cache_name = 'fsm-simulator-cache-' + version;

const urls_to_cache = [
    './manifest.webmanifest',
    './bundle.css',
    './bundle.js',
    
    /* PAGES */
    './',
    './simulator.html',
    './lessons/1.html',
    './lessons/2.html',
    './lessons/3.html',
    './lessons/4.html',
    './lessons/5.html',

     /* RESOURCES */
     './res/icon.svg',
    //  './res/icon.png',
    //  './res/icon-maskable.svg',
    //  './res/icon-maskable.png',
];

self.addEventListener('install', event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(cache_name)
            .then(cache => cache.addAll(urls_to_cache)) // then skip waiting maybe
    );
    
}, { once:true });

self.addEventListener('activate', event => {
    self.clients.claim();
    
    event.waitUntil(caches.keys().then(keys =>
        Promise.all(
            keys.filter(key => key !== cache_name)
                .map(key => caches.delete(key))
        )
    ));
}, { once:true });

self.addEventListener('fetch', event => {
    // fallback to standard fetch for POST, PATCH and DELETE
    if(event.request.method !== 'GET') return;

    event.respondWith(caches.match(event.request).then(response => {
            // Cache hit - return response
            if(response) return response;

            return fetch(event.request).then(response => {
                if(!response || response.status !== 200 || response.type !== 'basic')
                    return response;

                const response_clone = response.clone();
                caches.open(cache_name).then(cache =>
                    cache.put(event.request, response_clone)
                );

                return response;
            });
        })
        .catch(err => {})
    );
});