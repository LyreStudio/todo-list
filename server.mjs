import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const allowed = new Set(JSON.parse(await fs.readFile(new URL('./public-files.json', import.meta.url))));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };
const server = http.createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const file = pathname === '/' ? 'index.html' : pathname.slice(1);
    if (!['GET', 'HEAD'].includes(request.method) || !allowed.has(file)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    const target = await fs.realpath(path.join(root, file));
    if (!target.startsWith(root + path.sep)) {
      response.writeHead(404); response.end('Not found'); return;
    }
    const bytes = await fs.readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'no-cache' });
    response.end(request.method === 'HEAD' ? undefined : bytes);
  } catch {
    response.writeHead(404); response.end('Not found');
  }
});
server.on('error', () => { console.error('LYRE_TEMPLATE_SERVER_UNAVAILABLE: Choose an available port.'); process.exitCode = 1; });
server.listen(Number(process.env.PORT || 4173), process.env.HOST || '127.0.0.1', () => console.log(`Template ready: http://${process.env.HOST || '127.0.0.1'}:${server.address().port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
