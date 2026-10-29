'use strict';
/* ==========================================================================
   db.js – Konten, Sitzungen und Fortschritt pro Konto (SQLite).

   Nur im Konten-Modus (GitHub-Login eingerichtet) im Einsatz. SQLite ist in
   Node eingebaut (node:sqlite), es braucht also kein zusätzliches Paket.
   Die Datenbank liegt als eine Datei im Datenordner: data/codewerk.db

   Was gespeichert wird – bewusst so wenig wie möglich:
     users     GitHub-ID, Benutzername, Anzeigename, Zeitpunkte
               (das GitHub-Zugangstoken wird NICHT gespeichert)
     sessions  nur der SHA-256-Hash des Sitzungs-Tokens, nie das Token selbst
     progress  das Fortschritts-Dokument (siehe progress.js) als JSON
   ========================================================================== */
const path = require('path');
const crypto = require('crypto');
const progress = require('./progress');

const SESSION_DAYS = 30;

const hashToken = (token) => crypto.createHash('sha256').update(String(token)).digest('hex');

class Database {
  constructor(dir) {
    const { DatabaseSync } = require('node:sqlite');
    this.db = new DatabaseSync(path.join(dir, 'codewerk.db'));
    this.db.exec(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS users (
        id          INTEGER PRIMARY KEY,
        github_id   INTEGER NOT NULL UNIQUE,
        login       TEXT NOT NULL,
        name        TEXT,
        created_at  TEXT NOT NULL,
        last_login  TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token_hash  TEXT PRIMARY KEY,
        user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        expires_at  INTEGER NOT NULL
      );
      CREATE TABLE IF NOT EXISTS progress (
        user_id     INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
        data        TEXT NOT NULL,
        updated_at  TEXT NOT NULL
      );
    `);
    this.removeExpiredSessions();
  }

  /* ---- Konten ---- */

  userCount() {
    return this.db.prepare('SELECT COUNT(*) AS n FROM users').get().n;
  }

  /** Legt ein Konto an oder aktualisiert Name/Login. Gibt { user, created } zurück. */
  upsertGithubUser({ githubId, login, name }) {
    const now = new Date().toISOString();
    const existing = this.db.prepare('SELECT * FROM users WHERE github_id = ?').get(githubId);
    if (existing) {
      this.db.prepare('UPDATE users SET login = ?, name = ?, last_login = ? WHERE id = ?').run(login, name || null, now, existing.id);
      return { user: this.userById(existing.id), created: false };
    }
    const info = this.db.prepare('INSERT INTO users (github_id, login, name, created_at, last_login) VALUES (?, ?, ?, ?, ?)')
      .run(githubId, login, name || null, now, now);
    return { user: this.userById(Number(info.lastInsertRowid)), created: true };
  }

  userById(id) {
    const u = this.db.prepare('SELECT id, github_id, login, name, created_at, last_login FROM users WHERE id = ?').get(id);
    return u ? { ...u } : null;
  }

  /** Löscht das Konto. Sitzungen und Fortschritt verschwinden mit (ON DELETE CASCADE). */
  deleteUser(id) {
    this.db.prepare('DELETE FROM users WHERE id = ?').run(id);
  }

  /* ---- Sitzungen ---- */

  /** Erzeugt eine neue Sitzung und gibt das (geheime) Token für das Cookie zurück. */
  createSession(userId) {
    const token = crypto.randomBytes(32).toString('base64url');
    const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
    this.db.prepare('INSERT INTO sessions (token_hash, user_id, expires_at) VALUES (?, ?, ?)').run(hashToken(token), userId, expires);
    return { token, maxAgeSeconds: SESSION_DAYS * 24 * 60 * 60 };
  }

  /** Liefert das Konto zu einem Sitzungs-Token – oder null, wenn unbekannt/abgelaufen. */
  userForSession(token) {
    if (!token) return null;
    const row = this.db.prepare('SELECT user_id, expires_at FROM sessions WHERE token_hash = ?').get(hashToken(token));
    if (!row) return null;
    if (row.expires_at < Date.now()) {
      this.deleteSession(token);
      return null;
    }
    return this.userById(row.user_id);
  }

  deleteSession(token) {
    this.db.prepare('DELETE FROM sessions WHERE token_hash = ?').run(hashToken(token));
  }

  removeExpiredSessions() {
    this.db.prepare('DELETE FROM sessions WHERE expires_at < ?').run(Date.now());
  }

  /* ---- Fortschritt ---- */

  /**
   * Gibt einen Speicher für den Fortschritt eines Kontos zurück – mit derselben
   * Schnittstelle wie storage.js (get / update), damit die Routen nicht
   * unterscheiden müssen, wo gespeichert wird.
   */
  progressFor(userId) {
    const db = this.db;
    const read = () => {
      const row = db.prepare('SELECT data FROM progress WHERE user_id = ?').get(userId);
      if (!row) return progress.empty();
      try { return progress.normalize(JSON.parse(row.data)); } catch (e) { return progress.empty(); }
    };
    const write = (doc) => {
      db.prepare(`INSERT INTO progress (user_id, data, updated_at) VALUES (?, ?, ?)
                  ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`)
        .run(userId, JSON.stringify(doc), new Date().toISOString());
    };
    return {
      get: read,
      update(fn) {
        const doc = read();
        fn(doc);
        write(doc);
        return Promise.resolve();
      },
    };
  }
}

module.exports = { Database };
