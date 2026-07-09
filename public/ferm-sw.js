/* Fermentación app-shell service worker.
 *
 * Scoped to /fermentacion (registered with an explicit narrower scope) so it
 * never touches the cupping app. Goal: let the module open with no signal after
 * it has been visited online at least once.
 *
 * Strategy:
 *   - navigations (documents): network-first, fall back to cache, then to the
 *     cached /fermentacion shell.
 *   - static build assets (/_next/static, /_next/image): cache-first.
 *   - other same-origin GETs: network-first with cache fallback.
 * Supabase/API POSTs and cross-origin requests are never intercepted.
 */

const CACHE = "ferm-shell-v1";
const SHELL = ["/fermentacion", "/fermentacion/new"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((c) => Promise.allSettled(SHELL.map((u) => c.add(u))))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isStaticAsset(url) {
  return (
    url.pathname.startsWith("/_next/static") ||
    url.pathname.startsWith("/_next/image") ||
    url.pathname === "/ferm-sw.js"
  );
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // never touch Supabase/API

  // Navigations → network-first, fall back to cache then the shell.
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          return cached || (await caches.match("/fermentacion"));
        }),
    );
    return;
  }

  // Static build assets → cache-first (immutable, hashed URLs).
  if (isStaticAsset(url)) {
    event.respondWith(
      caches.match(req).then(
        (cached) =>
          cached ||
          fetch(req).then((res) => {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
            return res;
          }),
      ),
    );
    return;
  }

  // Everything else same-origin → network-first, cache fallback.
  event.respondWith(
    fetch(req)
      .then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy));
        return res;
      })
      .catch(() => caches.match(req)),
  );
});
