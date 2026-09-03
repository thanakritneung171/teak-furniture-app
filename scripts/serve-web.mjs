// Static server for the production web build (dist-web) with SPA fallback — for local PWA testing.
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';

const DIR = new URL('../dist-web/', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const PORT = 8090;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.webmanifest': 'application/manifest+json',
  '.png': 'image/png',
  '.ttf': 'font/ttf',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
};

http
  .createServer(async (req, res) => {
    try {
      let p = decodeURIComponent((req.url || '/').split('?')[0]);
      if (p === '/') p = '/index.html';
      let file = normalize(join(DIR, p));
      if (!existsSync(file)) file = join(DIR, 'index.html'); // SPA fallback
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': TYPES[extname(file)] || 'application/octet-stream' });
      res.end(data);
    } catch {
      res.writeHead(404);
      res.end('not found');
    }
  })
  .listen(PORT, () => console.log(`web build → http://localhost:${PORT}`));
