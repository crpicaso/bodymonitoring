/**
 * Weight Overview Pro - Lokaler Synchronisations-Server für Dropbox (macOS / Linux / Windows)
 * Startet einen ressourcenschonenden HTTP-Server auf Port 8080 (oder nächstem freiem Port)
 * und sichert alle Änderungen automatisch direkt in 'data.js' auf der Festplatte.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
let port = 8080;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
};

function createServer(portToTry) {
  const server = http.createServer((req, res) => {
    // CORS headers for cross-origin access from file:// or localhost
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }

    const url = new URL(req.url, `http://127.0.0.1:${portToTry}`);
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;

    // 1. API Status Endpoint
    if (pathname === '/api/status' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
      res.end(JSON.stringify({ status: 'connected', server: 'WeightSyncServer', port: portToTry }));
      return;
    }

    // 2. API Save Endpoint: Writes data.js directly to disk
    if (pathname === '/api/save' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', () => {
        try {
          const payload = JSON.parse(body);
          if (!payload.content) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ status: 'error', message: 'Kein Inhalt uebergeben' }));
            return;
          }

          const targetFile = path.join(ROOT_DIR, 'data.js');
          fs.writeFileSync(targetFile, payload.content, 'utf8');

          const now = new Date().toLocaleTimeString('de-CH');
          console.log(`[${now}] ✓ data.js erfolgreich aktualisiert -> Dropbox synchronisiert jetzt!`);

          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'ok', message: 'data.js gespeichert', timestamp: payload.timestamp }));
        } catch (err) {
          console.error('Fehler beim Speichern von data.js:', err);
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' });
          res.end(JSON.stringify({ status: 'error', message: err.message }));
        }
      });
      return;
    }

    // 3. Static File Serving
    const safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    const filePath = path.join(ROOT_DIR, safePath);

    if (!filePath.startsWith(ROOT_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      res.end('403 Forbidden');
      return;
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') {
      portToTry++;
      if (portToTry < 8100) {
        createServer(portToTry);
      } else {
        console.error('Kein freier Port zwischen 8080 und 8100 gefunden.');
      }
    } else {
      console.error('Server-Fehler:', err);
    }
  });

  server.listen(portToTry, '127.0.0.1', () => {
    port = portToTry;
    console.log('==========================================================');
    console.log('  Weight Overview Pro - Dropbox Sync Server AKTIV');
    console.log(`  Adresse: http://127.0.0.1:${port}/index.html`);
    console.log(`  Ordner:  ${ROOT_DIR}`);
    console.log('  Automatisches Speichern in data.js laeuft im Hintergrund.');
    console.log('==========================================================');
  });
}

createServer(port);
