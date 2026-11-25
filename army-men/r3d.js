// Plastic Front — WebGL renderer (Three.js).
// game.js owns all game state and rules; this module only draws G in 3D and maps screen <-> world.
// World axes: game x -> three x, game y -> three z, height -> three y. 1 game pixel = 1 unit.
// Every model is built from primitives here, so a GLB (e.g. from Meshy) can later replace a
// pool's geometry without touching the game.
import * as THREE from 'three';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { HorizontalTiltShiftShader } from 'three/addons/shaders/HorizontalTiltShiftShader.js';
import { VerticalTiltShiftShader } from 'three/addons/shaders/VerticalTiltShiftShader.js';

const glCanvas = document.getElementById('gl');
const mobile = matchMedia('(pointer: coarse)').matches;
const renderer = new THREE.WebGLRenderer({ canvas: glCanvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.outputColorSpace = THREE.SRGBColorSpace;

const scene = new THREE.Scene();
scene.background = new THREE.Color('#161a11');
const camera = new THREE.PerspectiveCamera(32, 1, 20, 9000);
const hemi = new THREE.HemisphereLight(0xe6efff, 0x5a4a35, 1.15);
const sun = new THREE.DirectionalLight(0xfff0d8, 2.8);
sun.castShadow = true;
sun.shadow.mapSize.set(mobile ? 1024 : 2048, mobile ? 1024 : 2048);
Object.assign(sun.shadow.camera, { left: -1100, right: 1100, top: 1100, bottom: -1100, near: 50, far: 4000 });
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 1.2;
scene.add(hemi, sun, sun.target);

// "toy photography": tilt-shift blur keeps a sharp band through the middle of the screen
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const hBlur = new ShaderPass(HorizontalTiltShiftShader);
const vBlur = new ShaderPass(VerticalTiltShiftShader);
hBlur.uniforms.r.value = vBlur.uniforms.r.value = 0.5;
composer.addPass(hBlur); composer.addPass(vBlur);
composer.addPass(new OutputPass());
let tiltShift = !mobile;
addEventListener('keydown', e => { if (e.code === 'KeyT') tiltShift = !tiltShift; });

function resize() {
  const w = innerWidth, h = innerHeight;
  renderer.setSize(w, h, false);
  composer.setSize(w, h);
  camera.aspect = w / h; camera.updateProjectionMatrix();
  hBlur.uniforms.h.value = 2.4 / w;
  vBlur.uniforms.v.value = 2.4 / h;
}
addEventListener('resize', resize); resize();

// ---------------------------------------------------------------- materials
function noiseTexture(size = 128) {
  const c = document.createElement('canvas'); c.width = c.height = size;
  const g = c.getContext('2d'), img = g.createImageData(size, size);
  for (let i = 0; i < size * size; i++) { const v = 118 + Math.random() * 20; img.data.set([v, v, v, 255], i * 4); }
  g.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(c); t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(3, 3);
  return t;
}
const plastic = new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.36, metalness: 0, clearcoat: 0.7, clearcoatRoughness: 0.22, bumpMap: noiseTexture(), bumpScale: 0.35 });
const matte = new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82, metalness: 0 });
const glow = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, blending: THREE.AdditiveBlending, depthWrite: false });
const smokeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.32, roughness: 1, depthWrite: false });
const tracerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
const decalMat = new THREE.MeshBasicMaterial({ color: 0x1e140a, transparent: true, opacity: 0.38, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2 });
const iceMat = new THREE.MeshPhysicalMaterial({ color: '#a9dcf3', roughness: 0.08, metalness: 0, transparent: true, opacity: 0.78, clearcoat: 1 });
const waterMat = new THREE.MeshPhysicalMaterial({ color: '#2f7fa6', roughness: 0.06, metalness: 0, transparent: true, opacity: 0.88, clearcoat: 1 });
const shallowMat = new THREE.MeshPhysicalMaterial({ color: '#5aa5c4', roughness: 0.1, transparent: true, opacity: 0.55, clearcoat: 1 });
const ghostMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, depthWrite: false });
const shieldMat = new THREE.MeshBasicMaterial({ color: '#7fe8ff', transparent: true, opacity: 0.22, blending: THREE.AdditiveBlending, depthWrite: false });

// ---------------------------------------------------------------- geometry helpers
const _m = new THREE.Matrix4(), _q = new THREE.Quaternion(), _e = new THREE.Euler(), _v = new THREE.Vector3(), _s = new THREE.Vector3(), _c = new THREE.Color();
function part(geo, color, { x = 0, y = 0, z = 0, rx = 0, ry = 0, rz = 0, sx = 1, sy = 1, sz = 1 } = {}) {
  let g = geo.index ? geo.toNonIndexed() : geo.clone();
  g.applyMatrix4(_m.compose(_v.set(x, y, z), _q.setFromEuler(_e.set(rx, ry, rz)), _s.set(sx, sy, sz)));
  const col = new THREE.Color(color), n = g.attributes.position.count, a = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) { a[i * 3] = col.r; a[i * 3 + 1] = col.g; a[i * 3 + 2] = col.b; }
  g.setAttribute('color', new THREE.BufferAttribute(a, 3));
  if (!g.attributes.uv) g.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(n * 2), 2));
  return g;
}
const merge = parts => { const g = mergeGeometries(parts, false); g.computeBoundingSphere(); return g; };
const box = (w, h, d) => new THREE.BoxGeometry(w, h, d);
const cyl = (rt, rb, h, seg = 14) => new THREE.CylinderGeometry(rt, rb, h, seg);
const sph = (r, ws = 14, hs = 10) => new THREE.SphereGeometry(r, ws, hs);
const cap = (r, len) => new THREE.CapsuleGeometry(r, len, 4, 10);
const shadeHex = (hex, amt) => { const c = new THREE.Color(hex); const hsl = {}; c.getHSL(hsl); c.setHSL(hsl.h, hsl.s, Math.max(0, Math.min(1, hsl.l + amt))); return c; };

const TEAM = { g: '#4c8a2a', t: '#c9a467' };

// ---------------------------------------------------------------- soldier models
// Real army men are one molded color, so the whole figure shares the team color (weapons a shade
// darker). Limbs are capsules and the helmet is sculpted so the figures read as rounded plastic.
const lathe = (pts, seg = 28) => new THREE.LatheGeometry(pts.map(([x, y]) => new THREE.Vector2(x, y)), seg);
function limb(P, color, x1, y1, z1, x2, y2, z2, r) {
  const dx = x2 - x1, dy = y2 - y1, dz = z2 - z1, len = Math.hypot(dx, dy, dz);
  const g = cap(r, Math.max(0.01, len - r * 0.5));
  const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3(dx, dy, dz).normalize());
  const e = new THREE.Euler().setFromQuaternion(q);
  P.push(part(g, color, { x: (x1 + x2) / 2, y: (y1 + y2) / 2, z: (z1 + z2) / 2, rx: e.x, ry: e.y, rz: e.z }));
}
function soldierGeo(team, w, sarge) {
  const c = TEAM[team], dk = shadeHex(c, -0.08), P = [];
  // beveled molded base
  P.push(part(lathe([[0, 0], [10.4, 0], [10.8, 0.6], [10.6, 2.0], [9.8, 2.5], [0, 2.5]], 32), c));
  const kneel = w === 'mortar' || w === 't_mortar';
  const hip = kneel ? 8.5 : 12.5;
  if (kneel) {
    limb(P, c, 0, hip, 2.4, 5, 4, 2.4, 1.9); limb(P, c, 5, 4, 2.4, 5.5, 2.6, 2.4, 1.8);     // front leg, knee up
    limb(P, c, 0, hip, -2.4, -2, 3.2, -2.4, 1.9); limb(P, c, -2, 3.2, -2.4, -7, 3.2, -2.4, 1.8); // back leg, knee down
  } else {
    limb(P, c, 0.5, hip, 2.4, -1.6, 2.6, 3.0, 1.9);   // braced firing stance
    limb(P, c, 0.5, hip, -2.4, 3.2, 2.6, -3.0, 1.9);
    P.push(part(box(4.6, 1.8, 2.8), c, { x: -1, y: 3.1, z: 3.0 }));      // boots
    P.push(part(box(4.6, 1.8, 2.8), c, { x: 3.9, y: 3.1, z: -3.0 }));
  }
  const ty = hip + 4.6;
  P.push(part(cap(3.3, 4.2), c, { y: ty, sx: 0.85, sz: 1.15 }));                 // torso
  P.push(part(new THREE.TorusGeometry(3.4, 0.55, 6, 18), dk, { y: ty - 3.2, rx: Math.PI / 2, sx: 0.85, sy: 1.15 })); // belt
  for (const z of [-2.4, 2.4]) P.push(part(box(1.6, 2, 1.8), dk, { x: 2.6, y: ty - 3.1, z }));            // ammo pouches
  P.push(part(box(0.6, 7.5, 1), dk, { x: 2.75, y: ty + 0.4, z: 0, rx: 0.5 }));                           // webbing strap
  P.push(part(box(2.8, 6, 5.6), dk, { x: -3.9, y: ty + 0.6 }));                                          // backpack
  P.push(part(cyl(1.2, 1.4, 1.6, 10), c, { x: 0.4, y: ty + 4.6 }));                                      // neck
  P.push(part(sph(2.9, 16, 12), c, { x: 0.7, y: ty + 6.8 }));                                            // head
  P.push(part(sph(0.6, 8, 6), c, { x: 3.5, y: ty + 6.6 }));                                              // nose
  P.push(part(new THREE.SphereGeometry(4.0, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2), c, { x: 0.3, y: ty + 7.2, sy: 0.82 })); // helmet dome
  P.push(part(lathe([[3.9, 0], [4.9, -0.6], [4.9, -0.1], [3.9, 0.4]], 24), c, { x: 0.3, y: ty + 7.3 }));   // flared rim
  P.push(part(new THREE.TorusGeometry(2.6, 0.22, 4, 16, Math.PI), dk, { x: 0.8, y: ty + 6.6, ry: Math.PI / 2, rz: Math.PI })); // chin strap
  // arms reach for the weapon
  const sh = ty + 2.6, gy = ty + 1.8;
  const aims = !(w === 'heal');
  if (w === 'bazooka' || w === 't_bazooka' || w === 's_bazooka') {
    limb(P, c, 0, sh, 3.2, 3, sh + 1.4, 3.6, 1.3); limb(P, c, 0, sh, -3.2, 4.5, sh + 0.5, -0.4, 1.3);
  } else if (aims) {
    limb(P, c, 0, sh, 3.2, 2.6, sh - 2.4, 3.2, 1.3); limb(P, c, 2.6, sh - 2.4, 3.2, 5.5, gy, 1.4, 1.2);
    limb(P, c, 0, sh, -3.2, 4.2, sh - 1.5, -2.5, 1.3); limb(P, c, 4.2, sh - 1.5, -2.5, 9, gy, 1.0, 1.2);
  } else {
    limb(P, c, 0, sh, 3.2, 1, ty - 2, 3.8, 1.3); limb(P, c, 0, sh, -3.2, 4.5, sh - 1, -1.5, 1.3);
  }
  // weapons
  if (w === 'bazooka' || w === 't_bazooka' || w === 's_bazooka') {
    P.push(part(cyl(2, 2, 22, 14), dk, { x: 1.5, y: ty + 4.4, z: 2.6, rz: Math.PI / 2 }));
    P.push(part(cyl(2.7, 2.1, 2.4, 14), dk, { x: 12.6, y: ty + 4.4, z: 2.6, rz: Math.PI / 2 }));
    P.push(part(box(1.6, 2.4, 1), dk, { x: 3, y: ty + 6.6, z: 2.6 }));                        // sight
    P.push(part(box(1.2, 3.2, 1.2), dk, { x: 2.5, y: ty + 2.2, z: 2.6 }));                    // grip
  } else if (w === 'flamer' || w === 's_flamer' || w === 't_flamer') {
    for (const z of [-1.8, 1.8]) { P.push(part(cap(2.1, 5.5), dk, { x: -5.4, y: ty + 0.4, z })); }
    P.push(part(new THREE.TorusGeometry(4, 0.45, 6, 14, Math.PI), dk, { x: -1.2, y: ty - 3.5, z: 1.8, rx: Math.PI / 2 })); // hose
    P.push(part(cyl(0.9, 0.9, 12, 10), dk, { x: 7, y: gy, z: 1.2, rz: Math.PI / 2 }));
    P.push(part(cyl(1.4, 1.1, 2, 10), dk, { x: 13.3, y: gy, z: 1.2, rz: Math.PI / 2 }));
  } else if (w === 'heal') {
    P.push(part(box(1.3, 0.6, 5.5), '#f4f4f4', { x: 0.3, y: ty + 10.6 }));
    P.push(part(box(5.5, 0.6, 1.3), '#f4f4f4', { x: 0.3, y: ty + 10.6 }));
    P.push(part(box(3.2, 3, 4), dk, { x: -0.5, y: ty - 3.4, z: -3.9 }));                      // medical bag
  } else if (w === 'sniper' || w === 's_sniper') {
    P.push(part(cyl(0.6, 0.6, 16, 8), dk, { x: 11, y: gy, z: 1.2, rz: Math.PI / 2 }));
    P.push(part(box(8, 2, 1.6), dk, { x: 3, y: gy - 0.4, z: 1.2 }));
    P.push(part(cyl(1, 1, 6, 10), dk, { x: 5, y: gy + 1.7, z: 1.2, rz: Math.PI / 2 }));     // scope
    P.push(part(box(0.5, 3, 0.5), dk, { x: 12, y: gy - 1.6, z: 0.6, rz: 0.3 }));              // bipod
  } else if (w === 'mortar' || w === 't_mortar') {
    P.push(part(cyl(2.4, 2.4, 15, 14), dk, { x: 8, y: 7.5, rz: -0.75 }));
    P.push(part(cyl(4, 4, 1, 16), dk, { x: 4.5, y: 2.8 }));                                   // baseplate
    P.push(part(box(0.5, 7, 0.5), dk, { x: 11, y: 5, z: 1.5, rz: 0.4 }));
  } else if (w === 's_mg') {
    P.push(part(box(10, 3, 2.6), dk, { x: 5, y: gy, z: 1.2 }));
    P.push(part(cyl(0.8, 0.8, 9, 8), dk, { x: 13.5, y: gy + 0.4, z: 1.2, rz: Math.PI / 2 }));
    P.push(part(box(3, 3.2, 1.8), dk, { x: 4, y: gy - 2.8, z: 1.2 }));                        // ammo box
  } else if (w === 's_shotgun') {
    P.push(part(cyl(0.9, 0.9, 12, 8), dk, { x: 8, y: gy, z: 1.2, rz: Math.PI / 2 }));
    P.push(part(cyl(0.8, 0.8, 9, 8), dk, { x: 7.5, y: gy - 1.5, z: 1.2, rz: Math.PI / 2 }));
    P.push(part(box(5, 2.2, 1.6), dk, { x: 1.5, y: gy - 0.4, z: 1.2 }));
  } else if (w === 'e_smg') {
    P.push(part(box(7, 2, 1.6), dk, { x: 5.5, y: gy, z: 1.2 }));
    P.push(part(box(1.2, 3.4, 1), dk, { x: 6, y: gy - 2.4, z: 1.2 }));
    P.push(part(cyl(0.4, 0.4, 13, 6), '#8a6a3a', { x: -4.8, y: ty + 1, z: -1, rz: 0.35 }));    // shovel handle
    P.push(part(box(0.6, 4.2, 3.4), '#9a9a9a', { x: -6.8, y: ty - 5, z: -1, rz: 0.35 }));     // shovel blade
  } else {
    P.push(part(cyl(0.6, 0.6, 10, 8), dk, { x: 11, y: gy, z: 1.2, rz: Math.PI / 2 }));        // barrel
    P.push(part(box(9, 2, 1.6), dk, { x: 4, y: gy - 0.3, z: 1.2 }));                         // body + stock
    P.push(part(box(1.2, 2.6, 1), dk, { x: 5.5, y: gy - 2, z: 1.2, rz: -0.2 }));              // magazine
    if (w === 's_grenade' || w === 's_mine') P.push(part(sph(1.8, 10, 8), dk, { x: 2, y: ty - 3.4, z: -3.8 }));
  }
  if (sarge) P.push(part(new THREE.OctahedronGeometry(2.2), '#ffd34a', { x: 0.3, y: ty + 10.9, sy: 0.45 }));
  return merge(P);
}
function bossGeo() {
  const P = [soldierGeo('t', 's_mg', false)];
  P.push(part(new THREE.CylinderGeometry(4.8, 4.2, 3.2, 12, 1, true), '#ffcf33', { x: 0.3, y: 27.6 }));
  for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2; P.push(part(new THREE.ConeGeometry(1.1, 3, 6), '#ffcf33', { x: 0.3 + Math.cos(a) * 4.4, y: 30.4, z: Math.sin(a) * 4.4 })); }
  P.push(part(sph(1.1, 8, 6), '#d42c2c', { x: 4.8, y: 27.8 }));
  P.push(part(box(1.2, 16, 12), '#9a1f1f', { x: -6.6, y: 12.5, rz: 0.12 }));   // cape
  return merge(P);
}

// ---------------------------------------------------------------- vehicle & building models
function tankHullGeo(team, r) {
  const c = TEAM[team], dk = shadeHex(c, -0.22), P = [
    part(box(1.9 * r, 0.45 * r, 1.1 * r), c, { y: 0.62 * r }),
    part(box(0.45 * r, 0.32 * r, 1.1 * r), c, { x: 1.05 * r, y: 0.58 * r, rz: -0.55 }),       // sloped glacis
    part(box(2.2 * r, 0.08 * r, 0.42 * r), dk, { y: 0.86 * r, z: 0.75 * r }),                   // fenders
    part(box(2.2 * r, 0.08 * r, 0.42 * r), dk, { y: 0.86 * r, z: -0.75 * r }),
    part(box(0.25 * r, 0.18 * r, 0.25 * r), dk, { x: -0.95 * r, y: 0.94 * r, z: 0.35 * r }),    // exhausts
    part(box(0.25 * r, 0.18 * r, 0.25 * r), dk, { x: -0.95 * r, y: 0.94 * r, z: -0.35 * r }),
  ];
  for (const zs of [1, -1]) {
    P.push(part(box(2.3 * r, 0.12 * r, 0.38 * r), '#2c2c26', { y: 0.74 * r, z: zs * 0.75 * r }));   // track top
    P.push(part(box(2.3 * r, 0.12 * r, 0.38 * r), '#2c2c26', { y: 0.06 * r, z: zs * 0.75 * r }));   // track bottom
    for (let i = 0; i < 5; i++) P.push(part(cyl(0.24 * r, 0.24 * r, 0.36 * r, 14), dk, { x: (-0.85 + i * 0.425) * r, y: 0.3 * r, z: zs * 0.75 * r, rx: Math.PI / 2 }));
    P.push(part(cyl(0.2 * r, 0.2 * r, 0.36 * r, 12), dk, { x: 1.1 * r, y: 0.5 * r, z: zs * 0.75 * r, rx: Math.PI / 2 }));   // drive sprocket
    P.push(part(cyl(0.2 * r, 0.2 * r, 0.36 * r, 12), dk, { x: -1.1 * r, y: 0.5 * r, z: zs * 0.75 * r, rx: Math.PI / 2 }));
  }
  return merge(P);
}
function tankTurretGeo(team, r) {
  const c = TEAM[team], dk = shadeHex(c, -0.1);
  return merge([
    part(lathe([[0.62 * r, 0], [0.6 * r, 0.28 * r], [0.45 * r, 0.42 * r], [0, 0.44 * r]], 24), c, { y: 0.84 * r }),
    part(box(0.3 * r, 0.3 * r, 0.42 * r), dk, { x: 0.58 * r, y: 1.02 * r }),                           // mantlet
    part(cyl(0.085 * r, 0.1 * r, 1.5 * r, 12), dk, { x: 1.4 * r, y: 1.02 * r, rz: Math.PI / 2 }),
    part(cyl(0.13 * r, 0.13 * r, 0.22 * r, 12), dk, { x: 2.1 * r, y: 1.02 * r, rz: Math.PI / 2 }),     // muzzle brake
    part(cyl(0.2 * r, 0.2 * r, 0.1 * r, 14), dk, { x: -0.15 * r, y: 1.3 * r, z: 0.18 * r }),            // hatch
    part(cyl(0.012 * r, 0.012 * r, 1.1 * r, 4), '#222', { x: -0.4 * r, y: 1.75 * r, z: -0.3 * r }),     // antenna
    part(box(0.35 * r, 0.06 * r, 0.06 * r), '#222', { x: 0.05 * r, y: 1.38 * r, z: -0.22 * r }),        // roof MG
  ]);
}
function jeepGeo(team, r) {
  const c = TEAM[team], dk = shadeHex(c, -0.12), P = [
    part(box(2.0 * r, 0.36 * r, 1.12 * r), c, { y: 0.66 * r }),
    part(box(0.75 * r, 0.24 * r, 1.0 * r), c, { x: 0.68 * r, y: 0.94 * r }),                           // hood
    part(box(0.06 * r, 0.24 * r, 0.8 * r), '#333', { x: 1.06 * r, y: 0.8 * r }),                        // grille
    part(box(0.06 * r, 0.46 * r, 1.05 * r), '#9fc6dd', { x: 0.3 * r, y: 1.1 * r }),                     // windshield
    part(box(0.42 * r, 0.28 * r, 0.4 * r), dk, { x: -0.2 * r, y: 0.98 * r, z: 0.28 * r }),              // seats
    part(box(0.42 * r, 0.28 * r, 0.4 * r), dk, { x: -0.2 * r, y: 0.98 * r, z: -0.28 * r }),
    part(new THREE.TorusGeometry(0.12 * r, 0.025 * r, 6, 14), '#222', { x: 0.18 * r, y: 1.06 * r, z: 0.26 * r, ry: Math.PI / 2, rz: 0.5 }), // steering wheel
    part(cyl(0.3 * r, 0.3 * r, 0.16 * r, 16), '#1d1d1d', { x: -1.08 * r, y: 0.78 * r, rz: Math.PI / 2 }), // spare tire
    part(cyl(0.012 * r, 0.012 * r, 1.2 * r, 4), '#222', { x: -0.9 * r, y: 1.3 * r, z: -0.45 * r }),      // antenna
  ];
  for (const z of [0.38, -0.38]) P.push(part(sph(0.08 * r, 8, 6), '#fff6c0', { x: 1.05 * r, y: 0.95 * r, z: z * r }));   // headlights
  for (const [wx, wz] of [[0.68, 0.62], [0.68, -0.62], [-0.68, 0.62], [-0.68, -0.62]]) {
    P.push(part(cyl(0.34 * r, 0.34 * r, 0.24 * r, 18), '#1d1d1d', { x: wx * r, y: 0.34 * r, z: wz * r, rx: Math.PI / 2 }));
    P.push(part(cyl(0.16 * r, 0.16 * r, 0.26 * r, 10), dk, { x: wx * r, y: 0.34 * r, z: wz * r, rx: Math.PI / 2 }));
    P.push(part(box(0.75 * r, 0.06 * r, 0.3 * r), c, { x: wx * r, y: 0.72 * r, z: wz * r * 1.05 }));     // fenders
  }
  return merge(P);
}
function jeepGunGeo(r) { return merge([part(cyl(0.05 * r, 0.06 * r, 0.55 * r, 8), '#2a2a2a', { x: -0.55 * r, y: 1.12 * r }), part(box(0.7 * r, 0.14 * r, 0.12 * r), '#2a2a2a', { x: -0.3 * r, y: 1.42 * r }), part(cyl(0.035 * r, 0.035 * r, 0.6 * r, 6), '#2a2a2a', { x: 0.3 * r, y: 1.44 * r, rz: Math.PI / 2 }), part(box(0.18 * r, 0.2 * r, 0.16 * r), '#4a4a3a', { x: -0.4 * r, y: 1.32 * r, z: 0.14 * r })]); }
function heliGeo(team, r) {
  const c = TEAM[team], dk = shadeHex(c, -0.15);
  return merge([
    part(sph(r, 22, 14), c, { sx: 1, sy: 0.62, sz: 0.62 }),
    part(sph(0.45 * r, 14, 10), '#9fc6dd', { x: 0.55 * r, y: 0.12 * r, sx: 0.8, sy: 0.7, sz: 0.9 }),
    part(cyl(0.16 * r, 0.08 * r, 1.4 * r, 10), c, { x: -1.45 * r, y: 0.1 * r, rz: Math.PI / 2 }),       // tapered tail boom
    part(box(0.1 * r, 0.6 * r, 0.06 * r), dk, { x: -2.1 * r, y: 0.32 * r }),
    part(box(0.3 * r, 0.05 * r, 0.6 * r), dk, { x: -2.0 * r, y: 0.12 * r }),                            // stabilizer
    part(cyl(0.3 * r, 0.3 * r, 0.02 * r, 16), '#333', { x: -2.1 * r, y: 0.32 * r, z: 0.07 * r, rx: Math.PI / 2 }), // tail rotor
    part(box(1.4 * r, 0.05 * r, 0.05 * r), '#2b2b2b', { y: -0.66 * r, z: 0.45 * r }),
    part(box(1.4 * r, 0.05 * r, 0.05 * r), '#2b2b2b', { y: -0.66 * r, z: -0.45 * r }),
    ...[0.4, -0.3].flatMap(x => [0.45, -0.45].map(z => part(box(0.04 * r, 0.3 * r, 0.04 * r), '#2b2b2b', { x: x * r, y: -0.5 * r, z: z * r }))), // skid struts
    part(cyl(0.12 * r, 0.12 * r, 0.6 * r, 10), '#333', { y: -0.1 * r, z: 0.72 * r, rz: Math.PI / 2 }),  // rocket pods
    part(cyl(0.12 * r, 0.12 * r, 0.6 * r, 10), '#333', { y: -0.1 * r, z: -0.72 * r, rz: Math.PI / 2 }),
    part(cyl(0.12 * r, 0.16 * r, 0.25 * r, 12), dk, { y: 0.62 * r }),                                   // rotor mast
  ]);
}
function rotorGeo(r) { return merge([part(box(3.2 * r, 0.04 * r, 0.14 * r), '#222'), part(box(0.14 * r, 0.04 * r, 3.2 * r), '#222')]); }
const blurMat = new THREE.MeshBasicMaterial({ color: '#202020', transparent: true, opacity: 0.16, depthWrite: false, side: THREE.DoubleSide });
function planeGeo(team, r) {
  const c = TEAM[team], dk = shadeHex(c, -0.15), light = shadeHex(c, 0.08);
  const P = [
    part(cap(0.28 * r, 2.0 * r), c, { rz: Math.PI / 2 }),                                               // fuselage
    part(cyl(0.28 * r, 0.12 * r, 0.6 * r, 14), c, { x: -1.4 * r, rz: Math.PI / 2 }),                    // tapering tail
    part(box(0.7 * r, 0.07 * r, 3.0 * r), light, { x: 0.1 * r, y: -0.06 * r }),                         // wings
    part(box(0.35 * r, 0.05 * r, 1.1 * r), dk, { x: -1.55 * r, y: 0.04 * r }),                           // tailplane
    part(box(0.38 * r, 0.42 * r, 0.05 * r), dk, { x: -1.55 * r, y: 0.24 * r }),                          // fin
    part(sph(0.26 * r, 14, 10), '#9fc6dd', { x: 0.35 * r, y: 0.2 * r, sx: 1.6, sy: 0.9, sz: 0.85 }),    // canopy
    part(cyl(0.16 * r, 0.22 * r, 0.25 * r, 14), dk, { x: 1.3 * r, rz: Math.PI / 2 }),                    // cowling
    part(new THREE.ConeGeometry(0.1 * r, 0.22 * r, 10), '#ddd', { x: 1.5 * r, rz: -Math.PI / 2 }),      // spinner
  ];
  for (const z of [1, -1]) {
    P.push(part(cyl(0.12 * r, 0.12 * r, 0.02 * r, 14), team === 'g' ? '#f4f4f4' : '#a33', { x: 0.1 * r, y: -0.01 * r, z: z * 1.05 * r }));   // roundels
    P.push(part(cyl(0.05 * r, 0.05 * r, 0.4 * r, 8), dk, { x: 0.35 * r, y: -0.1 * r, z: z * 0.6 * r, rz: Math.PI / 2 }));  // wing guns
  }
  return merge(P);
}
function bunkerGeo(team, r) {
  const g = team === 'g', bag = g ? '#7a8a55' : '#a8956a', wall = g ? '#5d7f3c' : '#b59866', P = [];
  const n = Math.round(r / 2.6);
  for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n; i++) {
    const a = (i + layer * 0.5) / n * Math.PI * 2;
    P.push(part(cap(4.5, 8), shadeHex(bag, (i % 3 - 1) * 0.03), { x: Math.cos(a) * r, y: 4.5 + layer * 8, z: Math.sin(a) * r, rz: Math.PI / 2, ry: -a + Math.PI / 2, sy: 0.8 }));
  }
  P.push(part(cyl(r * 0.72, r * 0.78, 24, 6), wall, { y: 12 }));
  P.push(part(cyl(r * 0.6, r * 0.72, 6, 6), shadeHex(wall, 0.08), { y: 27 }));
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2 + Math.PI / 6; P.push(part(box(3, 4, r * 0.4), '#1a1a1a', { x: Math.cos(a) * r * 0.74, y: 17, z: Math.sin(a) * r * 0.74, ry: -a })); } // firing slits
  P.push(part(cyl(1, 1, 52, 8), '#dddddd', { x: -r * 0.2, y: 30 }));
  P.push(part(box(18, 11, 1), g ? '#3fae2a' : '#d9b56d', { x: -r * 0.2 + 9, y: 50 }));
  return merge(P);
}
function bunkerGunGeo(r) { return merge([part(cyl(1.8, 2, r * 0.7, 10), '#222', { x: r * 0.55, y: 20, rz: Math.PI / 2 })]); }
function outpostGeo() {
  const P = [];
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2; P.push(part(cap(4.5, 8), i % 2 ? '#7a8a55' : '#6c7b4a', { x: Math.cos(a) * 50, y: 4.5, z: Math.sin(a) * 50, rz: Math.PI / 2, ry: -a + Math.PI / 2 })); }
  P.push(part(cyl(1, 1, 52, 8), '#dddddd', { y: 26 }));
  P.push(part(box(22, 13, 1), '#3fae2a', { x: 11, y: 45 }));
  return merge(P);
}

// ---------------------------------------------------------------- obstacle models (static, per level)
function obstacleParts(o) {
  const cx = o.x + o.w / 2, cz = o.y + o.h / 2, P = [], long = Math.max(o.w, o.h), short = Math.min(o.w, o.h), vert = o.h > o.w;
  const along = vert ? Math.PI / 2 : 0;
  switch (o.kind) {
    case 'block': {
      P.push(part(box(o.w, 26, o.h), o.color, { x: cx, y: 13, z: cz }));
      for (let x = o.x + 14; x < o.x + o.w - 6; x += 22) for (let z = o.y + 14; z < o.y + o.h - 6; z += 22) P.push(part(cyl(7, 7, 5, 16), o.color, { x, y: 28.5, z }));
      return { parts: P, glossy: true };
    }
    case 'crate': {
      P.push(part(box(o.w, o.w * 0.85, o.h), '#a8743c', { x: cx, y: o.w * 0.425, z: cz }));
      P.push(part(box(o.w * 1.3, 2, 4), '#6e4720', { x: cx, y: o.w * 0.85 + 1, z: cz, ry: Math.PI / 4 }));
      P.push(part(box(o.w * 1.3, 2, 4), '#6e4720', { x: cx, y: o.w * 0.85 + 1, z: cz, ry: -Math.PI / 4 }));
      return { parts: P };
    }
    case 'rock': {
      const g = new THREE.DodecahedronGeometry(1, 1);
      P.push(part(g, '#8a8a84', { x: cx, y: short * 0.3, z: cz, sx: o.w * 0.55, sy: short * 0.5, sz: o.h * 0.55, ry: o.seed * 6 }));
      return { parts: P };
    }
    case 'sandbag': {
      const n = Math.max(1, Math.round(long / 24)), step = long / n;
      for (let layer = 0; layer < 2; layer++) for (let i = 0; i < n - layer; i++) {
        const t = -long / 2 + step * (i + 0.5 + layer * 0.5);
        P.push(part(cap(short * 0.42, step * 0.55), i % 2 ? '#8f8559' : '#9e9466', { x: cx + (vert ? 0 : t), y: short * 0.4 + layer * short * 0.6, z: cz + (vert ? t : 0), rz: Math.PI / 2, ry: vert ? Math.PI / 2 : 0 }));
      }
      return { parts: P };
    }
    case 'pencil': case 'crayon': {
      const r = short / 2, body = long - 30, col = o.kind === 'pencil' ? '#f2c230' : o.color;
      const ox = vert ? 0 : 1, oz = vert ? 1 : 0;
      P.push(part(cyl(r, r, body, o.kind === 'pencil' ? 6 : 16), col, { x: cx - ox * 15, y: r, z: cz - oz * 15, rz: vert ? 0 : Math.PI / 2, rx: vert ? Math.PI / 2 : 0 }));
      const tipX = cx + ox * (long / 2 - 15), tipZ = cz + oz * (long / 2 - 15);
      P.push(part(new THREE.ConeGeometry(r, 30, o.kind === 'pencil' ? 6 : 16), o.kind === 'pencil' ? '#e8c79a' : col, { x: tipX, y: r, z: tipZ, rz: vert ? 0 : -Math.PI / 2, rx: vert ? Math.PI / 2 : 0 }));
      if (o.kind === 'pencil') {
        P.push(part(new THREE.ConeGeometry(r * 0.35, 10, 6), '#333', { x: tipX + ox * 10, y: r, z: tipZ + oz * 10, rz: vert ? 0 : -Math.PI / 2, rx: vert ? Math.PI / 2 : 0 }));
        const ex = cx - ox * (long / 2 - 8), ez = cz - oz * (long / 2 - 8);
        P.push(part(cyl(r, r, 16, 14), '#e8909a', { x: ex, y: r, z: ez, rz: vert ? 0 : Math.PI / 2, rx: vert ? Math.PI / 2 : 0 }));
        P.push(part(cyl(r * 1.04, r * 1.04, 8, 14), '#bfbfbf', { x: ex + ox * 11, y: r, z: ez + oz * 11, rz: vert ? 0 : Math.PI / 2, rx: vert ? Math.PI / 2 : 0 }));
      }
      return { parts: P, glossy: o.kind === 'crayon' };
    }
    case 'tire': {
      const R = o.w / 2;
      P.push(part(new THREE.TorusGeometry(R * 0.68, R * 0.32, 12, 28), '#1b1b1b', { x: cx, y: R * 0.32, z: cz, rx: Math.PI / 2 }));
      return { parts: P };
    }
    case 'book': {
      P.push(part(box(o.w, 4, o.h), o.color, { x: cx, y: 2, z: cz }));
      P.push(part(box(o.w - 8, 16, o.h - 8), '#efe6cf', { x: cx + (vert ? 0 : 2), y: 12, z: cz + (vert ? 2 : 0) }));
      P.push(part(box(o.w, 4, o.h), o.color, { x: cx, y: 22, z: cz }));
      P.push(part(box(vert ? o.w : 6, 24, vert ? 6 : o.h), shadeHex(o.color, -0.1), { x: vert ? cx : o.x + 3, y: 12, z: vert ? o.y + 3 : cz }));
      return { parts: P };
    }
    case 'sock': {
      P.push(part(cap(short * 0.45, long * 0.6), o.color, { x: cx, y: short * 0.3, z: cz, rz: Math.PI / 2, ry: -along, sy: 0.7 }));
      const toe = long * 0.36;
      P.push(part(sph(short * 0.55, 14, 10), o.color, { x: cx + (vert ? 0 : toe), y: short * 0.3, z: cz + (vert ? toe : 0), sy: 0.6 }));
      return { parts: P };
    }
    case 'cactus': {
      const r = o.w * 0.22;
      P.push(part(cyl(r, r, 55, 12), '#3e7d3a', { x: cx, y: 27, z: cz }));
      P.push(part(sph(r, 12, 8), '#3e7d3a', { x: cx, y: 55, z: cz }));
      P.push(part(cyl(r * 0.7, r * 0.7, 20, 10), '#3e7d3a', { x: cx - r * 2, y: 32, z: cz }));
      P.push(part(cyl(r * 0.7, r * 0.7, 9, 10), '#3e7d3a', { x: cx - r * 1.2, y: 22, z: cz, rz: Math.PI / 2 }));
      P.push(part(cyl(r * 0.7, r * 0.7, 16, 10), '#3e7d3a', { x: cx + r * 2, y: 36, z: cz }));
      P.push(part(cyl(r * 0.7, r * 0.7, 9, 10), '#3e7d3a', { x: cx + r * 1.2, y: 28, z: cz, rz: Math.PI / 2 }));
      return { parts: P };
    }
    case 'mesa': {
      P.push(part(cyl(0.5, 0.56, 48, 9), '#b55a33', { x: cx, y: 24, z: cz, sx: o.w, sz: o.h }));
      P.push(part(cyl(0.38, 0.46, 30, 9), '#c8724a', { x: cx, y: 63, z: cz, sx: o.w, sz: o.h }));
      return { parts: P };
    }
    case 'pine': {
      const r = o.w / 2;
      P.push(part(cyl(3, 4, 20, 8), '#5a3a1e', { x: cx, y: 10, z: cz }));
      [['#1f4a26', 1, 30], ['#2b6233', 0.75, 52], ['#3a7a40', 0.5, 72]].forEach(([col, f, y]) => P.push(part(new THREE.ConeGeometry(r * f, 34, 12), col, { x: cx, y, z: cz })));
      return { parts: P };
    }
    case 'shrub': {
      const r = o.w / 2;
      for (let i = 0; i < 5; i++) { const a = i / 5 * Math.PI * 2 + o.seed * 6; P.push(part(sph(r * 0.5, 10, 8), i % 2 ? '#5d5a2e' : '#6c683a', { x: cx + Math.cos(a) * r * 0.4, y: r * 0.45, z: cz + Math.sin(a) * r * 0.4 })); }
      P.push(part(sph(r * 0.25, 8, 6), '#f4f6f8', { x: cx, y: r * 0.85, z: cz }));
      return { parts: P };
    }
    case 'drift': {
      P.push(part(sph(1, 20, 12), '#f4f8fb', { x: cx, y: 0, z: cz, sx: o.w * 0.55, sy: 26, sz: o.h * 0.55 }));
      return { parts: P };
    }
    case 'ice': return { ice: true };
    default: P.push(part(box(o.w, 24, o.h), '#888', { x: cx, y: 12, z: cz })); return { parts: P };
  }
}

// ---------------------------------------------------------------- instanced pools
class Pool {
  constructor(geo, mat, { shadow = true, cap = 64 } = {}) { this.geo = geo; this.mat = mat; this.shadow = shadow; this.cap = 0; this.n = 0; this.make(cap); }
  make(cap) {
    if (this.mesh) { scene.remove(this.mesh); this.mesh.dispose(); }
    this.cap = cap;
    this.mesh = new THREE.InstancedMesh(this.geo, this.mat, cap);
    this.mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.mesh.setColorAt(0, _c.set(1, 1, 1));
    this.mesh.castShadow = this.shadow; this.mesh.receiveShadow = this.shadow;
    this.mesh.frustumCulled = false;
    scene.add(this.mesh);
  }
  add(m, color) {
    if (this.n >= this.cap) { const old = this.mesh; const n = this.n; this.make(this.cap * 2); for (let i = 0; i < n; i++) { old.getMatrixAt(i, _m); this.mesh.setMatrixAt(i, _m); old.getColorAt(i, _c); this.mesh.setColorAt(i, _c); } }
    this.mesh.setMatrixAt(this.n, m);
    this.mesh.setColorAt(this.n, color || _c.setRGB(1, 1, 1));
    this.n++;
  }
  end() { this.mesh.count = this.n; this.mesh.instanceMatrix.needsUpdate = true; if (this.mesh.instanceColor) this.mesh.instanceColor.needsUpdate = true; this.n = 0; }
}
const pools = new Map();
function pool(key, make, mat = plastic, opts) { let p = pools.get(key); if (!p) { p = new Pool(make(), mat, opts); pools.set(key, p); } return p; }
const M = new THREE.Matrix4(), Q = new THREE.Quaternion(), YAXIS = new THREE.Vector3(0, 1, 0), POS = new THREE.Vector3(), SCL = new THREE.Vector3();
function place(x, h, z, yaw, s = 1, sy = s) { Q.setFromAxisAngle(YAXIS, -yaw); return M.compose(POS.set(x, h, z), Q, SCL.set(s, sy, s)); }
const WHITE = new THREE.Color(1, 1, 1), FLASH = new THREE.Color(2.6, 2.6, 2.6), TMP = new THREE.Color();

// ---------------------------------------------------------------- level (ground + static props)
let curG = null, levelGroup = null, dynObs = [], groundTex = null, bridges = new Set();
function addDynObstacle(o) {
  o._r3d = true;
  const r = obstacleParts(o);
  if (!r.parts) return;
  const m = new THREE.Mesh(merge(r.parts), r.glossy ? plastic : matte); m.castShadow = m.receiveShadow = true;
  levelGroup.add(m); dynObs.push({ o, mesh: m });
}
function bridgeMesh(sg) {
  const cx = sg.x + sg.w / 2, cz = sg.y + sg.h / 2, L = sg.w + 60, P = [];
  for (let x = -L / 2; x < L / 2; x += 14) P.push(part(box(12, 4, 82), shadeHex('#9a6b3c', ((x / 14) % 3) * 0.03), { x: cx + x + 6, y: 6, z: cz }));
  for (const z of [-42, 42]) { P.push(part(box(L, 4, 4), '#6e4720', { x: cx, y: 14, z: cz + z })); for (let x = -L / 2; x <= L / 2; x += 40) P.push(part(box(4, 12, 4), '#6e4720', { x: cx + x, y: 9, z: cz + z })); }
  for (const x of [-sg.w / 2 + 10, sg.w / 2 - 10]) P.push(part(cyl(5, 5, 14, 10), '#5a3a1e', { x: cx + x, y: 1, z: cz }));
  const m = new THREE.Mesh(merge(P), matte); m.castShadow = m.receiveShadow = true; return m;
}
const THEME_LIGHT = {
  grass: [0xfff0d8, 2.8, 1.15], tile: [0xfff6ea, 2.5, 1.3], bedroom: [0xffe8c8, 2.6, 1.2], concrete: [0xf4f4ff, 2.4, 1.2],
  desert: [0xffe0b0, 3.1, 1.05], mountain: [0xfff2e0, 2.7, 1.1], tundra: [0xf0f4ff, 2.4, 1.25], arctic: [0xeef6ff, 2.2, 1.45],
  carpet: [0xffe2c0, 2.4, 1.2], sand: [0xffeccc, 2.9, 1.1],
};
function buildLevel(G) {
  if (levelGroup) { scene.remove(levelGroup); levelGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); }); }
  if (groundTex) groundTex.dispose();
  for (const p of pools.values()) { scene.remove(p.mesh); p.mesh.dispose(); }
  pools.clear();
  levelGroup = new THREE.Group(); dynObs = [];
  scene.add(levelGroup);
  const W = WORLD_W, H = WORLD_H;
  // ground: reuse the 2D game's painted ground canvas as the texture
  groundTex = new THREE.CanvasTexture(G.ground);
  groundTex.colorSpace = THREE.SRGBColorSpace;
  groundTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const ground = new THREE.Mesh(new THREE.PlaneGeometry(W, H), new THREE.MeshStandardMaterial({ map: groundTex, roughness: 0.92 }));
  ground.rotation.x = -Math.PI / 2; ground.position.set(W / 2, 0, H / 2); ground.receiveShadow = true;
  levelGroup.add(ground);
  const rim = new THREE.Mesh(new THREE.PlaneGeometry(W + 6000, H + 6000), new THREE.MeshStandardMaterial({ color: '#1c2115', roughness: 1 }));
  rim.rotation.x = -Math.PI / 2; rim.position.set(W / 2, -2, H / 2); levelGroup.add(rim);
  // static obstacles merged into two meshes; destructible ones kept separate so they can disappear
  const gloss = [], mat = [];
  if (G.river) for (const sg of G.river.segs) {
    const cx = sg.x + sg.w / 2, cz = sg.y + sg.h / 2;
    const water = new THREE.Mesh(new THREE.BoxGeometry(sg.w, 2, sg.h + 1), sg.ford ? shallowMat : waterMat);
    water.position.set(cx, 1, cz); water.receiveShadow = true; levelGroup.add(water);
    if (sg.ford) { const stones = []; for (let i = 0; i < 9; i++) stones.push(part(new THREE.DodecahedronGeometry(1, 0), '#8d8a80', { x: sg.x + 15 + (i * 53) % (sg.w - 30), y: 2, z: sg.y + 20 + (i * 37) % (sg.h - 40), sx: 10, sy: 4, sz: 9 })); const m = new THREE.Mesh(merge(stones), matte); m.receiveShadow = m.castShadow = true; levelGroup.add(m); }
  }
  for (const o of G.obs) {
    o._r3d = true;
    if (o.kind === 'water') continue;
    const r = obstacleParts(o);
    if (r.ice) { const m = new THREE.Mesh(new THREE.BoxGeometry(o.w, 34, o.h), iceMat); m.position.set(o.x + o.w / 2, 17, o.y + o.h / 2); m.castShadow = true; levelGroup.add(m); dynObs.push({ o, mesh: m }); continue; }
    if (o.hp != null) { const m = new THREE.Mesh(merge(r.parts), r.glossy ? plastic : matte); m.castShadow = m.receiveShadow = true; levelGroup.add(m); dynObs.push({ o, mesh: m }); continue; }
    (r.glossy ? gloss : mat).push(...r.parts);
  }
  for (const [parts, material] of [[gloss, plastic], [mat, matte]]) {
    if (!parts.length) continue;
    const m = new THREE.Mesh(merge(parts), material); m.castShadow = m.receiveShadow = true; levelGroup.add(m);
  }
  bridges = new Set();
  const [col, inten, hemiI] = THEME_LIGHT[G.L.theme] || THEME_LIGHT.grass;
  sun.color.set(col); sun.intensity = inten; hemi.intensity = hemiI;
  curG = G;
}

// ---------------------------------------------------------------- per-frame draw
const shield = new THREE.Mesh(new THREE.SphereGeometry(1, 28, 18), shieldMat); scene.add(shield);
const TRACER = () => merge([part(box(14, 1.4, 1.4), '#ffffff')]);
const ROCKET = () => merge([part(cyl(1.8, 1.8, 12, 10), '#4f5b30', { rz: Math.PI / 2 }), part(new THREE.ConeGeometry(1.8, 4, 10), '#c33', { x: 8, rz: -Math.PI / 2 })]);
const BALL = () => merge([part(sph(1, 10, 8), '#ffffff')]);
const CUBE = () => merge([part(box(1, 1, 1), '#ffffff')]);
const RING = () => merge([part(new THREE.TorusGeometry(1, 0.025, 6, 40), '#ffffff', { rx: Math.PI / 2 })]);
const DISC = () => merge([part(new THREE.CircleGeometry(1, 24), '#ffffff', { rx: -Math.PI / 2 })]);

function render(dt) {
  const G = window.__pf.G;
  if (!G) return;
  if (G !== curG) buildLevel(G);
  const t = G.time;

  // camera: tilted view centred on the game camera, with screen shake
  const dist = 1080 / Z, pitch = 0.98;
  const sh = G.shake * 0.6;
  const tx = G.cam.x + (Math.random() - 0.5) * sh, tz = G.cam.y + (Math.random() - 0.5) * sh;
  camera.position.set(tx, Math.sin(pitch) * dist, tz + Math.cos(pitch) * dist);
  camera.lookAt(tx, 0, tz);
  sun.position.set(tx - 700, 1500, tz - 500); sun.target.position.set(tx, 0, tz); sun.target.updateMatrixWorld();
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const near = (x, y, m = 0) => Math.abs(x - G.cam.x) < 1500 + m && Math.abs(y - G.cam.y) < 1300 + m;

  // destroyed / newly built obstacles and bridges
  for (let i = dynObs.length - 1; i >= 0; i--) if (dynObs[i].o.dead) { levelGroup.remove(dynObs[i].mesh); dynObs[i].mesh.geometry.dispose(); dynObs.splice(i, 1); }
  for (const o of G.obs) if (!o._r3d) addDynObstacle(o);
  if (G.river) for (const sg of G.river.segs) if (sg.bridged && !bridges.has(sg)) { bridges.add(sg); levelGroup.add(bridgeMesh(sg)); }

  // units
  const S = G.sarge;
  for (const u of G.units) {
    if (u.dead || !near(u.x, u.y, 100)) continue;
    const flash = u.flash > 0 ? FLASH : WHITE;
    const T = u.T;
    if (T.building) {
      pool(u.type, () => bunkerGeo(u.team, u.r), matte).add(place(u.x, 0, u.y, 0), flash);
      pool('bgun', () => bunkerGunGeo(u.r)).add(place(u.x, 0, u.y, u.ta || 0), WHITE);
    } else if (u.type === 'boss') {
      pool('boss', bossGeo).add(place(u.x, 0, u.y, u.a, 3.2), flash);
      shield.visible = !!u.shield; shield.position.set(u.x, 40, u.y); shield.scale.setScalar(u.r * 1.7 + Math.sin(t * 4) * 3);
    } else if (T.vehicle) {
      const k = T.kind, tm = u.team;
      if (k === 'tank') {
        pool('tank' + tm, () => tankHullGeo(tm, T.r)).add(place(u.x, 0, u.y, u.a), flash);
        pool('turret' + tm, () => tankTurretGeo(tm, T.r)).add(place(u.x, 0, u.y, u.ta), flash);
      } else if (k === 'plane') {
        // bank into turns: roll follows the turn rate
        const prev = u._pa ?? u.a; u._pa = u.a;
        const turn = (((u.a - prev + Math.PI) % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2) - Math.PI;
        u._roll = (u._roll || 0) * 0.9 + clamp(turn / Math.max(dt, 1e-3) * 0.35, -0.9, 0.9) * 0.1;
        Q.setFromEuler(_e.set(u._roll, -u.a, 0, 'YXZ'));
        pool('plane' + tm, () => planeGeo(tm, T.r)).add(M.compose(POS.set(u.x, 115, u.y), Q, SCL.set(1.2, 1.2, 1.2)), flash);
        const nose = 1.5 * T.r * 1.2;
        pool('propblur', () => merge([part(cyl(0.85 * T.r, 0.85 * T.r, 0.01, 28), '#fff', { rz: Math.PI / 2 })]), blurMat, { shadow: false }).add(M.compose(POS.set(u.x + Math.cos(u.a) * nose, 115, u.y + Math.sin(u.a) * nose), Q, SCL.set(1.2, 1.2, 1.2)), WHITE);
      } else if (k === 'jeep') {
        pool('jeep' + tm, () => jeepGeo(tm, T.r)).add(place(u.x, 0, u.y, u.a), flash);
        pool('jgun', () => jeepGunGeo(T.r)).add(place(u.x, 0, u.y, u.ta), WHITE);
      } else {
        const alt = 85 + Math.sin(t * 2 + u.id) * 4;
        pool('heli' + tm, () => heliGeo(tm, T.r)).add(place(u.x, alt, u.y, u.a), flash);
        pool('rotor', () => rotorGeo(T.r), plastic, { shadow: true }).add(place(u.x, alt + T.r * 0.72, u.y, u.anim * 30), WHITE);
        pool('rotorblur', () => merge([part(cyl(1.6 * T.r, 1.6 * T.r, 0.01, 32), '#fff')]), blurMat, { shadow: false }).add(place(u.x, alt + T.r * 0.7, u.y, 0), WHITE);
      }
    } else {
      const w = u === S ? SARGE_SLOTS[u.slot].w : T.weapon, key = `${u.team}|${w}|${u === S ? 1 : 0}`;
      const hop = u.moving ? Math.abs(Math.sin(u.anim * 11)) * 3.5 : 0;   // toy soldiers "hop" when moved
      pool(key, () => soldierGeo(u.team, w, u === S)).add(place(u.x, hop, u.y, u.a, u === S ? 1.45 : 1.3), flash);
    }
  }
  if (!G.boss || G.boss.dead) shield.visible = false;

  // outposts, mines, pickups
  for (const o of G.outposts) if (near(o.x, o.y)) pool('outpost', outpostGeo, matte).add(place(o.x, 0, o.y, 0), WHITE);
  for (const m of G.mines) if (near(m.x, m.y)) {
    pool('mine', () => merge([part(cyl(9, 10, 4, 18), '#3c4a28', { y: 2 }), part(cyl(2.5, 2.5, 2, 10), '#ff3a2a', { y: 4.5 })])).add(place(m.x, 0, m.y, 0), m.arm > 0 ? WHITE : (Math.floor(t * 3) % 2 ? FLASH : WHITE));
  }
  for (const p of G.pickups) {
    if (!near(p.x, p.y) || (p.t < 5 && Math.floor(p.t * 6) % 2)) continue;
    const y = 10 + Math.sin(t * 4 + p.x) * 3, spin = t * 1.5 + p.x;
    if (p.kind === 'hp') pool('pk_hp', () => merge([part(box(18, 18, 18), '#f4f4f4'), part(box(19, 5, 13), '#d52f2f'), part(box(19, 13, 5), '#d52f2f')])).add(place(p.x, y, p.y, spin), WHITE);
    else if (p.kind === 'ammo') pool('pk_ammo', () => merge([part(box(24, 14, 16), '#4c5a2b'), part(box(25, 3, 17), '#ffd76a', { y: 4 })])).add(place(p.x, y, p.y, spin), WHITE);
    else pool('pk_p', () => merge([part(cyl(9, 9, 4, 20), '#6fd13a', { rx: Math.PI / 2 })])).add(place(p.x, y + 4, p.y, spin), WHITE);
  }

  // decals: scorch marks and fallen soldiers
  for (const d of G.decals) {
    if (!near(d.x, d.y)) continue;
    if (d.kind === 'scorch') pool('scorch', DISC, decalMat, { shadow: false }).add(M.compose(POS.set(d.x, 0.6, d.y), Q.identity(), SCL.set(d.r, 1, d.r)), WHITE);
    else if (d.kind === 'fallen') {
      const lie = new THREE.Matrix4().makeRotationX(Math.PI / 2);
      const m = place(d.x, 3, d.y, d.a).clone().multiply(lie);
      pool('fallen' + d.team, () => soldierGeo(d.team, d.wtype || 'rifle', false)).add(m, TMP.setRGB(0.75, 0.75, 0.75));
    } else if (d.kind === 'rubble') {
      for (let i = 0; i < 9; i++) { const a = i * 0.7, rr = d.r * (0.3 + (i % 3) * 0.25); pool('rubble', CUBE, matte).add(M.compose(POS.set(d.x + Math.cos(a) * rr, 4, d.y + Math.sin(a) * rr), Q.setFromAxisAngle(YAXIS, a), SCL.set(12, 8, 10)), TMP.set(d.team === 'g' ? '#3b4a2a' : '#6d5a3a')); }
    }
  }

  // projectiles
  for (const b of G.bullets) {
    if (!near(b.x, b.y)) continue;
    const yaw = Math.atan2(b.vy || 0, b.vx || 0);
    if (b.kind === 'bullet') pool('tracer', TRACER, tracerMat, { shadow: false }).add(place(b.x, 17, b.y, yaw, b.sniper ? 2.2 : 1, 1), TMP.set(b.sniper ? '#ffffff' : b.team === 'g' ? '#fff3a0' : '#ffb27a'));
    else if (b.kind === 'rocket' || b.kind === 'shell') pool('rocket', ROCKET).add(place(b.x, 18, b.y, yaw), WHITE);
    else if (b.kind === 'flame') { const k = 1 - b.life / b.maxLife; pool('flame', BALL, glow, { shadow: false }).add(place(b.x, 14, b.y, 0, 4 + k * 13), TMP.setRGB(1, 0.75 - k * 0.5, 0.2)); }
    else if (b.kind === 'orb') pool('orb', BALL, glow, { shadow: false }).add(place(b.x, 18, b.y, 0, 6), TMP.set('#ffcf33'));
    else if (b.kind === 'bomb') pool('bomb', () => merge([part(cap(2.6, 7), '#3a3a3a', { rz: Math.PI / 2 }), part(box(1, 5, 5), '#3a3a3a', { x: -6 })])).add(place(b.x, 4 + (b.z || 0), b.y, yaw), WHITE);
    else if (b.kind === 'grenade') pool('grenade', () => merge([part(sph(4, 10, 8), '#3c5a26')])).add(place(b.x, 6 + (b.z || 0), b.y, t * 8), WHITE);
  }

  // particles
  for (const p of G.parts) {
    if (!near(p.x, p.y)) continue;
    const k = p.life / p.max;
    if (p.type === 'smoke') pool('smoke', BALL, smokeMat, { shadow: false }).add(place(p.x, 14 + (1 - k) * 40, p.y, 0, p.size * (1.6 - k * 0.6)), TMP.set(p.col));
    else if (p.type === 'fire' || p.type === 'flash' || p.type === 'spark' || p.type === 'plus') pool('fire', BALL, glow, { shadow: false }).add(place(p.x, 12 + (1 - k) * 18, p.y, 0, p.size * (p.type === 'fire' ? 0.5 + k * 0.5 : 0.6)), TMP.set(p.col));
    else if (p.type === 'debris') pool('debris', CUBE, matte).add(M.compose(POS.set(p.x, 4 + Math.sin(k * Math.PI) * 20, p.y), Q.setFromAxisAngle(YAXIS, k * 9), SCL.setScalar(p.size)), TMP.set(p.col));
    else if (p.type === 'ring') pool('ring', RING, glow, { shadow: false }).add(M.compose(POS.set(p.x, 4, p.y), Q.identity(), SCL.setScalar(Math.max(1, p.size * (1.1 - k * 0.8)))), TMP.set(p.col).multiplyScalar(k * 0.7));
  }

  // blueprints (ghosts) and the build-mode placement preview
  const ghost = (id, x, y, vert, col) => {
    const k = 'ghost_' + id;
    if (id === 'wall') pool(k, () => merge([part(box(1, 1, 1), '#fff')]), ghostMat, { shadow: false }).add(M.compose(POS.set(x, 14, y), Q.identity(), SCL.set(vert ? 28 : 110, 28, vert ? 110 : 28)), col);
    else if (id === 'pill') pool(k, () => merge([part(cyl(34, 38, 30, 6), '#fff', { y: 15 })]), ghostMat, { shadow: false }).add(place(x, 0, y, 0), col);
    else if (id === 'mines') pool(k, () => merge([part(cyl(55, 55, 3, 24), '#fff', { y: 1.5 })]), ghostMat, { shadow: false }).add(place(x, 0, y, 0), col);
    else pool(k, () => merge([part(box(210, 8, 82), '#fff', { y: 6 })]), ghostMat, { shadow: false }).add(place(x, 0, y, 0), col);
  };
  const OK = TMP.clone().set('#8fd8ff'), BAD = new THREE.Color('#ff6a55');
  for (const j of G.jobs) ghost(j.id, j.x, j.y, j.vert, OK);
  if (G.buildMode) {
    const pp = buildPreviewPoint();
    if (pp) {
      const S = STRUCTS[G.buildIdx], from = G.sarge.driving || G.sarge;
      let { x, y } = pp; const seg = S.id === 'bridge' && riverSegAt(x, y); if (seg) { x = seg.x + seg.w / 2; y = seg.y + seg.h / 2; }
      ghost(S.id, x, y, Math.abs(pp.x - from.x) > Math.abs(pp.y - from.y), buildCheck(S, pp.x, pp.y) ? BAD : OK);
    }
  }

  for (const p of pools.values()) p.end();
  if (tiltShift) composer.render(); else renderer.render(scene, camera);
}

// ---------------------------------------------------------------- 2D overlay: bars, labels, rings
const PV = new THREE.Vector3();
function project(x, h, y) {
  PV.set(x, h, y).project(camera);
  if (PV.z > 1) return null;
  return { x: (PV.x + 1) / 2 * innerWidth, y: (1 - PV.y) / 2 * innerHeight };
}
function overlay(c) {
  const G = window.__pf.G;
  if (!G) return;
  c.save();
  const bar = (p, w, f, col) => {
    c.fillStyle = 'rgba(0,0,0,0.6)'; c.fillRect(p.x - w / 2 - 1, p.y - 1, w + 2, 6);
    c.fillStyle = f > 0.5 ? col : f > 0.25 ? '#e8c23a' : '#e04a3a'; c.fillRect(p.x - w / 2, p.y, w * Math.max(0, Math.min(1, f)), 4);
  };
  const ring = (x, y, r, col, lw = 2) => {
    const a = project(x, 1, y), b = project(x + r, 1, y), d = project(x, 1, y + r);
    if (!a || !b || !d) return;
    c.strokeStyle = col; c.lineWidth = lw; c.beginPath();
    c.ellipse(a.x, a.y, Math.max(2, Math.hypot(b.x - a.x, b.y - a.y)), Math.max(2, Math.hypot(d.x - a.x, d.y - a.y)), 0, 0, Math.PI * 2); c.stroke();
  };
  for (const p of G.pings) { c.globalAlpha = Math.max(0, p.t / 0.6); ring(p.x, p.y, 8 + (1 - p.t / 0.6) * 22, p.col); }
  c.globalAlpha = 1;
  for (const u of G.units) if (G.sel.has(u.id)) ring(u.x, u.y, u.r + 5, '#b8ff7a');
  const S = G.sarge;
  if (!S.dead) { const me = S.driving || S; ring(me.x, me.y, me.r + 6, 'rgba(255,230,120,0.9)', 2.5); }
  for (const u of G.units) {
    if (u.dead || u.type === 'boss' || !(u.hp < u.maxHp || u.T.building)) continue;
    const h = u.T.building ? 70 : u.T.kind === 'plane' ? 150 : u.T.air ? 120 : u.T.vehicle ? 40 : 34;
    const p = project(u.x, h, u.y); if (!p) continue;
    bar(p, u.T.building ? 70 : Math.max(22, u.r * 2.2), u.hp / u.maxHp, u.team === 'g' ? '#6fd13a' : '#e8b44a');
  }
  if (!S.dead && !S.driving) {
    const v = nearestFreeVehicle(S, 60);
    if (v) { const p = project(v.x, 50, v.y); if (p) txt(touchMode ? 'Tap DRIVE' : padMode ? 'Y: drive' : 'E: drive', p.x, p.y, 13, '#ffe9a0', 'center'); }
  }
  for (const j of G.jobs) { const p = project(j.x, 40, j.y); if (p) bar(p, 60, j.progress / j.need, '#ffd76a'); }
  for (const tx of G.texts) { const p = project(tx.x, 36, tx.y); if (!p) continue; c.globalAlpha = Math.min(1, tx.t * 2); txt(tx.txt, p.x, p.y, 14, tx.col, 'center'); }
  c.globalAlpha = 1;
  if (mouse.drag) {
    const pts = [[mouse.drag.x, mouse.drag.y], [mouse.wx, mouse.drag.y], [mouse.wx, mouse.wy], [mouse.drag.x, mouse.wy]].map(([x, y]) => project(x, 1, y));
    if (pts.every(Boolean)) { c.strokeStyle = '#b8ff7a'; c.lineWidth = 1.5; c.setLineDash([6, 4]); c.beginPath(); pts.forEach((p, i) => i ? c.lineTo(p.x, p.y) : c.moveTo(p.x, p.y)); c.closePath(); c.stroke(); c.setLineDash([]); }
  }
  if (!mobile) txt(tiltShift ? 'T: tilt-shift on' : 'T: tilt-shift off', innerWidth - 14, innerHeight - (innerHeight > 600 ? 175 : 150), 11, 'rgba(230,245,210,0.55)', 'right', false);
  c.restore();
}

// ---------------------------------------------------------------- screen -> ground
const ray = new THREE.Raycaster(), NDC = new THREE.Vector2(), PLANE = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0), HIT = new THREE.Vector3();
function screenToWorld(sx, sy) {
  NDC.set(sx / innerWidth * 2 - 1, -(sy / innerHeight) * 2 + 1);
  ray.setFromCamera(NDC, camera);
  return ray.ray.intersectPlane(PLANE, HIT) ? { x: HIT.x, y: HIT.z } : null;
}

Object.assign(window.PF3D, { render, overlay, screenToWorld, ready: true, renderer, scene, camera });
