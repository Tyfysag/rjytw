
const CACHE_NAME = 'med-skazka-v1';
const ASSETS = [
  '',                 
  './',                
  'index.html',
  'style.css',
  'manifest.json',
  'lipa.jpg',
  'grechiha.jpg',
  'flowers.jpg',
  'icon-192.png',
  'icon-512.png'
];
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        ASSETS.map(url => {
          return cache.add(url).catch(err => console.warn(`Не удалось закэшировать: ${url}`, err));
        })
      );
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
  // Проверяем, если запрашивается корень сайта или папка проекта rjytw
  const url = new URL(event.request.url);
  if (url.pathname === '/rjytw/' || url.pathname === '/rjytw/index.html') {
    event.respondWith(
      caches.match('index.html').then((cachedResponse) => {
        return cachedResponse || fetch(event.request);
      })
    );
    return;
  }

  // Для всех остальных файлов стандартная проверка
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).catch(() => {
        return new Response('Network error', { status: 404 });
      });
    })
  );
});

