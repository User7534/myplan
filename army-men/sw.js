// Plastic Front offline cache. Scope: /army-men/ only (MyPlan keeps its own worker at the site root).
// Bump VERSION whenever game files change so players get the update.
const VERSION = 'plasticfront-v1';
const FILES = [
  './',
  'index.html',
  '3d.html',
  'controls.html',
  'game.js',
  'r3d.js',
  'manifest.webmanifest',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'icons/icon-maskable-512.png',
  'icons/apple-touch-icon.png',
  'vendor/three/addons/postprocessing/EffectComposer.js',
  'vendor/three/addons/postprocessing/MaskPass.js',
  'vendor/three/addons/postprocessing/OutputPass.js',
  'vendor/three/addons/postprocessing/Pass.js',
  'vendor/three/addons/postprocessing/RenderPass.js',
  'vendor/three/addons/postprocessing/ShaderPass.js',
  'vendor/three/addons/shaders/CopyShader.js',
  'vendor/three/addons/shaders/HorizontalTiltShiftShader.js',
  'vendor/three/addons/shaders/OutputShader.js',
  'vendor/three/addons/shaders/VerticalTiltShiftShader.js',
  'vendor/three/addons/utils/BufferGeometryUtils.js',
  'vendor/three/three.module.min.js',
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(Promise.all([
    self.clients.claim(),
    caches.keys().then(keys => Promise.all(keys.filter(k => k.startsWith('plasticfront-') && k !== VERSION).map(k => caches.delete(k)))),
  ]));
});

// Cache first (works offline), refreshing the cached copy in the background when online.
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  e.respondWith(caches.open(VERSION).then(async cache => {
    const cached = await cache.match(req, { ignoreSearch: true });
    const network = fetch(req).then(res => { if (res.ok) cache.put(req, res.clone()); return res; }).catch(() => null);
    if (cached) { e.waitUntil(network); return cached; }
    const res = await network;
    if (res) return res;
    if (req.mode === 'navigate') return (await cache.match('3d.html')) || Response.error();
    return Response.error();
  }));
});
