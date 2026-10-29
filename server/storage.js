'use strict';
/* ==========================================================================
   storage.js – Fortschritt als JSON-Datei speichern (liegt im Docker-Volume).

   Aufbau von progress.json:
   {
     version: 1,
     lastLessonId: "03-objekte",
     ui: { tab: "aufgabe", resultTab: "pruefung" },
     lessons: {
       "03-objekte": { code, done, doneAt, lastRun: {passed,total,error}, chat: [...], updatedAt }
     },
     journal: [ { t: "2025-01-01T10:00:00Z", lessonId, type, detail } ]   // für „Wo war ich?“
   }

   Geschrieben wird atomar (erst temporäre Datei, dann umbenennen), und alle
   Schreibzugriffe laufen nacheinander. So bleibt die Datei auch bei einem
   Absturz oder zwei gleichzeitigen Anfragen heil.
   ========================================================================== */
const fs = require('fs');
const path = require('path');

const MAX_CODE = 200 * 1024;   // 200 KB Code pro Lektion
const MAX_JOURNAL = 150;
const MAX_CHAT = 40;           // Nachrichten pro Lektion
const MAX_CHAT_TEXT = 6000;

class Storage {
  constructor(dir) {
    this.dir = dir;
    this.file = path.join(dir, 'progress.json');
    this.state = null;
    this.queue = Promise.resolve();
  }

  empty() {
    return { version: 1, lastLessonId: null, ui: {}, lessons: {}, journal: [] };
  }

  async init() {
    await fs.promises.mkdir(this.dir, { recursive: true });
    try {
      const text = await fs.promises.readFile(this.file, 'utf8');
      this.state = Object.assign(this.empty(), JSON.parse(text));
    } catch (e) {
      if (e.code !== 'ENOENT') {
        // Datei kaputt: sichern statt überschreiben
        const backup = this.file.replace(/\.json$/, `.defekt-${Date.now()}.json`);
        try { await fs.promises.rename(this.file, backup); } catch (e2) { /* egal */ }
        console.warn('progress.json war nicht lesbar, gesichert als', backup);
      }
      this.state = this.empty();
    }
  }

  get() {
    return this.state;
  }

  /** Schreibt den aktuellen Stand – nacheinander und atomar. */
  persist() {
    this.queue = this.queue.then(async () => {
      const tmp = this.file + '.tmp';
      await fs.promises.writeFile(tmp, JSON.stringify(this.state, null, 2), 'utf8');
      await fs.promises.rename(tmp, this.file);
    }).catch((e) => console.error('Speichern fehlgeschlagen:', e.message));
    return this.queue;
  }

  lesson(id) {
    if (!this.state.lessons[id]) this.state.lessons[id] = { code: null, done: false, chat: [] };
    return this.state.lessons[id];
  }

  /** Teil-Update einer Lektion (nur bekannte Felder, mit Größenlimits). */
  updateLesson(id, patch) {
    const l = this.lesson(id);
    if (typeof patch.code === 'string') l.code = patch.code.slice(0, MAX_CODE);
    if (typeof patch.done === 'boolean' && patch.done && !l.done) {
      l.done = true;
      l.doneAt = new Date().toISOString();
    }
    if (patch.lastRun && typeof patch.lastRun === 'object') {
      const r = patch.lastRun;
      l.lastRun = {
        passed: Number(r.passed) || 0,
        total: Number(r.total) || 0,
        error: r.error ? String(r.error).slice(0, 300) : null,
        at: new Date().toISOString(),
      };
    }
    if (Array.isArray(patch.chat)) {
      l.chat = patch.chat.slice(-MAX_CHAT)
        .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
        .map((m) => ({ role: m.role, content: String(m.content || '').slice(0, MAX_CHAT_TEXT) }));
    }
    l.updatedAt = new Date().toISOString();
    this.state.lastLessonId = id;
    return this.persist();
  }

  resetLesson(id) {
    const l = this.lesson(id);
    l.code = null;
    l.lastRun = null;
    l.updatedAt = new Date().toISOString();
    return this.persist();
  }

  setUi(ui) {
    const allowedTabs = ['verstehen', 'aufgabe', 'tutor'];
    const allowedResults = ['pruefung', 'ausgabe', 'diagramm'];
    if (ui && allowedTabs.includes(ui.tab)) this.state.ui.tab = ui.tab;
    if (ui && allowedResults.includes(ui.resultTab)) this.state.ui.resultTab = ui.resultTab;
    return this.persist();
  }

  setLast(id) {
    this.state.lastLessonId = id;
    return this.persist();
  }

  addJournal(entry) {
    this.state.journal.push({
      t: new Date().toISOString(),
      lessonId: String(entry.lessonId || '').slice(0, 80),
      type: String(entry.type || '').slice(0, 30),
      detail: String(entry.detail || '').slice(0, 200),
    });
    if (this.state.journal.length > MAX_JOURNAL) this.state.journal.splice(0, this.state.journal.length - MAX_JOURNAL);
    return this.persist();
  }
}

module.exports = { Storage };
