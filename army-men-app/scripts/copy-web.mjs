// Copies the game from ../army-men into www/ for the native app.
// In the app the 3D version is the start page (index.html); the 2D version becomes classic.html.
import { cpSync, rmSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const src = join(root, '..', 'army-men');
const out = join(root, 'www');
rmSync(out, { recursive: true, force: true });
mkdirSync(out, { recursive: true });
for (const f of ['game.js', 'r3d.js', 'controls.html', 'manifest.webmanifest', 'icons', 'vendor']) cpSync(join(src, f), join(out, f), { recursive: true });

const swap = s => s.replaceAll("'index.html'", "'classic.html'").replaceAll("'3d.html'", "'index.html'").replaceAll('href="index.html"', 'href="index.html"');
writeFileSync(join(out, 'index.html'), readFileSync(join(src, '3d.html'), 'utf8'));
writeFileSync(join(out, 'classic.html'), readFileSync(join(src, 'index.html'), 'utf8'));
writeFileSync(join(out, 'game.js'), swap(readFileSync(join(out, 'game.js'), 'utf8')));
console.log('Copied game into', out);
