'use strict';
// Prüft den Umzug alter Lektions-IDs (Neuordnung in Kapitel, 2026-10-31):
// Fortschritt unter alten IDs muss bei den neuen Lektionen ankommen.
const test = require('node:test');
const assert = require('node:assert/strict');
const lessons = require('../server/lessons');
const progress = require('../server/progress');
const { RENAMES, migrate } = require('../server/umzug');

test('Keine neue ID ist zugleich eine alte ID (Umzug darf mehrfach laufen)', () => {
  const oldIds = new Set(Object.keys(RENAMES));
  for (const newId of Object.values(RENAMES)) assert.ok(!oldIds.has(newId), newId);
});

test('Jede neue ID gibt es als Lektion, keine alte mehr', () => {
  const ids = new Set(lessons.list().lessons.map((l) => l.id));
  for (const [oldId, newId] of Object.entries(RENAMES)) {
    assert.ok(ids.has(newId), `Lektion ${newId} fehlt`);
    assert.ok(!ids.has(oldId), `alter Ordner ${oldId} existiert noch`);
  }
});

test('Jede Lektion hat ein Kapitel, Kapitel stehen am Stück', () => {
  const list = lessons.list().lessons;
  const seen = [];
  list.forEach((l) => {
    assert.ok(l.chapter, `${l.id} hat kein Kapitel`);
    if (seen[seen.length - 1] !== l.chapter) {
      assert.ok(!seen.includes(l.chapter), `Kapitel „${l.chapter}“ ist zerrissen (bei ${l.id})`);
      seen.push(l.chapter);
    }
  });
});

test('Fortschritt unter alten IDs landet bei den neuen', () => {
  const doc = progress.normalize({
    lastLessonId: '07-klassen',
    lessons: {
      '07-klassen': { code: 'class A {}', done: true },
      '01-variablen': { code: 'let x = 1;', done: true },
    },
    journal: [{ t: 'x', lessonId: '03-arrays', type: 'open', detail: '' }],
  });
  assert.equal(doc.lastLessonId, '23-klassen');
  assert.deepEqual(Object.keys(doc.lessons).sort(), ['01-variablen', '23-klassen']);
  assert.equal(doc.lessons['23-klassen'].code, 'class A {}');
  assert.equal(doc.journal[0].lessonId, '08-arrays');
});

test('Ein Eintrag unter der neuen ID wird nicht überschrieben, zweiter Lauf ändert nichts', () => {
  const doc = migrate({
    lastLessonId: null,
    lessons: { '03-arrays': { code: 'alt' }, '08-arrays': { code: 'neu' } },
    journal: [],
  });
  assert.deepEqual(doc.lessons, { '08-arrays': { code: 'neu' } });
  const again = JSON.parse(JSON.stringify(doc));
  migrate(again);
  assert.deepEqual(again, doc);
});

test('Die Lektionsliste liefert Kapitel und Umzugstabelle für den Browser', () => {
  const info = lessons.list();
  assert.equal(info.renames['02-funktionen'], '03-funktionen');
  assert.ok(info.lessons.every((l) => 'chapter' in l));
});
