
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
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Если файл есть в кэше — отдаем его сразу
      if (cachedResponse) {
        return cachedResponse;
      }
      
      // Если файла нет, безопасно запрашиваем его из сети
      return fetch(event.request).catch((err) => {
        console.warn('Сетевой запрос не удался:', event.request.url);
        // Возвращаем пустую заглушку вместо падения воркера
        return new Response('Network error', { status: 404 });
      });
    })
  );
});
