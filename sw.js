const CACHE_NAME = 'milton-pfs-v6.3';
const urlsToCache = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Instala o Service Worker e guarda os arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
     .then(cache => {
        console.log('Cache v6.3 aberto');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Ativa o novo Service Worker e apaga caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName!== CACHE_NAME) {
            console.log('Apagando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta as requisições: se tiver no cache, usa. Se não, busca na rede
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
     .then(response => {
        // Cache hit - retorna a resposta
        if (response) {
          return response;
        }
        // Não tem no cache - busca na rede
        return fetch(event.request);
      }
    )
  );
});
