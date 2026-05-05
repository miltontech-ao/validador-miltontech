const CACHE_NAME = 'milton-tech-v6.0'; // MUDEI A VERSÃO
const urlsToCache = [
  './',
  './index.html',
  './icon-192.png',
  './icon-512.png',
  './manifest.json'
];

// Instala e força atualizar
self.addEventListener('install', event => {
  self.skipWaiting(); // Força o novo SW a ativar
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

// Ativa e limpa cache velho
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key); // Apaga cache antigo
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Busca
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
