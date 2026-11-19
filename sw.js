// Cambiar este número en cada publicación para que los dispositivos descarguen los archivos nuevos.
const VERSION = 'v9';
const CACHE = 'reportes-pwa-' + VERSION;
const BASE = '/Reportes/';
const ICON_V = '?v=8';
const FILES = [
  BASE,
  BASE + 'index.html',
  BASE + 'manifest.json',
  BASE + 'icono_192.png' + ICON_V,
  BASE + 'icono_512.png' + ICON_V,
  BASE + 'icono_512_maskable.png' + ICON_V,
  BASE + 'splash_top.png' + ICON_V,
  BASE + 'splash_bottom.png' + ICON_V,
  BASE + 'splash_logo.png' + ICON_V,
  BASE + 'splash_loader.png' + ICON_V
];
const NETWORK_TIMEOUT = 4000; // ms de espera antes de usar la copia guardada

// Instalación: descarga archivos frescos (saltando la caché HTTP) y activa de inmediato.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => Promise.all(
        FILES.map((url) =>
          fetch(new Request(url, { cache: 'reload' })).then((res) => {
            if (!res.ok) throw new Error('No se pudo descargar ' + url);
            return cache.put(url, res);
          })
        )
      ))
      .then(() => self.skipWaiting())
  );
});

// Activación: borra cachés antiguas de la app (no toca localStorage ni IndexedDB) y toma el control.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((key) => key.startsWith('reportes-') && key !== CACHE)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

// Red primero (con revalidación), caché como respaldo sin conexión.
function networkFirst(request, fallbackKeys) {
  return new Promise((resolve) => {
    let settled = false;
    const useCache = async () => {
      let hit = await caches.match(request);
      if (!hit && fallbackKeys) {
        hit = await caches.match(request, { ignoreSearch: true });
        for (let i = 0; !hit && i < fallbackKeys.length; i++) hit = await caches.match(fallbackKeys[i]);
      }
      return hit;
    };
    const timer = setTimeout(async () => {
      const hit = await useCache();
      if (hit && !settled) { settled = true; resolve(hit); }
    }, NETWORK_TIMEOUT);

    fetch(request, { cache: 'no-cache' })
      .then((response) => {
        clearTimeout(timer);
        if (response && response.ok) {
          const copy = response.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy)).catch(() => {});
        }
        if (!settled) { settled = true; resolve(response); }
      })
      .catch(async () => {
        clearTimeout(timer);
        const hit = await useCache();
        if (!settled) { settled = true; resolve(hit || Response.error()); }
      });
  });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (!url.pathname.startsWith(BASE)) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, [BASE + 'index.html', BASE]));
    return;
  }

  // Iconos, manifiesto y demás recursos: siempre intentan la red primero para no servir imágenes viejas.
  event.respondWith(networkFirst(request));
});
