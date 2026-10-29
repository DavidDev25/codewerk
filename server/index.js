'use strict';
/* ==========================================================================
   index.js – Das kleine Backend von Codewerk.

   Aufgaben:
     1. die Webseite ausliefern (public/) und Monaco/acorn/Schriften aus node_modules
     2. Lektionen bereitstellen (ohne Musterlösung!)
     3. Fortschritt speichern (JSON im Volume)
     4. Chat-Anfragen an OmniRoute weiterleiten (API-Key bleibt hier)
   ========================================================================== */
const path = require('path');
const express = require('express');
const { rateLimit } = require('express-rate-limit');

const ROOT = path.join(__dirname, '..');
// .env laden, falls du ohne Docker startest (mit Docker übernimmt compose das)
try { process.loadEnvFile(path.join(ROOT, '.env')); } catch (e) { /* keine .env: ok */ }

const { basicAuth } = require('./auth');
const lessons = require('./lessons');
const { Storage } = require('./storage');
const tutor = require('./tutor');

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const nm = (...p) => path.join(ROOT, 'node_modules', ...p);

async function main() {
  const storage = new Storage(DATA_DIR);
  await storage.init();

  const app = express();
  app.disable('x-powered-by');

  // Hinter einem Reverse-Proxy (nginx, Caddy, Traefik) kommt jede Anfrage von der
  // Adresse des Proxys. Erst mit TRUST_PROXY nimmt Express die echte Besucher-IP
  // aus X-Forwarded-For – sonst würden sich alle Besucher die Tutor-Limits teilen.
  // Werte: Anzahl der Proxys (meist 1) oder z. B. "loopback". Ohne Proxy: leer lassen.
  const trustProxy = process.env.TRUST_PROXY;
  if (trustProxy) app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);

  app.use(basicAuth);

  // Gesundheitscheck (ohne Passwort erreichbar, siehe auth.js)
  app.get('/healthz', (req, res) => res.type('text').send('ok'));

  // Grundlegende Sicherheits-Header. Der Code der Lernenden läuft im Worker;
  // Monaco braucht 'unsafe-eval' für seine Worker nicht, aber blob:/worker-src.
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval'", // 'unsafe-eval': der Worker führt den Übungscode per eval aus
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self' data:",
        "img-src 'self' data:",
        "worker-src 'self' blob:",
        "connect-src 'self'",
      ].join('; '),
    });
    next();
  });

  /* ---- Statische Dateien ---- */
  const longCache = { maxAge: '7d', immutable: true };
  app.use('/vendor/monaco', express.static(nm('monaco-editor', 'min'), longCache));
  app.use('/vendor/fonts', express.static(nm('@fontsource', 'atkinson-hyperlegible', 'files'), longCache));
  app.use('/vendor/fonts', express.static(nm('@fontsource', 'jetbrains-mono', 'files'), longCache));
  app.get('/vendor/acorn/acorn.js', (req, res) => res.sendFile(nm('acorn', 'dist', 'acorn.js')));
  app.use(express.static(path.join(ROOT, 'public'), { maxAge: 0, etag: true }));

  app.use('/api', express.json({ limit: '1mb' }));

  /* ---- Lektionen ---- */
  app.get('/api/lessons', (req, res) => res.json(lessons.list()));

  app.get('/api/lessons/:id', (req, res) => {
    const lesson = lessons.get(req.params.id);
    if (!lesson) return res.status(404).json({ error: 'Lektion nicht gefunden.' });
    res.json(lessons.publicView(lesson)); // ohne Musterlösung
  });

  /* ---- Konfiguration (ohne Geheimnisse) ---- */
  app.get('/api/config', (req, res) => {
    const c = tutor.config();
    res.json({ tutorConfigured: Boolean(c.apiKey && c.model), model: c.model || null });
  });

  /* ---- Fortschritt ---- */
  app.get('/api/progress', (req, res) => res.json(storage.get()));

  app.put('/api/progress/lessons/:id', async (req, res) => {
    if (!lessons.get(req.params.id)) return res.status(404).json({ error: 'Lektion nicht gefunden.' });
    await storage.updateLesson(req.params.id, req.body || {});
    res.json({ ok: true });
  });

  app.post('/api/progress/lessons/:id/reset', async (req, res) => {
    await storage.resetLesson(req.params.id);
    res.json({ ok: true });
  });

  app.put('/api/progress/ui', async (req, res) => {
    await storage.setUi(req.body || {});
    res.json({ ok: true });
  });

  app.post('/api/progress/event', async (req, res) => {
    const b = req.body || {};
    if (b.type === 'open') await storage.setLast(String(b.lessonId || ''));
    await storage.addJournal(b);
    res.json({ ok: true });
  });

  /* ---- KI-Tutor ---- */
  // Schutz vor Missbrauch des API-Keys: höchstens N Anfragen pro Minute und IP.
  // Die Antwort ist JSON mit "error", weil tutor-chat.js genau dieses Feld anzeigt.
  // (Zusätzlich gibt es in tutor.js ein Tagesbudget pro IP.)
  const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: Number(process.env.TUTOR_LIMIT_PER_MINUTE) || 15,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Du stellst gerade sehr viele Fragen. Warte bitte eine Minute, dann geht es weiter.' },
  });

  app.post('/api/chat', chatLimiter, async (req, res) => {
    const payload = req.body || {};
    const { lessons: all } = lessons.loadAll();
    const lesson = all.find((l) => l.id === payload.lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lektion nicht gefunden.' });
    let built;
    try {
      built = tutor.buildMessages({ lesson, payload, journal: storage.get().journal, allLessons: all });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    await tutor.streamTutor({ messages: built.messages, req, res });
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'Unbekannte Adresse.' }));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Codewerk läuft auf http://localhost:${PORT}`);
    const { lessons: l, problems } = lessons.loadAll();
    console.log(`${l.length} Lektionen geladen.`);
    problems.forEach((p) => console.warn('Hinweis:', p));
    if (!process.env.BASIC_AUTH_PASSWORD) console.log('Hinweis: Kein Passwortschutz aktiv (BASIC_AUTH_PASSWORD ist leer).');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
