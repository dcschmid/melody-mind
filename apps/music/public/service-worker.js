const CACHE_VERSION = "music-pwa-v20260721";
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;
const MAX_RUNTIME_CACHE_ENTRIES = 80;

const STATIC_ASSETS = [
  "/",
  "/site.webmanifest?v=20260721",
  "/favicon.ico",
  "/favicon-96x96.png",
  "/apple-touch-icon.png",
  "/web-app-manifest-192x192.png?v=20260507",
  // The 512px manifest icon is intentionally not precached: browsers only
  // fetch it during an install-to-homescreen flow.
  "/fonts/atkinson-hyperlegible-regular.woff2",
  "/fonts/atkinson-hyperlegible-bold.woff2",
];

const isSameOrigin = (url) => url.origin === self.location.origin;

const isStaticRequest = (request, url) =>
  isSameOrigin(url) &&
  ["style", "script", "image", "font", "manifest"].includes(request.destination);

const isAudioRequest = (request) =>
  request.destination === "audio" ||
  request.headers.has("range") ||
  /\.(?:mp3|m4a|ogg|wav|flac)(?:$|\?)/i.test(new URL(request.url).pathname);

// Cache API keys are insertion-ordered, so deleting from the front is FIFO
// eviction — enough to keep the runtime cache from growing unbounded.
const trimRuntimeCache = async (cache) => {
  const keys = await cache.keys();
  const excess = keys.length - MAX_RUNTIME_CACHE_ENTRIES;
  for (let index = 0; index < excess; index += 1) {
    await cache.delete(keys[index]);
  }
};

const putRuntimeCache = async (request, response) => {
  if (!response || !response.ok || response.type === "opaque") {
    return;
  }

  const cache = await caches.open(RUNTIME_CACHE);
  await cache.put(request, response.clone());
  await trimRuntimeCache(cache);
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("music-pwa-") && !key.startsWith(CACHE_VERSION))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (isAudioRequest(request)) {
    return;
  }

  if (isSameOrigin(url) && url.pathname === "/search-index.json") {
    event.respondWith(
      fetch(request, { cache: "reload" })
        .then((response) => {
          event.waitUntil(putRuntimeCache(request, response));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  if (request.mode === "navigate" && isSameOrigin(url)) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          event.waitUntil(putRuntimeCache(request, response));
          return response;
        })
        .catch(async () => {
          const cachedPage = await caches.match(request);
          return cachedPage || caches.match("/");
        })
    );
    return;
  }

  if (isStaticRequest(request, url)) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request)
          .then((response) => {
            event.waitUntil(putRuntimeCache(request, response));
            return response;
          })
          .catch(() => cachedResponse);

        return cachedResponse || fetchPromise;
      })
    );
  }
});
