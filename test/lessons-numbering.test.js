'use strict';
// Die angezeigte Lektionsnummer kommt aus dem Ordnerpräfix („00-…“ → 0).
// Eigener Testordner, weil LESSON_DIR beim Laden von lessons.js gelesen wird.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const os = require('os');
const path = require('path');

const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'codewerk-lessons-'));
const FILES = { 'lektion.json': '{"titel":"T","minuten":5,"kurz":"k","tipp":"t"}', 'erklaerung.md': '# E', 'aufgabe.md': '# A', 'start.js': '', 'tests.js': '', 'loesung.js': '' };
function lesson(name, files = FILES) {
  fs.mkdirSync(path.join(dir, name));
  for (const [file, body] of Object.entries(files)) fs.writeFileSync(path.join(dir, name, file), body);
}
lesson('00-start');
lesson('05-sprung');
lesson('ohne-zahl');
lesson('_vorlage');
lesson('07-unvollstaendig', { 'lektion.json': FILES['lektion.json'] });

process.env.LESSON_DIR = dir;
const lessons = require('../server/lessons');
test.after(() => fs.rmSync(dir, { recursive: true, force: true }));

test('Nummer kommt aus dem Präfix, Ordner ohne Zahl werden weitergezählt', () => {
  const { lessons: list } = lessons.list();
  assert.deepEqual(list.map((l) => [l.id, l.index]), [['00-start', 0], ['05-sprung', 5], ['ohne-zahl', 3]]);
});

test('Ordner mit _ werden ignoriert, unvollständige gemeldet', () => {
  const { lessons: list, problems } = lessons.list();
  assert.ok(!list.some((l) => l.id === '_vorlage'));
  assert.equal(problems.length, 1);
  assert.match(problems[0], /07-unvollstaendig/);
});
