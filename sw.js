self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('mx-cache-v1').then(cache => {
      return cache.addAll([
        '/',
        '/index.html',
        '/styles.css',
        '/scripts.js',
        '/favicon.ico',
        'https://www.max-x-strategy.com/logo.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});