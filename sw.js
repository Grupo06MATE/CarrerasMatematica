const CACHE_NAME = "matecarreras-cache-v1";
const STATIC_ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./game-config.js",
  "./question-bank.js",
  "./audio-controller.js",
  "./firebase-ranking.js",
  "./assets/convertible.png",
  "./assets/car-player.svg",
  "./assets/car-rival.svg",
  "./assets/GroupPicture/FotoGrupalFinal.png",
  "./assets/biomes/ciudad.png",
  "./assets/biomes/desierto.png",
  "./assets/biomes/nieve.png",
  "./assets/biomes/selva.png",
  "./assets/obstacles/bus.png",
  "./assets/obstacles/bomberos.png",
  "./assets/obstacles/hilux.png",
  "./assets/obstacles/lambo.png",
  "./assets/obstacles/tundra.png",
  "./assets/music/GOTMUSIC.mp3",
  "./assets/music/Don%20Omar%20ft.%20Tego%20Calderon%20-%20Bandolero%20(Letra).mp3",
  "./assets/music/GCN%20Dry%20Dry%20Desert%20-%20Mario%20Kart%208%20.mp3",
  "./assets/music/N64%20Frappe%20Snowland%20.mp3",
  "./assets/music/Mario%20Kart%207%20-%20DK%20Jungle.mp3"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(STATIC_ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  const requestUrl = new URL(event.request.url);
  if (requestUrl.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
          return networkResponse;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});