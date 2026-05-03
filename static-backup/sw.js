// Sister Wendy's Dominoes - Service Worker v1.0.0
const CACHE_NAME = 'sister-wendy-v1.0.0';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  // Images
  '/assets/images/avatar.jpg',
  '/assets/images/icon-512.jpeg',
  '/assets/images/thinking.jpeg',
  '/assets/images/winning.jpeg',
  '/assets/images/losing.jpeg',
  // Videos (cache the main one, others load on demand)
  '/assets/videos/wendy-main.mp4'
];

// Install event - precache core assets
self.addEventListener('install', (event) => {
  console.log('[SW] Installing Sister Wendy PWA...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Precaching core assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
      .catch((err) => {
        console.error('[SW] Precache failed:', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http(s) requests
  if (!url.protocol.startsWith('http')) return;

  // For HTML pages - network first, cache fallback
  if (request.headers.get('Accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Clone and cache successful responses
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          // Offline - try cache, then offline page
          return caches.match(request)
            .then((cached) => cached || caches.match('/offline.html'));
        })
    );
    return;
  }

  // For other assets - cache first, network fallback
  event.respondWith(
    caches.match(request)
      .then((cached) => {
        if (cached) {
          // Return cached, but also update cache in background
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => cache.put(request, response));
            }
          }).catch(() => {});
          return cached;
        }

        // Not in cache - fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses for next time
            if (response.ok) {
              const clone = response.clone();
              caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
            }
            return response;
          })
          .catch(() => {
            // For images, return a placeholder or nothing
            if (request.destination === 'image') {
              return new Response('', { status: 404 });
            }
            throw new Error('Network unavailable');
          });
      })
  );
});

// Handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
  }
});
