'use strict';
/* ==========================================================================
   lessons.js – Lektionen von der Festplatte laden.

   Jede Lektion ist ein Ordner in /lessons, z. B. lessons/01-variablen/:
     lektion.json   Titel, Dauer, Kurzbeschreibung, Tipp
     erklaerung.md  Erklärung mit Alltagsbeispiel
     aufgabe.md     die Aufgabe (10–15 Minuten)
     start.js       Startcode im Editor
     tests.js       automatische Tests (laufen im Browser-Worker)
     loesung.js     Musterlösung – bleibt auf dem Server, nur der KI-Tutor kennt sie
     seite.html     (optional) HTML einer Seite: Der Code läuft dann in einem
                    abgeschotteten iframe mit echtem DOM statt im Worker
     dateien/       (optional, statt start.js) mehrere Startdateien als echte
                    ES-Module, Einstieg ist main.js (oder "einstieg" in lektion.json)
     loesung/       (optional, statt loesung.js) die Musterlösung als Dateien
     "laufzeit": "node" in lektion.json macht daraus eine Node.js-Lektion: Der Code
                    läuft in einem nachgebildeten Node im Browser-Worker (fs im Speicher,
                    http simuliert), nie auf dem Server. "argumente" und "umgebung"
                    füllen process.argv und process.env.

   Die Ordner werden bei JEDER Anfrage neu gelesen. Eine neue Lektion ist also
   sofort da, sobald du den Ordner angelegt hast – ohne Neustart.
   Ordner, deren Name mit "_" oder "." beginnt (z. B. _vorlage), werden ignoriert.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { RENAMES } = require('./umzug');

const LESSON_DIR = process.env.LESSON_DIR || path.join(__dirname, '..', 'lessons');
const FILES = ['lektion.json', 'erklaerung.md', 'aufgabe.md', 'tests.js'];
const PAGE_FILE = 'seite.html';
const MAX_DEPTH = 2;

/**
 * Liest einen Ordner mit Dateien als { "main.js": "…", "lib/x.js": "…" }.
 * Reihenfolge der Reiter: Einstieg zuerst, dann wie in "dateien" (lektion.json), dann alphabetisch.
 */
function readFiles(dir, entry, order = []) {
  const files = {};
  const walk = (sub, depth) => {
    fs.readdirSync(path.join(dir, sub), { withFileTypes: true })
      .filter((d) => !d.name.startsWith('.'))
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((d) => {
        const rel = sub ? sub + '/' + d.name : d.name;
        if (d.isDirectory()) { if (depth < MAX_DEPTH) walk(rel, depth + 1); }
        else files[rel] = fs.readFileSync(path.join(dir, rel), 'utf8');
      });
  };
  walk('', 0);
  if (!Object.prototype.hasOwnProperty.call(files, entry)) throw new Error(`${path.basename(dir)}/ hat keine Startdatei ${entry}`);
  const sorted = {};
  [entry, ...order].forEach((name) => { if (Object.prototype.hasOwnProperty.call(files, name)) sorted[name] = files[name]; });
  return Object.assign(sorted, files);
}

/** Mehrere Dateien als ein Text (für den KI-Tutor). */
function joinFiles(files) {
  return Object.entries(files).map(([name, text]) => `// ===== Datei: ${name} =====\n${text}`).join('\n\n');
}

function read(dir, name) {
  return fs.readFileSync(path.join(dir, name), 'utf8');
}

/** Liest alle gültigen Lektionen (inkl. Musterlösung – nur serverintern verwenden!). */
function loadAll() {
  const lessons = [];
  const problems = [];
  let names = [];
  try {
    names = fs.readdirSync(LESSON_DIR, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('_') && !d.name.startsWith('.'))
      .map((d) => d.name)
      .sort();
  } catch (e) {
    problems.push('Lektionsordner nicht lesbar: ' + e.message);
  }

  names.forEach((name) => {
    const dir = path.join(LESSON_DIR, name);
    const has = (f) => fs.existsSync(path.join(dir, f));
    const missing = FILES.filter((f) => !has(f));
    if (!has('start.js') && !has('dateien')) missing.push('start.js oder dateien/');
    if (!has('loesung.js') && !has('loesung')) missing.push('loesung.js oder loesung/');
    if (missing.length) {
      problems.push(`Lektion „${name}“ übersprungen – es fehlen: ${missing.join(', ')}`);
      return;
    }
    try {
      const meta = JSON.parse(read(dir, 'lektion.json'));
      // Die Nummer kommt aus dem Ordnernamen („00-…“ wird Lektion 0), sonst wird hochgezählt.
      const number = Number.parseInt(name, 10);
      const entry = meta.einstieg || 'main.js';
      const order = Array.isArray(meta.dateien) ? meta.dateien : [];
      const starterFiles = has('dateien') ? readFiles(path.join(dir, 'dateien'), entry, order) : null;
      const solutionFiles = has('loesung') ? readFiles(path.join(dir, 'loesung'), entry, order) : null;
      if (!starterFiles !== !solutionFiles) throw new Error('dateien/ und loesung/ gehören zusammen');
      if (meta.laufzeit === 'node' && !starterFiles) throw new Error('Node.js-Lektionen brauchen dateien/ und loesung/');
      lessons.push({
        id: name,
        index: Number.isNaN(number) ? lessons.length + 1 : number,
        title: meta.titel || name,
        chapter: meta.kapitel || '',
        minutes: Number(meta.minuten) || 15,
        summary: meta.kurz || '',
        tip: meta.tipp || '',
        explanation: read(dir, 'erklaerung.md'),
        task: read(dir, 'aufgabe.md'),
        starterCode: starterFiles ? null : read(dir, 'start.js'),
        // Optional: mehrere Dateien als echte ES-Module (Datei-Reiter im Editor)
        starterFiles,
        entry: starterFiles ? entry : null,
        runtime: meta.laufzeit === 'node' ? 'node' : null,
        nodeArgs: Array.isArray(meta.argumente) ? meta.argumente.map(String) : [],
        nodeEnv: meta.umgebung && typeof meta.umgebung === 'object' ? meta.umgebung : {},
        testsSource: read(dir, 'tests.js'),
        solution: solutionFiles ? joinFiles(solutionFiles) : read(dir, 'loesung.js'),
        solutionFiles,
        // Optional: seite.html macht die Lektion zur Browser-Lektion mit echtem DOM (Vorschau-Reiter)
        page: fs.existsSync(path.join(dir, PAGE_FILE)) ? read(dir, PAGE_FILE) : null,
      });
    } catch (e) {
      problems.push(`Lektion „${name}“ übersprungen – ${e.message}`);
    }
  });
  return { lessons, problems };
}

/** Entfernt die Musterlösung – nur das darf in den Browser. */
function publicView(lesson) {
  const { solution, solutionFiles, ...rest } = lesson; // eslint-disable-line no-unused-vars
  return rest;
}

function list() {
  const { lessons, problems } = loadAll();
  return {
    lessons: lessons.map((l) => ({ id: l.id, index: l.index, chapter: l.chapter, title: l.title, minutes: l.minutes, summary: l.summary, browser: l.page !== null, node: l.runtime === 'node' })),
    problems,
    renames: RENAMES, // damit der Browser auch Gast-Fortschritt umschreiben kann
  };
}

function get(id) {
  return loadAll().lessons.find((l) => l.id === id) || null;
}

module.exports = { loadAll, list, get, publicView, joinFiles, LESSON_DIR };
