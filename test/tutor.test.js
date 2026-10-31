'use strict';
// Prüft die Anbindung an Cloudflare Workers AI (OpenAI-kompatibel) gegen einen nachgebauten Dienst:
// Ausweichmodell, Pause bei aufgebrauchtem Tageskontingent, abgelehnter Token, fehlende Einrichtung.
const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('http');

const upstream = http.createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    const { model } = JSON.parse(body);
    if (req.headers.authorization !== 'Bearer gut') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      return res.end('{"errors":[{"code":10000,"message":"Authentication error"}]}');
    }
    if (model === 'kaputt') { res.writeHead(500); return res.end('{"errors":[{"message":"Internal"}]}'); }
    if (model === 'voll') {
      res.writeHead(429, { 'Content-Type': 'application/json' });
      return res.end('{"errors":[{"code":4006,"message":"you have used up your daily free allocation of 10,000 neurons"}]}');
    }
    res.writeHead(200, { 'Content-Type': 'text/event-stream' });
    res.write('data: {"choices":[{"delta":{"content":"Antwort von ' + model + '"}}]}\n\n');
    res.end('data: [DONE]\n\n');
  });
});

let base;
test.before(() => new Promise((resolve) => upstream.listen(0, '127.0.0.1', () => {
  base = `http://127.0.0.1:${upstream.address().port}/v1`;
  resolve();
})));
test.after(() => upstream.close());

function fakeRes() {
  const events = [];
  return {
    events,
    status() { return this; },
    set() { return this; },
    flushHeaders() {},
    on() {},
    write(chunk) { events.push(JSON.parse(String(chunk).replace(/^data: /, ''))); },
    end() { this.writableEnded = true; },
    writableEnded: false,
  };
}

async function ask(env) {
  const keys = ['TUTOR_BASE_URL', 'CLOUDFLARE_API_TOKEN', 'TUTOR_MODELS', 'CLOUDFLARE_ACCOUNT_ID'];
  const old = Object.fromEntries(keys.map((k) => [k, process.env[k]]));
  keys.forEach((k) => { delete process.env[k]; });
  Object.assign(process.env, env);
  delete require.cache[require.resolve('../server/tutor')];
  const tutor = require('../server/tutor');
  const res = fakeRes();
  const warn = console.warn;
  console.warn = () => {};
  try {
    await tutor.streamTutor({ messages: [{ role: 'user', content: 'Hallo' }], req: { ip: '1.2.3.' + Math.random() }, res, budgetKey: 'k' + Math.random() });
  } finally {
    console.warn = warn;
    keys.forEach((k) => { if (old[k] === undefined) delete process.env[k]; else process.env[k] = old[k]; });
  }
  return res.events;
}

test('Fällt ein Modell aus, antwortet das nächste', async () => {
  const events = await ask({ TUTOR_BASE_URL: base, CLOUDFLARE_API_TOKEN: 'gut', TUTOR_MODELS: 'kaputt,ersatz' });
  assert.deepEqual(events, [{ delta: 'Antwort von ersatz' }, { done: true }]);
});

test('Aufgebrauchtes Tageskontingent ergibt eine freundliche Pause statt eines Fehlers', async () => {
  const events = await ask({ TUTOR_BASE_URL: base, CLOUDFLARE_API_TOKEN: 'gut', TUTOR_MODELS: 'voll,ersatz' });
  assert.match(events[0].delta, /macht für heute Pause/);
  assert.deepEqual(events[1], { done: true });
});

test('Ein abgelehnter Token wird verständlich gemeldet', async () => {
  const events = await ask({ TUTOR_BASE_URL: base, CLOUDFLARE_API_TOKEN: 'falsch', TUTOR_MODELS: 'ersatz' });
  assert.match(events[0].error, /API-Token abgelehnt/);
});

test('Ohne Account-ID und Token ist der Tutor nicht eingerichtet', async () => {
  const events = await ask({});
  assert.match(events[0].error, /CLOUDFLARE_ACCOUNT_ID und CLOUDFLARE_API_TOKEN/);
});

test('Die Account-ID ergibt die Cloudflare-Adresse', () => {
  process.env.CLOUDFLARE_ACCOUNT_ID = 'abc123';
  delete require.cache[require.resolve('../server/tutor')];
  const cfg = require('../server/tutor').config();
  delete process.env.CLOUDFLARE_ACCOUNT_ID;
  assert.equal(cfg.baseUrl, 'https://api.cloudflare.com/client/v4/accounts/abc123/ai/v1');
  assert.deepEqual(cfg.models, ['@cf/mistralai/mistral-small-3.1-24b-instruct', '@cf/qwen/qwen2.5-coder-32b-instruct']);
});
