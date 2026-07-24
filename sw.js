const CACHE_NAME = 'med-skazka-v1';
const ASSETS = [
  '.',
  'index.html',
  'style.css',
  'lipa.jpg',
  'grechiha.jpg',
  'flowers.jpg',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});


self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});


self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('Service Worker успешно зарегистрирован!', reg))
            .catch(err => console.log('Ошибка регистрации Service Worker:', err));
    });
}
