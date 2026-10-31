'use strict';
/* ==========================================================================
   progress.js – Regeln für den Fortschritt einer lernenden Person.

   Ein Fortschritts-Dokument sieht so aus:
   {
     version: 1,
     lastLessonId: "03-objekte",
     ui: { tab: "aufgabe", resultTab: "pruefung" },
     lessons: {
       "03-objekte": { code, done, doneAt, lastRun: {passed,total,error,at}, chat: [...], updatedAt }
     },
     journal: [ { t: "2025-01-01T10:00:00Z", lessonId, type, detail } ]   // für „Wo war ich?“
   }

   Alle Funktionen hier verändern nur das übergebene Dokument. Wo es
   gespeichert wird (Datei im persönlichen Modus, Datenbank bei Konten),
   entscheiden storage.js und db.js. So gelten überall dieselben Grenzen.
   ========================================================================== */

const umzug = require('./umzug');

const MAX_CODE = 200 * 1024;   // 200 KB Code pro Lektion
const MAX_JOURNAL = 150;
const MAX_CHAT = 40;           // Nachrichten pro Lektion
const MAX_CHAT_TEXT = 6000;
const MAX_LESSON_ID = 80;

function empty() {
  return { version: 1, lastLessonId: null, ui: {}, lessons: {}, journal: [] };
}

/** Füllt fehlende Teile eines gelesenen Dokuments auf. */
function normalize(doc) {
  const d = Object.assign(empty(), doc && typeof doc === 'object' ? doc : {});
  if (!d.lessons || typeof d.lessons !== 'object') d.lessons = {};
  if (!d.ui || typeof d.ui !== 'object') d.ui = {};
  if (!Array.isArray(d.journal)) d.journal = [];
  return umzug.migrate(d);
}

function lesson(doc, id) {
  if (!doc.lessons[id]) doc.lessons[id] = { code: null, done: false, chat: [] };
  return doc.lessons[id];
}

/** Teil-Update einer Lektion (nur bekannte Felder, mit Größenlimits). */
function updateLesson(doc, id, patch) {
  const l = lesson(doc, id);
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
  doc.lastLessonId = id;
}

function resetLesson(doc, id) {
  const l = lesson(doc, id);
  l.code = null;
  l.lastRun = null;
  l.updatedAt = new Date().toISOString();
}

function setUi(doc, ui) {
  const allowedTabs = ['verstehen', 'aufgabe', 'tutor'];
  const allowedResults = ['pruefung', 'ausgabe', 'diagramm', 'vorschau'];
  if (ui && allowedTabs.includes(ui.tab)) doc.ui.tab = ui.tab;
  if (ui && allowedResults.includes(ui.resultTab)) doc.ui.resultTab = ui.resultTab;
}

function setLast(doc, id) {
  doc.lastLessonId = String(id || '').slice(0, MAX_LESSON_ID) || null;
}

function addJournal(doc, entry) {
  doc.journal.push({
    t: new Date().toISOString(),
    lessonId: String(entry.lessonId || '').slice(0, MAX_LESSON_ID),
    type: String(entry.type || '').slice(0, 30),
    detail: String(entry.detail || '').slice(0, 200),
  });
  if (doc.journal.length > MAX_JOURNAL) doc.journal.splice(0, doc.journal.length - MAX_JOURNAL);
}

/**
 * Übernimmt den Fortschritt, den jemand als Gast im Browser gesammelt hat.
 * Vorhandener Fortschritt im Konto hat Vorrang: Code wird nur übernommen, wo im
 * Konto noch keiner steht; „geschafft“ bleibt geschafft. Alle Werte laufen durch
 * dieselben Grenzen wie normale Speicherungen.
 * @param isKnownLesson  (id) => boolean, damit keine erfundenen Lektionen landen
 */
function importGuest(doc, guest, isKnownLesson) {
  const g = normalize(guest);
  const lastBefore = doc.lastLessonId; // updateLesson setzt lastLessonId bei jedem Aufruf um
  let count = 0;
  for (const [id, gl] of Object.entries(g.lessons)) {
    if (!isKnownLesson(id) || !gl || typeof gl !== 'object') continue;
    const existing = doc.lessons[id];
    const patch = {};
    if (typeof gl.code === 'string' && !(existing && existing.code)) patch.code = gl.code;
    if (gl.done === true) patch.done = true;
    if (gl.lastRun && !(existing && existing.lastRun)) patch.lastRun = gl.lastRun;
    if (Array.isArray(gl.chat) && gl.chat.length && !(existing && existing.chat && existing.chat.length)) patch.chat = gl.chat;
    if (Object.keys(patch).length) {
      updateLesson(doc, id, patch);
      count++;
    }
  }
  doc.lastLessonId = lastBefore || (g.lastLessonId && isKnownLesson(g.lastLessonId) ? g.lastLessonId : doc.lastLessonId);
  setUi(doc, g.ui);
  g.journal.slice(-MAX_JOURNAL).forEach((e) => addJournal(doc, e));
  return count;
}

module.exports = { empty, normalize, updateLesson, resetLesson, setUi, setLast, addJournal, importGuest };
