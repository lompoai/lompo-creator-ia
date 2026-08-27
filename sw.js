const CACHE_NAME = "lompo-creator-ia-v1";

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Ne pas intercepter les appels API
  if (url.pathname.startsWith("/api/")) return;

  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});
