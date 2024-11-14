self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {
            return cache.addAll([
                '/',
                '/index.html',
                '/styles.css',
                '/app.js',
                '/style-darkmode.css',
                '/toggle-switches.css',
                '/manifest.json',            
            ]);
        })
    );
});
