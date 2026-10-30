'use strict';
// Startet den echten Server (persönlicher Modus) gegen ein nachgebautes OmniRoute
// und prüft Header, Auslieferung, Lektions-API und den Tutor-Stream.
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const ROOT = path.join(__dirname, '..');
let server;
let base;
let upstream;
let upstreamPort;
let lastUpstreamRequest = null;
const dataDir = fs.mkdtempSync(path.join(os.tmpdir(), 'codewerk-data-'));

function freePort() {
  return new Promise((resolve) => {
    const s = http.createServer().listen(0, '127.0.0.1', () => { const { port } = s.address(); s.close(() => resolve(port)); });
  });
}

test.before(async () => {
  upstream = http.createServer((req, res) => {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      lastUpstreamRequest = { url: req.url, auth: req.headers.authorization, body: JSON.parse(body) };
      res.writeHead(200, { 'Content-Type': 'text/event-stream' });
      for (const word of ['Hallo', ' Welt']) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: word } }] })}\n\n`);
        await new Promise((r) => setTimeout(r, 30));
      }
      res.end('data: [DONE]\n\n');
    });
  });
  await new Promise((r) => upstream.listen(0, '127.0.0.1', r));
  upstreamPort = upstream.address().port;

  const port = await freePort();
  base = `http://127.0.0.1:${port}`;
  server = spawn(process.execPath, ['server/index.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(port),
      DATA_DIR: dataDir,
      GITHUB_CLIENT_ID: '',
      GITHUB_CLIENT_SECRET: '',
      BASIC_AUTH_PASSWORD: '',
      TRUST_PROXY: '',
      OMNIROUTE_BASE_URL: `http://127.0.0.1:${upstreamPort}/v1`,
      OMNIROUTE_API_KEY: 'test-key',
      OMNIROUTE_MODEL: 'tutor',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  await new Promise((resolve, reject) => {
    let out = '';
    const timer = setTimeout(() => reject(new Error('Server startet nicht:\n' + out)), 10000);
    const onData = (d) => {
      out += d;
      if (out.includes('Lektionen geladen')) { clearTimeout(timer); resolve(); }
    };
    server.stdout.on('data', onData);
    server.stderr.on('data', onData);
  });
});

test.after(() => {
  if (server) server.kill();
  if (upstream) upstream.close();
  fs.rmSync(dataDir, { recursive: true, force: true });
});

test('Startseite: Sicherheits-Header und Inhalte', async () => {
  const res = await fetch(base + '/');
  assert.equal(res.status, 200);
  const csp = res.headers.get('content-security-policy');
  assert.match(csp, /frame-ancestors 'none'/);
  assert.match(csp, /object-src 'none'/);
  assert.equal(res.headers.get('x-frame-options'), 'DENY');
  assert.equal(res.headers.get('x-content-type-options'), 'nosniff');
  assert.ok(res.headers.get('permissions-policy'));
  const html = await res.text();
  assert.match(html, /id="btn-tour"/);
  assert.match(html, /property="og:image"/);
  assert.match(html, /href="\/datenschutz\.html"/);
});

test('Statische Dateien werden mit gzip ausgeliefert', async () => {
  const res = await fetch(base + '/js/main.js', { headers: { 'Accept-Encoding': 'gzip' } });
  assert.equal(res.status, 200);
  assert.equal(res.headers.get('content-encoding'), 'gzip');
});

test('Rechtsseiten, SEO-Dateien und Monaco-Source-Maps sind erreichbar', async () => {
  for (const p of ['/impressum.html', '/datenschutz.html', '/robots.txt', '/sitemap.xml', '/og.png', '/vendor/min-maps/vs/editor/editor.main.js.map']) {
    const res = await fetch(base + p);
    assert.equal(res.status, 200, p);
    await res.arrayBuffer();
  }
});

test('Lektions-API: Lektion 0 vorne, Musterlösung bleibt auf dem Server', async () => {
  const list = await (await fetch(base + '/api/lessons')).json();
  assert.equal(list.lessons[0].index, 0);
  const lesson = await (await fetch(base + '/api/lessons/' + list.lessons[0].id)).json();
  assert.equal('solution' in lesson, false);
  assert.ok(lesson.starterCode);
});

test('Tutor: Antwort kommt als unkomprimierter Stream, Lösung nur an die KI', async () => {
  const res = await fetch(base + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept-Encoding': 'gzip' },
    body: JSON.stringify({ lessonId: '00-so-funktioniert-codewerk', mode: 'tipp', code: 'console.log(1);', tests: [] }),
  });
  assert.equal(res.status, 200);
  assert.match(res.headers.get('content-type'), /text\/event-stream/);
  assert.equal(res.headers.get('content-encoding'), null);
  const text = await res.text();
  assert.match(text, /"delta":"Hallo"/);
  assert.match(text, /"delta":" Welt"/);
  assert.match(text, /"done":true/);
  assert.doesNotMatch(text, /lieblingszahl = 7/, 'die Musterlösung darf nicht an den Browser gehen');

  assert.equal(lastUpstreamRequest.url, '/v1/chat/completions');
  assert.equal(lastUpstreamRequest.auth, 'Bearer test-key');
  assert.equal(lastUpstreamRequest.body.model, 'tutor');
  assert.equal(lastUpstreamRequest.body.stream, true);
  assert.match(JSON.stringify(lastUpstreamRequest.body.messages), /lieblingszahl = 7/, 'die KI kennt die Musterlösung');
});

test('Anfragen von fremden Seiten werden abgelehnt', async () => {
  const res = await fetch(base + '/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: 'https://boese.example' },
    body: JSON.stringify({ lessonId: '00-so-funktioniert-codewerk', mode: 'tipp' }),
  });
  assert.equal(res.status, 403);
});

test('Unbekannte API-Adresse liefert 404 als JSON', async () => {
  const res = await fetch(base + '/api/gibt-es-nicht');
  assert.equal(res.status, 404);
  assert.ok((await res.json()).error);
});
