'use strict';
/* ==========================================================================
   index.js – Das kleine Backend von Codewerk.

   Aufgaben:
     1. die Webseite ausliefern (public/) und Monaco/acorn/Schriften aus node_modules
     2. Lektionen bereitstellen (ohne Musterlösung!)
     3. Fortschritt speichern – im persönlichen Modus in data/progress.json,
        im Konten-Modus pro Konto in data/codewerk.db (siehe accounts.js)
     4. Chat-Anfragen an OmniRoute weiterleiten (API-Key bleibt hier)
   ========================================================================== */
const path = require('path');
const express = require('express');
const compression = require('compression');
const { rateLimit, ipKeyGenerator } = require('express-rate-limit');

const ROOT = path.join(__dirname, '..');
// .env laden, falls du ohne Docker startest (mit Docker übernimmt compose das)
try { process.loadEnvFile(path.join(ROOT, '.env')); } catch (e) { /* keine .env: ok */ }

const { basicAuth } = require('./auth');
const lessons = require('./lessons');
const { Storage } = require('./storage');
const progress = require('./progress');
const accounts = require('./accounts');
const tutor = require('./tutor');

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = process.env.DATA_DIR || path.join(ROOT, 'data');
const nm = (...p) => path.join(ROOT, 'node_modules', ...p);

async function main() {
  await require('fs').promises.mkdir(DATA_DIR, { recursive: true });

  // Konten-Modus nur, wenn der GitHub-Login eingerichtet ist (GITHUB_CLIENT_ID/SECRET)
  const accountsOn = accounts.enabled();
  let db = null;
  let storage = null;
  if (accountsOn) {
    const { Database } = require('./db');
    db = new Database(DATA_DIR);
    setInterval(() => db.removeExpiredSessions(), 60 * 60 * 1000).unref();
  } else {
    storage = new Storage(DATA_DIR);
    await storage.init();
  }

  /** Wo liegt der Fortschritt dieser Anfrage? Gäste: nirgends (nur im Browser). */
  const storeFor = (req) => (accountsOn ? (req.user ? db.progressFor(req.user.id) : null) : storage);
  const isKnownLesson = (id) => Boolean(lessons.get(id));

  const app = express();
  app.disable('x-powered-by');

  // Hinter einem Reverse-Proxy (nginx, Caddy, Traefik) kommt jede Anfrage von der
  // Adresse des Proxys. Erst mit TRUST_PROXY nimmt Express die echte Besucher-IP
  // aus X-Forwarded-For – sonst würden sich alle Besucher die Tutor-Limits teilen.
  // Werte: Anzahl der Proxys (meist 1) oder z. B. "loopback". Ohne Proxy: leer lassen.
  const trustProxy = process.env.TRUST_PROXY;
  if (trustProxy) app.set('trust proxy', /^\d+$/.test(trustProxy) ? Number(trustProxy) : trustProxy);

  // gzip für alles außer dem Tutor-Stream (Monaco: ~9 MB → ~2,3 MB). Hinter Apache mit
  // mod_deflate ändert das nichts, ohne Proxy spart es viel. /api/chat bleibt unkomprimiert,
  // sonst kämen die Antworten nicht Wort für Wort an.
  app.use(compression({ filter: (req, res) => !req.path.startsWith('/api/chat') && compression.filter(req, res) }));

  app.use(basicAuth);

  // Gesundheitscheck (ohne Passwort erreichbar, siehe auth.js)
  app.get('/healthz', (req, res) => res.type('text').send('ok'));

  // Grundlegende Sicherheits-Header. Der Code der Lernenden läuft im Worker;
  // Monaco braucht 'unsafe-eval' für seine Worker nicht, aber blob:/worker-src.
  app.use((req, res, next) => {
    res.set({
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer',
      'X-Frame-Options': 'DENY',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=()',
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Content-Security-Policy': [
        "default-src 'self'",
        "script-src 'self' 'unsafe-eval'", // 'unsafe-eval': der Worker führt den Übungscode per eval aus
        "style-src 'self' 'unsafe-inline'",
        "font-src 'self' data:",
        "img-src 'self' data:",
        "worker-src 'self' blob:",
        "connect-src 'self'",
        "form-action 'self'",
        "frame-ancestors 'none'", // nicht in fremde Seiten einbettbar (Clickjacking)
        "object-src 'none'",
        "base-uri 'self'",
      ].join('; '),
    });
    next();
  });

  /* ---- Statische Dateien ---- */
  const longCache = { maxAge: '7d', immutable: true };
  app.use('/vendor/monaco', express.static(nm('monaco-editor', 'min'), longCache));
  // Source-Maps, auf die Monaco verweist (nur für die Entwicklerwerkzeuge des Browsers)
  app.use('/vendor/min-maps', express.static(nm('monaco-editor', 'min-maps'), longCache));
  app.use('/vendor/monaco/min-maps', express.static(nm('monaco-editor', 'min-maps'), longCache));
  app.use('/vendor/fonts', express.static(nm('@fontsource', 'atkinson-hyperlegible', 'files'), longCache));
  app.use('/vendor/fonts', express.static(nm('@fontsource', 'jetbrains-mono', 'files'), longCache));
  app.get('/vendor/acorn/acorn.js', (req, res) => res.sendFile(nm('acorn', 'dist', 'acorn.js')));
  app.use(express.static(path.join(ROOT, 'public'), { maxAge: 0, etag: true }));

  /* ---- Anmeldung und Konto ---- */
  app.use(accounts.attachUser(db));
  app.use(['/api', '/auth'], accounts.sameOriginOnly);
  // Schutz vor massenhaften Login-Versuchen und Sitzungs-Spam
  app.use('/auth', rateLimit({
    windowMs: 60 * 1000,
    limit: 30,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: 'Zu viele Anmeldeversuche. Warte bitte eine Minute.' },
  }));
  if (accountsOn) app.use(accounts.router({ db, dataDir: DATA_DIR, isKnownLesson }));
  else app.get('/api/me', (req, res) => res.json({ accounts: false, user: null }));

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
    res.json({
      tutorConfigured: Boolean(c.apiKey && c.model),
      model: c.model || null,
      accounts: accountsOn,
      user: req.user ? { login: req.user.login, name: req.user.name || req.user.login } : null,
      tutorLocked: accountsOn && !req.user, // Gäste: Tutor nur mit Anmeldung
    });
  });

  /* ---- Fortschritt ---- */
  // Gäste speichern im Browser; der Server lehnt ihre Schreibversuche freundlich ab.
  const withStore = (handler) => async (req, res) => {
    const store = storeFor(req);
    if (!store) return res.status(401).json({ error: 'Als Gast wird dein Fortschritt nur in diesem Browser gespeichert. Melde dich an, um ihn im Konto zu sichern.' });
    await handler(store, req, res);
  };

  app.get('/api/progress', withStore((store, req, res) => res.json(store.get())));

  app.put('/api/progress/lessons/:id', withStore(async (store, req, res) => {
    if (!isKnownLesson(req.params.id)) return res.status(404).json({ error: 'Lektion nicht gefunden.' });
    await store.update((doc) => progress.updateLesson(doc, req.params.id, req.body || {}));
    res.json({ ok: true });
  }));

  app.post('/api/progress/lessons/:id/reset', withStore(async (store, req, res) => {
    if (!isKnownLesson(req.params.id)) return res.status(404).json({ error: 'Lektion nicht gefunden.' });
    await store.update((doc) => progress.resetLesson(doc, req.params.id));
    res.json({ ok: true });
  }));

  app.put('/api/progress/ui', withStore(async (store, req, res) => {
    await store.update((doc) => progress.setUi(doc, req.body || {}));
    res.json({ ok: true });
  }));

  app.post('/api/progress/event', withStore(async (store, req, res) => {
    const b = req.body || {};
    await store.update((doc) => {
      if (b.type === 'open' && isKnownLesson(b.lessonId)) progress.setLast(doc, b.lessonId);
      progress.addJournal(doc, b);
    });
    res.json({ ok: true });
  }));

  /* ---- KI-Tutor ---- */
  // Schutz vor Missbrauch des API-Keys: höchstens N Anfragen pro Minute – pro Konto,
  // im persönlichen Modus pro IP. Die Antwort ist JSON mit "error", weil
  // tutor-chat.js genau dieses Feld anzeigt. (Zusätzlich: Tagesbudget in tutor.js.)
  const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: Number(process.env.TUTOR_LIMIT_PER_MINUTE) || 15,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    keyGenerator: (req) => (req.user ? 'user:' + req.user.id : ipKeyGenerator(req.ip)),
    message: { error: 'Du stellst gerade sehr viele Fragen. Warte bitte eine Minute, dann geht es weiter.' },
  });

  app.post('/api/chat', chatLimiter, async (req, res) => {
    if (accountsOn && !req.user) {
      return res.status(401).json({ error: 'Der KI-Tutor ist nur mit Anmeldung verfügbar. Melde dich oben mit GitHub an – kostenlos.' });
    }
    const payload = req.body || {};
    const { lessons: all } = lessons.loadAll();
    const lesson = all.find((l) => l.id === payload.lessonId);
    if (!lesson) return res.status(404).json({ error: 'Lektion nicht gefunden.' });
    let built;
    try {
      built = tutor.buildMessages({ lesson, payload, journal: storeFor(req).get().journal, allLessons: all });
    } catch (e) {
      return res.status(400).json({ error: e.message });
    }
    await tutor.streamTutor({ messages: built.messages, req, res, budgetKey: req.user ? 'user:' + req.user.id : req.ip });
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'Unbekannte Adresse.' }));

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Codewerk läuft auf http://localhost:${PORT}`);
    const { lessons: l, problems } = lessons.loadAll();
    console.log(`${l.length} Lektionen geladen.`);
    console.log(accountsOn
      ? `Konten-Modus: Anmeldung mit GitHub, Gäste speichern im Browser (${accounts.config().publicUrl}).`
      : 'Persönlicher Modus: ohne Anmeldung, Fortschritt in data/progress.json.');
    problems.forEach((p) => console.warn('Hinweis:', p));
    if (!process.env.BASIC_AUTH_PASSWORD) console.log('Hinweis: Kein Passwortschutz aktiv (BASIC_AUTH_PASSWORD ist leer).');
  });
}

main().catch((e) => { console.error(e); process.exit(1); });
