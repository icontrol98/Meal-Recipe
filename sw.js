const CACHE_NAME = 'school-meal-planner-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/index.tsx',
  'https://cdn.tailwindcss.com',
  'https://rsms.me/inter/inter.css'
];

// 1. 서비스 워커 설치
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// 2. 네트워크 요청 가로채기
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // 캐시에 파일이 있으면 캐시에서 제공
        if (response) {
          return response;
        }
        // 캐시에 없으면 네트워크로 요청
        return fetch(event.request);
      })
  );
});
