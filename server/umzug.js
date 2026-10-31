'use strict';
/* ==========================================================================
   umzug.js – alte Lektions-IDs auf neue umschreiben.

   Die Lektions-ID ist der Ordnername. Der Lehrplan wurde 2026-10-31 zweimal umsortiert (Kapitel, dann Profiwissen
   an der fachlich passenden Stelle). Jede jemals benutzte ID zeigt hier DIREKT
   auf die heutige ID, ohne Ketten über Zwischenstände. Damit
   gespeicherter Fortschritt (Code, „geschafft“, Chat) nicht verloren geht,
   schreibt migrate() beim Lesen jedes Fortschritts-Dokuments die alten IDs um.

   Regeln, damit das beliebig oft laufen darf:
   - Keine neue ID darf zugleich eine alte ID sein (prüft test/umzug.test.js).
   - Steht eine Lektion schon unter der neuen ID, gewinnt der neue Eintrag.
   ========================================================================== */

const RENAMES = {
  '02-funktionen': '03-funktionen',
  '07-arrow-funktionen': '08-arrow-funktionen',
  '03-arrays': '09-arrays',
  '08-arrays': '09-arrays',
  '04-schleifen': '10-schleifen',
  '09-schleifen': '10-schleifen',
  '05-objekte': '11-objekte',
  '10-objekte': '11-objekte',
  '06-referenzen': '12-referenzen',
  '11-referenzen': '12-referenzen',
  '12-destructuring-spread': '13-destructuring-spread',
  '13-optional-chaining': '15-optional-chaining',
  '14-scope-closures': '16-scope-closures',
  '17-array-methoden': '17-array-methoden-map-filter',
  '15-array-methoden': '17-array-methoden-map-filter',
  '16-mehr-array-methoden': '18-mehr-array-methoden',
  '17-objekte-durchlaufen': '20-objekte-durchlaufen',
  '18-json': '21-json',
  '19-map-set': '22-map-set',
  '20-rekursion': '24-rekursion',
  '21-abschluss-grundlagen': '26-abschluss-grundlagen',
  '22-this-methoden': '27-this-methoden',
  '07-klassen': '28-klassen',
  '23-klassen': '28-klassen',
  '08-zustand-methoden': '29-zustand-methoden',
  '24-zustand-methoden': '29-zustand-methoden',
  '09-kapselung-private': '30-kapselung-private',
  '25-kapselung-private': '30-kapselung-private',
  '10-getter-setter': '31-getter-setter',
  '26-getter-setter': '31-getter-setter',
  '11-vererbung': '32-vererbung',
  '27-vererbung': '32-vererbung',
  '12-super': '33-super',
  '28-super': '33-super',
  '13-polymorphie': '34-polymorphie',
  '29-polymorphie': '34-polymorphie',
  '14-komposition': '35-komposition',
  '30-komposition': '35-komposition',
  '31-prototypen': '36-prototypen',
  '15-abschlussprojekt': '38-abschlussprojekt',
  '32-abschlussprojekt': '38-abschlussprojekt',
  '16-fehlerbehandlung': '39-fehlerbehandlung',
  '33-fehlerbehandlung': '39-fehlerbehandlung',
  '18-callbacks-timer': '41-callbacks-timer',
  '34-callbacks-timer': '41-callbacks-timer',
  '19-promises': '42-promises',
  '35-promises': '42-promises',
  '20-async-await': '44-async-await',
  '36-async-await': '44-async-await',
  '37-fetch-apis': '45-fetch-apis',
  '21-minishop': '47-minishop',
  '38-minishop': '47-minishop',
  '39-module': '48-module',
  '40-iteratoren-generatoren': '49-iteratoren-generatoren',
  '41-regex': '51-regex',
  '42-datum-intl': '52-datum-intl',
  '43-abschluss-logbuch': '55-abschluss-logbuch',
  '44-dom': '59-dom',
  '45-elemente-erzeugen': '60-elemente-erzeugen',
  '46-events': '61-events',
  '47-formulare': '64-formulare',
  '48-localstorage': '65-localstorage',
  '49-abschluss-todo': '67-abschluss-todo',
};

const rename = (id) => (Object.prototype.hasOwnProperty.call(RENAMES, id) ? RENAMES[id] : id);

/**
 * Zwei Einträge landen auf derselben Lektion (z. B. eine ganz alte und eine neuere ID):
 * Der zuletzt bearbeitete gewinnt, „geschafft“ bleibt erhalten, wenn einer es war.
 */
function combine(a, b) {
  if (!a || typeof a !== 'object') return b;
  if (!b || typeof b !== 'object') return a;
  const newer = String(b.updatedAt || '') > String(a.updatedAt || '') ? b : a;
  const older = newer === a ? b : a;
  const out = { ...newer };
  if (older.done && !newer.done) {
    out.done = true;
    out.doneAt = older.doneAt;
  }
  return out;
}

/** Schreibt alte IDs in einem Fortschritts-Dokument um (verändert doc direkt). */
function migrate(doc, renames = RENAMES) {
  const to = (id) => (Object.prototype.hasOwnProperty.call(renames, id) ? renames[id] : id);
  if (doc.lessons && typeof doc.lessons === 'object') {
    for (const [oldId, entry] of Object.entries(doc.lessons)) {
      const newId = to(oldId);
      if (newId === oldId) continue;
      doc.lessons[newId] = combine(doc.lessons[newId], entry);
      delete doc.lessons[oldId];
    }
  }
  if (typeof doc.lastLessonId === 'string') doc.lastLessonId = to(doc.lastLessonId);
  if (Array.isArray(doc.journal)) {
    doc.journal.forEach((e) => { if (e && typeof e.lessonId === 'string') e.lessonId = to(e.lessonId); });
  }
  return doc;
}

module.exports = { RENAMES, rename, migrate };
