// Serves build/client the way Vercel serves it with this project's vercel.json:
// exact file -> folder index.html -> trailing slash 308 -> 404.html with status 404.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.ico': 'image/x-icon',
  '.xml': 'application/xml', '.txt': 'text/plain', '.data': 'text/x-script',
};
const isFile = (p) => { try { return fs.statSync(p).isFile(); } catch { return false; } };

export function startServer(dir = 'build/client', port = 0) {
  const root = path.resolve(dir);
  if (!isFile(path.join(root, '404.html'))) throw new Error(`No build in ${root}: run "npm run build" first`);
  const server = http.createServer((req, res) => {
    const [rawPath, query] = req.url.split('?');
    const urlPath = decodeURIComponent(rawPath);
    if (urlPath.length > 1 && urlPath.endsWith('/')) {
      res.writeHead(308, { Location: urlPath.slice(0, -1) + (query ? `?${query}` : '') });
      return res.end();
    }
    const direct = path.join(root, urlPath);
    if (!direct.startsWith(root)) { res.writeHead(403); return res.end(); }
    let file = isFile(direct) ? direct : path.join(direct, 'index.html');
    let status = 200;
    if (!isFile(file)) { file = path.join(root, '404.html'); status = 404; }
    res.writeHead(status, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve({
    url: `http://localhost:${server.address().port}`,
    close: () => new Promise((done) => server.close(done)),
  })));
}
