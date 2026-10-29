'use strict';
/* ==========================================================================
   auth.js – Optionaler Passwortschutz (HTTP Basic Auth).

   Aktiv nur, wenn in der .env BASIC_AUTH_PASSWORD gesetzt ist.
   Benutzername: BASIC_AUTH_USER (Standard: "lernen").
   ========================================================================== */
const crypto = require('crypto');

/** Zeitkonstanter Vergleich (verhindert, dass man das Passwort "erraten" kann). */
function safeEqual(a, b) {
  const ha = crypto.createHash('sha256').update(String(a)).digest();
  const hb = crypto.createHash('sha256').update(String(b)).digest();
  return crypto.timingSafeEqual(ha, hb);
}

function basicAuth(req, res, next) {
  const password = process.env.BASIC_AUTH_PASSWORD;
  if (!password) return next(); // kein Passwort gesetzt -> kein Schutz
  if (req.path === '/healthz') return next(); // für Docker-Healthcheck

  const user = process.env.BASIC_AUTH_USER || 'lernen';
  const header = req.headers.authorization || '';
  if (header.startsWith('Basic ')) {
    const decoded = Buffer.from(header.slice(6), 'base64').toString('utf8');
    const i = decoded.indexOf(':');
    if (i !== -1) {
      const okUser = safeEqual(decoded.slice(0, i), user);
      const okPass = safeEqual(decoded.slice(i + 1), password);
      if (okUser && okPass) return next();
    }
  }
  res.set('WWW-Authenticate', 'Basic realm="Codewerk", charset="UTF-8"');
  res.status(401).send('Bitte anmelden.');
}

module.exports = { basicAuth };
