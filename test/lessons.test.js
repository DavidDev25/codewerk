'use strict';
// Prüft die echten Lektionen in lessons/: Reihenfolge, Nummern und dass die
// Musterlösung nie in der Browser-Fassung landet.
const test = require('node:test');
const assert = require('node:assert/strict');
const lessons = require('../server/lessons');

test('Lektion 0 steht vorne und hat die Nummer 0', () => {
  const { lessons: list } = lessons.list();
  assert.equal(list[0].id, '00-so-funktioniert-codewerk');
  assert.equal(list[0].index, 0);
});

test('Lektionsnummern sind lückenlos 0, 1, 2, …', () => {
  const { lessons: list } = lessons.list();
  assert.deepEqual(list.map((l) => l.index), list.map((_, i) => i));
});

test('Keine übersprungenen Lektionen und keine Vorlage in der Liste', () => {
  const { lessons: list, problems } = lessons.list();
  assert.deepEqual(problems, []);
  assert.ok(!list.some((l) => l.id.startsWith('_')));
  assert.equal(new Set(list.map((l) => l.id)).size, list.length);
});

test('Die Browser-Fassung einer Lektion enthält keine Musterlösung', () => {
  const lesson = lessons.get('00-so-funktioniert-codewerk');
  assert.ok(lesson.solution, 'serverintern ist die Lösung vorhanden');
  const view = lessons.publicView(lesson);
  assert.equal('solution' in view, false);
  assert.ok(view.starterCode && view.testsSource && view.explanation);
});

test('Mehrdatei-Lektion: Startdateien in Reiter-Reihenfolge, Lösungsdateien bleiben auf dem Server', () => {
  const lesson = lessons.get('48-module');
  assert.equal(lesson.entry, 'main.js');
  assert.deepEqual(Object.keys(lesson.starterFiles), ['main.js', 'rechner.js', 'format.js']);
  assert.equal(lesson.starterCode, null);
  assert.match(lesson.solution, /\/\/ ===== Datei: rechner\.js =====/);
  const view = lessons.publicView(lesson);
  assert.equal('solution' in view, false);
  assert.equal('solutionFiles' in view, false);
});
