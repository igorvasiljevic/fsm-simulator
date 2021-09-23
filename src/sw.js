const version = '2.5';
const cache_name = 'fsm-simulator-cache';

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

    /* RESOURCES */
    // './res/icon.svg',
    // './res/icon.png',
    // './res/icon-maskable.svg',
    // './res/icon-maskable.png',
];

self.addEventListener('install', event => {
    // self.skipWaiting();
    event.waitUntil(
        caches
            .delete(cache_name)
            .then(() => caches.open(cache_name))
            .then(cache => cache.addAll(urls_to_cache))
    );
});

// self.addEventListener('activate', event =>
//     event.waitUntil(caches.keys().then(cache_names =>
//         Promise.all(cache_names
//             .filter(cache_name => cache_name != cache_name)
//             .map(cache_name => caches.delete(cache_name))
//         )
//     ))
// );

self.addEventListener('fetch', event =>
    event.respondWith(caches
        .match(event.request)
        .then(response => {
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
));