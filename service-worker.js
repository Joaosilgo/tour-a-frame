// Set a name for the current cache
var cacheName = 'v1';

// Default files to always cache
var cacheFiles = [
    './',
    './index.html',
    './src/app.js',
    './assets/startPoint.jpeg',
    './assets/point1.jpg',
    './assets/point2.jpg',
    './assets/point3.jpg',
    './assets/icon-192.png',
    './assets/icon-512.png',
    './manifest.json'

]


self.addEventListener('install', function (e) {
    console.log('[ServiceWorker] Installed');

    // e.waitUntil Delays the event until the Promise is resolved
    e.waitUntil(

        // Open the cache
        caches.open(cacheName).then(function (cache) {

            cache.add('https://aframe.io/releases/1.2.0/aframe.min.js');
            cache.add('https://cdn.aframe.io/fonts/KelsonSans.fnt');
            cache.add('https://cdn.aframe.io/fonts/Roboto-msdf.json');
            cache.add('https://cdn.aframe.io/fonts/KelsonSans.png');
            cache.add('https://cdn.aframe.io/fonts/Roboto-msdf.png');




            // Add all the default files to the cache
            console.log('[ServiceWorker] Caching cacheFiles');
            return cache.addAll(cacheFiles);
        })
    ); // end e.waitUntil
});

/*
self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        // Enable navigation preload if it's supported.
        // See https://developers.google.com/web/updates/2017/02/navigation-preload
        if ('navigationPreload' in self.registration) {
            await self.registration.navigationPreload.enable();
        }
    })());

    // Tell the active service worker to take control of the page immediately.
    self.clients.claim();
});
*/

self.addEventListener('activate', function (e) {
    console.log('[ServiceWorker] Activated');

    e.waitUntil(

        // Get all the cache keys (cacheName)
        caches.keys().then(function (cacheNames) {
            return Promise.all(cacheNames.map(function (thisCacheName) {

                // If a cached item is saved under a previous cacheName
                if (thisCacheName !== cacheName) {

                    // Delete that cached file
                    console.log('[ServiceWorker] Removing Cached Files from Cache - ', thisCacheName);
                    return caches.delete(thisCacheName);
                }
            }));
        })
    ); // end e.waitUntil

});


self.addEventListener('fetch', function (e) {
    console.log('[ServiceWorker] Fetch', e.request.url);

    // e.respondWidth Responds to the fetch event
    e.respondWith(

        // Check in cache for the request being made
        caches.match(e.request)


            .then(function (response) {

                // If the request is in the cache
                if (response) {
                    console.log("[ServiceWorker] Found in Cache", e.request.url, response);
                    // Return the cached version
                    return response;
                }

                // If the request is NOT in the cache, fetch and cache

                var requestClone = e.request.clone();
                return fetch(requestClone)
                    .then(function (response) {

                        if (!response) {
                            console.log("[ServiceWorker] No response from fetch ")
                            return response;
                        }

                        var responseClone = response.clone();

                        //  Open the cache
                        caches.open(cacheName).then(function (cache) {

                            // Put the fetched response in the cache
                            cache.put(e.request, responseClone);
                            console.log('[ServiceWorker] New Data Cached', e.request.url);

                            // Return the response
                            return response;

                        }); // end caches.open

                    })
                    .catch(function (err) {
                        console.log('[ServiceWorker] Error Fetching & Caching New Data', err);
                    });


            }) // end caches.match(e.request)
    ); // end e.respondWith
});