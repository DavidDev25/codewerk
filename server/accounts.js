'use strict';
/* ==========================================================================
   accounts.js – Anmeldung mit GitHub, Sitzungen und Konto-Funktionen.

   Zwei Betriebsarten:
     • persönlicher Modus  (GITHUB_CLIENT_ID/SECRET leer): eine lernende
       Person, kein Login, Fortschritt in data/progress.json – wie bisher.
     • Konten-Modus        (GitHub eingerichtet): Gäste lernen sofort los,
       ihr Fortschritt bleibt in ihrem Browser. Wer sich mit GitHub anmeldet,
       bekommt ein Konto mit gespeichertem Fortschritt und den KI-Tutor.

   Ablauf der Anmeldung (OAuth):
     1. /auth/github           Zufälligen "state" erzeugen, als Cookie merken,
                               weiter zu GitHub
     2. GitHub fragt die Person und schickt sie mit ?code&state zurück
     3. /auth/github/callback  state prüfen (Schutz vor untergeschobenen Logins),
                               code gegen ein Zugangstoken tauschen, Profil
                               lesen, Konto anlegen/aktualisieren, Sitzung
                               starten. Das GitHub-Token wird danach verworfen.
   ========================================================================== */
const crypto = require('crypto');
const express = require('express');
const progress = require('./progress');
const { readProgressFile } = require('./storage');

const SESSION_COOKIE = 'cw_session';
const STATE_COOKIE = 'cw_oauth_state';

function config() {
  const port = Number(process.env.PORT) || 3000;
  const publicUrl = (process.env.PUBLIC_URL || `http://localhost:${port}`).replace(/\/+$/, '');
  return {
    clientId: process.env.GITHUB_CLIENT_ID || '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
    publicUrl,
    secureCookies: publicUrl.startsWith('https://'),
    // Nur zum Testen änderbar (z. B. gegen ein nachgebautes GitHub)
    githubUrl: (process.env.GITHUB_OAUTH_URL || 'https://github.com').replace(/\/+$/, ''),
    githubApi: (process.env.GITHUB_API_URL || 'https://api.github.com').replace(/\/+$/, ''),
  };
}

const enabled = () => { const c = config(); return Boolean(c.clientId && c.clientSecret); };

/* ---- Cookies (ohne Zusatzpaket) ---- */

function readCookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach((part) => {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  });
  return out;
}

function setCookie(res, name, value, { maxAge, path = '/' } = {}) {
  const parts = [`${name}=${encodeURIComponent(value)}`, `Path=${path}`, 'HttpOnly', 'SameSite=Lax'];
  if (config().secureCookies) parts.push('Secure');
  if (maxAge !== undefined) parts.push(`Max-Age=${maxAge}`);
  res.append('Set-Cookie', parts.join('; '));
}

const clearCookie = (res, name, path = '/') => setCookie(res, name, '', { maxAge: 0, path });

const safeEqual = (a, b) => {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
};

/**
 * Hängt die angemeldete Person als req.user an (oder null).
 * Im persönlichen Modus gibt es keine Konten – dort bleibt req.user leer.
 */
function attachUser(db) {
  return (req, res, next) => {
    req.user = null;
    if (db) {
      const token = readCookies(req)[SESSION_COOKIE];
      if (token) req.user = db.userForSession(token);
    }
    next();
  };
}

/**
 * Weist ändernde Anfragen ab, die von einer fremden Webseite kommen.
 * Zusammen mit SameSite=Lax schützt das vor CSRF (fremde Seite löst Aktion im
 * Namen der angemeldeten Person aus).
 */
function sameOriginOnly(req, res, next) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  const origin = req.headers.origin;
  if (!origin) return next(); // ältere Browser/Werkzeuge ohne Origin: SameSite schützt
  let host;
  try { host = new URL(origin).host; } catch (e) { host = ''; }
  if (host && host === req.headers.host) return next();
  if (origin === config().publicUrl) return next(); // falls ein Proxy den Host-Header umschreibt
  res.status(403).json({ error: 'Anfrage von einer fremden Seite abgelehnt.' });
}

/** Öffentliche Sicht auf ein Konto (ohne interne Felder). */
const publicUser = (u) => (u ? { login: u.login, name: u.name || u.login } : null);

/**
 * Routen für Anmeldung und Konto.
 * @param {{ db, dataDir, isKnownLesson }} deps
 */
function router({ db, dataDir, isKnownLesson }) {
  const r = express.Router();
  const fail = (res, reason) => res.redirect(302, '/?login=fehler&grund=' + encodeURIComponent(reason));

  r.get('/auth/github', (req, res) => {
    if (!enabled()) return res.redirect(302, '/');
    const c = config();
    const state = crypto.randomBytes(16).toString('hex');
    setCookie(res, STATE_COOKIE, state, { maxAge: 600, path: '/auth' });
    const url = new URL(c.githubUrl + '/login/oauth/authorize');
    url.searchParams.set('client_id', c.clientId);
    url.searchParams.set('redirect_uri', c.publicUrl + '/auth/github/callback');
    url.searchParams.set('state', state);
    url.searchParams.set('allow_signup', 'true');
    // Kein "scope": Codewerk braucht nur das öffentliche Profil.
    res.redirect(302, url.toString());
  });

  r.get('/auth/github/callback', async (req, res) => {
    if (!enabled()) return res.redirect(302, '/');
    const c = config();
    const expected = readCookies(req)[STATE_COOKIE];
    clearCookie(res, STATE_COOKIE, '/auth');
    const { code, state, error } = req.query;
    if (error) return fail(res, 'abgebrochen');
    if (!code || !state || !expected || !safeEqual(state, expected)) return fail(res, 'ungueltig');

    try {
      const tokenRes = await fetch(c.githubUrl + '/login/oauth/access_token', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ client_id: c.clientId, client_secret: c.clientSecret, code, redirect_uri: c.publicUrl + '/auth/github/callback' }),
      });
      const tokenJson = await tokenRes.json();
      if (!tokenJson.access_token) return fail(res, 'github');

      const userRes = await fetch(c.githubApi + '/user', {
        headers: { Authorization: 'Bearer ' + tokenJson.access_token, Accept: 'application/vnd.github+json', 'User-Agent': 'Codewerk' },
      });
      const gh = await userRes.json();
      if (!userRes.ok || !gh || typeof gh.id !== 'number' || !gh.login) return fail(res, 'github');

      const { user, created } = db.upsertGithubUser({ githubId: gh.id, login: String(gh.login).slice(0, 60), name: gh.name ? String(gh.name).slice(0, 80) : null });

      // Erstes Konto überhaupt: den Fortschritt aus dem persönlichen Modus übernehmen
      if (created && db.userCount() === 1) await adoptPersonalProgress(db, user.id, dataDir);

      const { token, maxAgeSeconds } = db.createSession(user.id);
      setCookie(res, SESSION_COOKIE, token, { maxAge: maxAgeSeconds });
      res.redirect(302, '/?login=ok');
    } catch (e) {
      console.warn('GitHub-Anmeldung fehlgeschlagen:', e.message);
      fail(res, 'github');
    }
  });

  r.post('/auth/logout', (req, res) => {
    const token = readCookies(req)[SESSION_COOKIE];
    if (db && token) db.deleteSession(token);
    clearCookie(res, SESSION_COOKIE);
    res.json({ ok: true });
  });

  r.get('/api/me', (req, res) => {
    res.json({ accounts: enabled(), user: publicUser(req.user) });
  });

  // Datenauskunft: alles, was über das Konto gespeichert ist, als Datei
  r.get('/api/me/export', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Nicht angemeldet.' });
    const u = req.user;
    res.set('Content-Disposition', 'attachment; filename="codewerk-meine-daten.json"');
    res.json({
      konto: { github_id: u.github_id, login: u.login, name: u.name, erstellt: u.created_at, letzte_anmeldung: u.last_login },
      fortschritt: db.progressFor(u.id).get(),
    });
  });

  // Konto endgültig löschen (mit Sitzungen und Fortschritt)
  r.delete('/api/me', (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Nicht angemeldet.' });
    db.deleteUser(req.user.id);
    clearCookie(res, SESSION_COOKIE);
    res.json({ ok: true });
  });

  // Gast-Fortschritt aus dem Browser ins Konto übernehmen (direkt nach der Anmeldung)
  r.post('/api/progress/import', express.json({ limit: '5mb', inflate: false }), async (req, res) => {
    if (!req.user) return res.status(401).json({ error: 'Nicht angemeldet.' });
    let count = 0;
    await db.progressFor(req.user.id).update((doc) => { count = progress.importGuest(doc, req.body || {}, isKnownLesson); });
    res.json({ ok: true, lessons: count });
  });

  return r;
}

/** Übernimmt data/progress.json (persönlicher Modus) in das allererste Konto. */
async function adoptPersonalProgress(db, userId, dataDir) {
  const fs = require('fs');
  const path = require('path');
  const file = path.join(dataDir, 'progress.json');
  if (!fs.existsSync(file)) return;
  const doc = await readProgressFile(file);
  await db.progressFor(userId).update((target) => Object.assign(target, doc));
  fs.renameSync(file, file.replace(/\.json$/, `.uebernommen-${Date.now()}.json`));
  console.log('Fortschritt aus dem persönlichen Modus wurde in das erste Konto übernommen.');
}

module.exports = { enabled, config, attachUser, sameOriginOnly, router, readCookies };
