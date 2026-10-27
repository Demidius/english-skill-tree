// Service worker: сеть в приоритете, кэш — запасной вариант без интернета.
const CACHE = 'skill-tree-v4';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil((async()=>{
  // Старые кэши (в том числе накопленные версии файлов из skill-tree-v3) удаляем.
  for(const name of await caches.keys()) if(name.startsWith('skill-tree-') && name!==CACHE) await caches.delete(name);
  await self.clients.claim();
})()));

// В кэше держим только последнюю версию каждого файла: копии с другим ?v=… удаляем,
// иначе кэш растёт на несколько мегабайт с каждым обновлением сайта.
async function store(req, res) {
  const cache = await caches.open(CACHE);
  await cache.put(req, res);
  const url = new URL(req.url);
  if (!url.search) return;
  for (const key of await cache.keys()) {
    const k = new URL(key.url);
    if (k.pathname === url.pathname && k.search !== url.search) await cache.delete(key);
  }
}

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
        if (res && res.ok) store(req, res.clone()).catch(() => {});
        return res;
      })
      // Без сети: точная копия, иначе последняя сохранённая версия того же файла.
      // Страницу-заглушку отдаём только для переходов, а не вместо скриптов и стилей.
      .catch(async () =>
        (await caches.match(req)) ||
        (await caches.match(req, { ignoreSearch: true })) ||
        (req.mode === 'navigate' ? (await caches.match('./')) || Response.error() : Response.error()))
  );
});
