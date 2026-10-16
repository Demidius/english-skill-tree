// Service worker: сеть в приоритете, кэш — запасной вариант без интернета.
const CACHE = 'skill-tree-v2';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async()=>{
  // Remove the old cached legacy export when clients receive this worker.
  for(const name of await caches.keys()) if(name.startsWith('skill-tree-') && name!==CACHE) await caches.delete(name);
  await self.clients.claim();
})()));

self.addEventListener('fetch', e => {
  const req = e.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  if (/\/(migration\.js|admin\.html|admin\.js)$/.test(url.pathname) || url.searchParams.has('friend') || url.searchParams.has('profile')) {
    e.respondWith(fetch(req)); return;
  }
  e.respondWith(
    fetch(req)
      .then(res => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(r => r || caches.match('./')))
  );
});
