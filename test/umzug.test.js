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

// Alle IDs, die jemals live waren (Stand 2f86977 und 56ddf34)
const LIVE_FRUEHER = [
  '00-so-funktioniert-codewerk', '01-variablen', '02-funktionen', '03-arrays', '04-schleifen', '05-objekte', '06-referenzen',
  '07-klassen', '08-zustand-methoden', '09-kapselung-private', '10-getter-setter', '11-vererbung', '12-super', '13-polymorphie',
  '14-komposition', '15-abschlussprojekt', '16-fehlerbehandlung', '17-array-methoden', '18-callbacks-timer', '19-promises',
  '20-async-await', '21-minishop',
  '02-datentypen-operatoren', '03-funktionen', '04-bedingungen', '05-strings', '06-zahlen-math', '07-arrow-funktionen',
  '08-arrays', '09-schleifen', '10-objekte', '11-referenzen', '12-destructuring-spread', '13-optional-chaining',
  '14-scope-closures', '15-array-methoden', '16-mehr-array-methoden', '17-objekte-durchlaufen', '18-json', '19-map-set',
  '20-rekursion', '21-abschluss-grundlagen', '22-this-methoden', '23-klassen', '24-zustand-methoden', '25-kapselung-private',
  '26-getter-setter', '27-vererbung', '28-super', '29-polymorphie', '30-komposition', '31-prototypen', '32-abschlussprojekt',
  '33-fehlerbehandlung', '34-callbacks-timer', '35-promises', '36-async-await', '37-fetch-apis', '38-minishop', '39-module',
  '40-iteratoren-generatoren', '41-regex', '42-datum-intl', '43-abschluss-logbuch', '44-dom', '45-elemente-erzeugen',
  '46-events', '47-formulare', '48-localstorage', '49-abschluss-todo',
];

test('Jede jemals live gewesene ID führt zu einer existierenden Lektion', () => {
  const ids = new Set(lessons.list().lessons.map((l) => l.id));
  for (const id of LIVE_FRUEHER) {
    const ziel = Object.prototype.hasOwnProperty.call(RENAMES, id) ? RENAMES[id] : id;
    assert.ok(ids.has(ziel), `${id} -> ${ziel} gibt es nicht`);
  }
});

test('Fortschritt unter alten IDs landet bei den neuen', () => {
  const doc = progress.normalize({
    lastLessonId: '07-klassen',
    lessons: {
      '07-klassen': { code: 'class A {}', done: true },
      '01-variablen': { code: 'let x = 1;', done: true },
      '17-array-methoden': { code: 'map', done: true },
    },
    journal: [{ t: 'x', lessonId: '03-arrays', type: 'open', detail: '' }],
  });
  assert.equal(doc.lastLessonId, '28-klassen');
  assert.deepEqual(Object.keys(doc.lessons).sort(), ['01-variablen', '17-array-methoden-map-filter', '28-klassen']);
  assert.equal(doc.lessons['28-klassen'].code, 'class A {}');
  assert.equal(doc.journal[0].lessonId, '09-arrays');
});

test('Treffen zwei alte IDs dieselbe Lektion, gewinnt der neuere Stand, „geschafft“ bleibt', () => {
  const doc = migrate({
    lastLessonId: null,
    lessons: {
      '03-arrays': { code: 'ganz alt', done: true, doneAt: '2026-10-29', updatedAt: '2026-10-29T10:00:00Z' },
      '08-arrays': { code: 'neuer', done: false, updatedAt: '2026-10-30T10:00:00Z' },
    },
    journal: [],
  });
  assert.deepEqual(Object.keys(doc.lessons), ['09-arrays']);
  assert.equal(doc.lessons['09-arrays'].code, 'neuer');
  assert.equal(doc.lessons['09-arrays'].done, true);
  const again = JSON.parse(JSON.stringify(doc));
  migrate(again);
  assert.deepEqual(again, doc);
});

test('Die Lektionsliste liefert Kapitel und Umzugstabelle für den Browser', () => {
  const info = lessons.list();
  assert.equal(info.renames['02-funktionen'], '03-funktionen');
  assert.equal(info.renames['15-array-methoden'], '17-array-methoden-map-filter');
  assert.ok(info.lessons.every((l) => 'chapter' in l));
});
