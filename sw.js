const CACHE_NAME = 'todo-pwa-v1';
const PRECACHE_ASSETS = [
    'index.php',
    'offline.html',
    'style.css',
    'script.js',
    'manifest.json',
    'icon-192.png',
    'icon-512.png'
];

// 1. Precache App Shell saat Install
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(PRECACHE_ASSETS);
        })
    );
    self.skipWaiting();
});

// 2. Bersihkan Cache Lama saat Activate
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// 3. Strategi Caching Per Resource
self.addEventListener('fetch', (event) => {
    const request = event.request;

    if (request.destination === 'style' || request.destination === 'script' || request.destination === 'image' || request.url.includes('manifest.json')) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                return cachedResponse || fetch(request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    event.respondWith(
        fetch(request).catch(() => {
            return caches.match(request).then((cachedResponse) => {
                return cachedResponse || caches.match('offline.html');
            });
        })
    );
});