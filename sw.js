self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(self.clients.claim());
});

// Mendengarkan pesan dari script utama untuk memicu notifikasi
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SHOW_NOTIFICATION') {
        const { title, body, image } = event.data.payload;
        
        const options = {
            body: body,
            icon: '/favicon.ico', 
            image: image,         
            vibrate: [200, 100, 200],
            requireInteraction: true
        };

        event.waitUntil(
            self.registration.showNotification(title, options)
        );
    }
});