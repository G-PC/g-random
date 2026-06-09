// sw.js - Service Worker для офлайн-режима в APK
const CACHE_NAME = 'g-random-v1';

const FILES_TO_CACHE = [
  '/g-random/index.html',
  '/g-random/detect.html',
  '/g-random/add.html',
  '/g-random/m-add.html',
  '/g-random/numbers.html',
  '/g-random/m-numbers.html',
  '/g-random/fortune.html',
  '/g-random/m-fortune.html',
  '/g-random/elimination.html',
  '/g-random/m-elimination.html',
  '/g-random/roles.html',
  '/g-random/m-roles.html',
  '/g-random/MAFIA_roles.pdf',
  '/g-random/favicon.ico'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кеширование файлов для офлайн-режима');
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          console.log('Удаляем старый кеш:', key);
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response;
      }
      return fetch(event.request);
    }).catch(() => {
      return caches.match('/g-random/index.html');
    })
  );
});
