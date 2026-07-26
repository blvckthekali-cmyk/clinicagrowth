/* =====================================================================
   ClinicAI Growth — mini servidor local (sin dependencias)
   Usa solo módulos integrados de Node. Sirve esta carpeta por HTTP
   para que carguen los estilos Y el chatbot de Typebot.
   Arráncalo con doble clic en "abrir-web.bat" o con: node server.js
   ===================================================================== */
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
let PORT = 8080;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

const server = http.createServer((req, res) => {
  // Quita query string y decodifica
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  // Resuelve de forma segura dentro de ROOT (evita ../)
  const filePath = path.normalize(path.join(ROOT, urlPath));
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('403 Forbidden');
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      return res.end('<h1>404 — no encontrado</h1><p>' + urlPath + '</p>');
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

function start(port) {
  server.once('error', (e) => {
    if (e.code === 'EADDRINUSE' && port < 8090) {
      start(port + 1); // prueba el siguiente puerto
    } else {
      console.error('No se pudo iniciar el servidor:', e.message);
      process.exit(1);
    }
  });
  server.listen(port, () => {
    PORT = port;
    const url = 'http://localhost:' + port + '/';
    console.log('\n  ✅ ClinicAI Growth está en marcha.');
    console.log('  👉 Abre en tu navegador:  ' + url);
    console.log('\n  (Deja esta ventana abierta mientras uses la web. Ciérrala para apagar el servidor.)\n');
    // Abre el navegador por defecto en Windows (NO_OPEN=1 lo desactiva, p. ej. en pruebas)
    if (!process.env.NO_OPEN) exec('start "" "' + url + '"');
  });
}

start(PORT);
