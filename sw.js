/* Replay to Win — offline app shell. API calls always go to the network. */
var V="fccoach-v53";
var SHELL=["./","app.css?v=50","replay.js?v=48","app.js?v=53","logo.svg?v=17","fonts/plex-regular.woff2","fonts/plex-semibold.woff2","fonts/plex-bold.woff2","icon-180.png?v=17","icon-192.png?v=17","icon-512.png?v=17","icon-maskable-512.png?v=17","favicon.png?v=17","stadium.webp","hero-v.jpg?v=16","hero-h.jpg?v=16","manifest.webmanifest"];
self.addEventListener("install",function(e){e.waitUntil(caches.open(V).then(function(c){return c.addAll(SHELL)}).then(function(){return self.skipWaiting()}))});
self.addEventListener("activate",function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k.indexOf("fccoach-")===0&&k!==V}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener("fetch",function(e){var req=e.request;if(req.method!=="GET")return;var u=new URL(req.url);
 // v31: video and audio never go through the service worker (iPhone needs the server's own 206 range answers)
 if(u.origin!==self.location.origin||u.pathname.indexOf("/api/")===0||req.headers.has("range")||req.destination==="video"||req.destination==="audio"||u.pathname.indexOf("/m/")===0||/\.(mp4|webm|mov|m4v)$/i.test(u.pathname))return;
 if(req.mode==="navigate"){e.respondWith(fetch(req).then(function(r){var cp=r.clone();caches.open(V).then(function(c){c.put("./",cp)});return r}).catch(function(){return caches.match("./")}));return}
 e.respondWith(caches.match(req,{ignoreSearch:false}).then(function(r){return r||fetch(req)}));
});
// v21: web push «تحليلك جاهز». The push carries no data; we ask the server what finished (the key never lives here).
self.addEventListener("push",function(e){e.waitUntil(self.registration.pushManager.getSubscription().then(function(s){
  return s?fetch("/api/push/last?ep="+encodeURIComponent(s.endpoint),{cache:"no-store"}).then(function(r){return r.json()}).catch(function(){return {}}):{}}).then(function(j){
  var ok=!j||!j.state||j.state==="done";
  return self.registration.showNotification(ok?"تحليلك جاهز":"لم يكتمل التحليل",{body:ok?"افتح «سجلّي» لترى التقرير":"لم يُحتسب عليك، ويمكنك المحاولة مرة أخرى",
    icon:"icon-192.png?v=17",badge:"icon-192.png?v=17",tag:"r2w-"+(j&&j.job||"job"),lang:"ar",dir:"rtl",data:{url:j&&j.job&&ok?"./?job="+j.job:"./#history"}})}))});
self.addEventListener("notificationclick",function(e){e.notification.close();var url=new URL((e.notification.data&&e.notification.data.url)||"./",self.registration.scope).href;
  e.waitUntil(self.clients.matchAll({type:"window",includeUncontrolled:true}).then(function(cs){for(var i=0;i<cs.length;i++){var c=cs[i];if(c.url.indexOf(self.registration.scope)===0&&"navigate" in c){return c.navigate(url).then(function(w){return (w||c).focus()})}}return self.clients.openWindow(url)}))});
