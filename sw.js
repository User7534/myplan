// MyPlan Service Worker v3 — aggressive install, cache-first for shell
var CACHE = "myplan-v4";

var SHELL = [
  "/",
  "/index.html",
  "/app.js",
  "/manifest.json",
  "/icon.svg",
];

self.addEventListener("install", function(e) {
  // Take control immediately — don't wait for old SW to die
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function(cache) {
      return Promise.allSettled(
        SHELL.map(function(url) {
          return cache.add(url).catch(function(err) {
            console.warn("SW cache skip:", url, err);
          });
        })
      );
    })
  );
});

self.addEventListener("activate", function(e) {
  // Claim all clients immediately
  e.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Delete ALL old caches
      caches.keys().then(function(keys) {
        return Promise.all(
          keys.filter(function(k) { return k !== CACHE; })
              .map(function(k) { return caches.delete(k); })
        );
      }),
    ])
  );
});

self.addEventListener("fetch", function(e) {
  var url = e.request.url;

  // Never cache Supabase — always go to network
  if (url.includes("supabase.co") || url.includes("unpkg.com")) {
    e.respondWith(
      fetch(e.request).catch(function() {
        return new Response(
          JSON.stringify({ error: "offline" }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      })
    );
    return;
  }

  // Cache-first for app shell
  e.respondWith(
    caches.match(e.request).then(function(cached) {
      var networkFetch = fetch(e.request).then(function(response) {
        if (response.status === 200 && e.request.method === "GET") {
          var clone = response.clone();
          caches.open(CACHE).then(function(c) { c.put(e.request, clone); });
        }
        return response;
      });
      // Return cached immediately, update in background
      return cached || networkFetch.catch(function() {
        if (e.request.mode === "navigate") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
