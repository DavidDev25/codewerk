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

   Die Ordner werden bei JEDER Anfrage neu gelesen. Eine neue Lektion ist also
   sofort da, sobald du den Ordner angelegt hast – ohne Neustart.
   Ordner, deren Name mit "_" oder "." beginnt (z. B. _vorlage), werden ignoriert.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const { RENAMES } = require('./umzug');

const LESSON_DIR = process.env.LESSON_DIR || path.join(__dirname, '..', 'lessons');
const FILES = ['lektion.json', 'erklaerung.md', 'aufgabe.md', 'start.js', 'tests.js', 'loesung.js'];
const PAGE_FILE = 'seite.html';

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
    const missing = FILES.filter((f) => !fs.existsSync(path.join(dir, f)));
    if (missing.length) {
      problems.push(`Lektion „${name}“ übersprungen – es fehlen: ${missing.join(', ')}`);
      return;
    }
    try {
      const meta = JSON.parse(read(dir, 'lektion.json'));
      // Die Nummer kommt aus dem Ordnernamen („00-…“ wird Lektion 0), sonst wird hochgezählt.
      const number = Number.parseInt(name, 10);
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
        starterCode: read(dir, 'start.js'),
        testsSource: read(dir, 'tests.js'),
        solution: read(dir, 'loesung.js'),
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
  const { solution, ...rest } = lesson; // eslint-disable-line no-unused-vars
  return rest;
}

function list() {
  const { lessons, problems } = loadAll();
  return {
    lessons: lessons.map((l) => ({ id: l.id, index: l.index, chapter: l.chapter, title: l.title, minutes: l.minutes, summary: l.summary, browser: l.page !== null })),
    problems,
    renames: RENAMES, // damit der Browser auch Gast-Fortschritt umschreiben kann
  };
}

function get(id) {
  return loadAll().lessons.find((l) => l.id === id) || null;
}

module.exports = { loadAll, list, get, publicView, LESSON_DIR };
