/* Service worker del Generador de roles. Cambia VERSION en cada actualización. */
const VERSION="1.0.1";
const CACHE="generador-roles-"+VERSION;
const ASSETS=["./","./index.html","./manifest.webmanifest","./vendor/exceljs.min.js","./icons/icon-192.png","./icons/icon-512.png","./icons/maskable-512.png","./icons/apple-touch-icon.png","./icons/favicon.png"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(ASSETS.map(a=>c.add(a).catch(()=>null))))) });
self.addEventListener("message",e=>{if(e.data==="skipWaiting")self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith("generador-roles-")&&k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
  const req=e.request;if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin===self.location.origin){
    if(req.mode==="navigate"){
      e.respondWith(fetch(req).then(res=>{const copy=res.clone();caches.open(CACHE).then(c=>c.put("./index.html",copy));return res}).catch(()=>caches.match("./index.html")));
      return;
    }
    e.respondWith(caches.match(req,{ignoreSearch:true}).then(r=>r||fetch(req).then(res=>{if(res.ok){const copy=res.clone();caches.open(CACHE).then(c=>c.put(req,copy))}return res})));
  }else if(/(fonts\.(googleapis|gstatic)\.com|cdnjs\.cloudflare\.com)$/.test(url.hostname)){
    e.respondWith(caches.open(CACHE).then(c=>c.match(req).then(r=>r||fetch(req).then(res=>{c.put(req,res.clone());return res}).catch(()=>r))));
  }
});
