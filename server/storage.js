'use strict';
/* ==========================================================================
   storage.js – Fortschritt als JSON-Datei (persönlicher Modus, ohne Konten).

   Wird genutzt, solange kein GitHub-Login eingerichtet ist: Dann gibt es genau
   eine lernende Person, und ihr Fortschritt liegt in data/progress.json.
   Aufbau des Dokuments und alle Regeln: siehe progress.js.

   Geschrieben wird atomar (erst temporäre Datei, dann umbenennen), und alle
   Schreibzugriffe laufen nacheinander. So bleibt die Datei auch bei einem
   Absturz oder zwei gleichzeitigen Anfragen heil.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const progress = require('./progress');

class Storage {
  constructor(dir) {
    this.dir = dir;
    this.file = path.join(dir, 'progress.json');
    this.state = null;
    this.queue = Promise.resolve();
  }

  async init() {
    await fs.promises.mkdir(this.dir, { recursive: true });
    this.state = await readProgressFile(this.file);
  }

  get() {
    return this.state;
  }

  /** Ändert das Dokument mit fn(doc) und speichert es danach. */
  update(fn) {
    fn(this.state);
    return this.persist();
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
}

/** Liest eine progress.json. Ist sie kaputt, wird sie gesichert statt überschrieben. */
async function readProgressFile(file) {
  try {
    return progress.normalize(JSON.parse(await fs.promises.readFile(file, 'utf8')));
  } catch (e) {
    if (e.code !== 'ENOENT') {
      const backup = file.replace(/\.json$/, `.defekt-${Date.now()}.json`);
      try { await fs.promises.rename(file, backup); } catch (e2) { /* egal */ }
      console.warn('progress.json war nicht lesbar, gesichert als', backup);
    }
    return progress.empty();
  }
}

module.exports = { Storage, readProgressFile };
