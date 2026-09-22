// ========================================
// SERVICE WORKER - BITÁCORA
// ========================================

const CACHE_NAME = "bitacora-v2";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./app.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


// ========================================
// INSTALACIÓN
// ========================================

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(CACHE_NAME)
                .then(cache => {

                    return cache.addAll(
                        APP_FILES
                    );

                })

        );

        self.skipWaiting();

    }
);


// ========================================
// ACTIVACIÓN
// ========================================

self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches.keys()
                .then(cacheNames => {

                    return Promise.all(

                        cacheNames.map(
                            cacheName => {

                                if (
                                    cacheName !==
                                    CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }

                            }
                        )

                    );

                })

        );

        self.clients.claim();

    }
);


// ========================================
// PETICIONES
// ========================================

self.addEventListener(
    "fetch",
    event => {

        if (
            event.request.method !== "GET"
        ) {

            return;

        }

        event.respondWith(

            caches.match(
                event.request
            )
                .then(cachedResponse => {

                    if (cachedResponse) {

                        return cachedResponse;

                    }

                    return fetch(
                        event.request
                    );

                })

        );

    }
);