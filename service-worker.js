/* MMG PWA test shell. Never cache Supabase/auth/database requests or private data. */
const CACHE_NAME = 'mmg-pwa-shell-v1';
const SHELL = ['./', './index.html', './manifest.webmanifest', './icons/mmg-192.png', './icons/mmg-512.png'];
self.addEventListener('install', event => { event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', event => { event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('mmg-pwa-shell-') && k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', event => {
 const req=event.request, url=new URL(req.url);
 if(req.method!=='GET'||url.origin!==self.location.origin)return;
 if(url.pathname.includes('/rest/v1/')||url.pathname.includes('/auth/')||url.pathname.includes('/storage/'))return;
 if(req.mode==='navigate') { event.respondWith(fetch(req).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',copy));}return response;}).catch(async()=> (await caches.match('./index.html'))||(await caches.match('./')))); return; }
 if(['script','style','image','font'].includes(req.destination)) event.respondWith(fetch(req).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(req,copy));}return response;}).catch(()=>caches.match(req)));
});
