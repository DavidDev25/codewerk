'use strict';
/* ==========================================================================
   umzug.js – alte Lektions-IDs auf neue umschreiben.

   Die Lektions-ID ist der Ordnername. Als der Lehrplan 2026-10-31 in Kapitel
   umsortiert wurde, haben viele Lektionen eine neue Nummer bekommen. Damit
   gespeicherter Fortschritt (Code, „geschafft“, Chat) nicht verloren geht,
   schreibt migrate() beim Lesen jedes Fortschritts-Dokuments die alten IDs um.

   Regeln, damit das beliebig oft laufen darf:
   - Keine neue ID darf zugleich eine alte ID sein (prüft test/umzug.test.js).
   - Steht eine Lektion schon unter der neuen ID, gewinnt der neue Eintrag.
   ========================================================================== */

const RENAMES = {
  '02-funktionen': '03-funktionen',
  '03-arrays': '08-arrays',
  '04-schleifen': '09-schleifen',
  '05-objekte': '10-objekte',
  '06-referenzen': '11-referenzen',
  '17-array-methoden': '15-array-methoden',
  '07-klassen': '23-klassen',
  '08-zustand-methoden': '24-zustand-methoden',
  '09-kapselung-private': '25-kapselung-private',
  '10-getter-setter': '26-getter-setter',
  '11-vererbung': '27-vererbung',
  '12-super': '28-super',
  '13-polymorphie': '29-polymorphie',
  '14-komposition': '30-komposition',
  '15-abschlussprojekt': '32-abschlussprojekt',
  '16-fehlerbehandlung': '33-fehlerbehandlung',
  '18-callbacks-timer': '34-callbacks-timer',
  '19-promises': '35-promises',
  '20-async-await': '36-async-await',
  '21-minishop': '38-minishop',
};

const rename = (id) => (Object.prototype.hasOwnProperty.call(RENAMES, id) ? RENAMES[id] : id);

/** Schreibt alte IDs in einem Fortschritts-Dokument um (verändert doc direkt). */
function migrate(doc, renames = RENAMES) {
  const to = (id) => (Object.prototype.hasOwnProperty.call(renames, id) ? renames[id] : id);
  if (doc.lessons && typeof doc.lessons === 'object') {
    for (const [oldId, entry] of Object.entries(doc.lessons)) {
      const newId = to(oldId);
      if (newId === oldId) continue;
      if (!doc.lessons[newId]) doc.lessons[newId] = entry;
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
