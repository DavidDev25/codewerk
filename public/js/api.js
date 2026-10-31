async function json(url, options) {
  const res = await fetch(url, options);
  if (!res.ok) {
    let msg = 'Serverfehler ' + res.status;
    try { msg = (await res.json()).error || msg; } catch (e) { }
    throw new Error(msg);
  }
  return res.json();
}

const put = (url, body, keepalive) => json(url, {
  method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), keepalive: !!keepalive,
});
const post = (url, body) => json(url, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body || {}),
});

const GUEST_KEY = 'cw-guest-progress';
const MAX_CODE = 200 * 1024;
const MAX_JOURNAL = 150;
const MAX_CHAT = 40;
const MAX_CHAT_TEXT = 6000;

const emptyDoc = () => ({ version: 1, lastLessonId: null, ui: {}, lessons: {}, journal: [] });

let renames = {};

function renameId(id) {
  return Object.prototype.hasOwnProperty.call(renames, id) ? renames[id] : id;
}

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

function migrate(doc) {
  for (const [oldId, entry] of Object.entries(doc.lessons)) {
    const newId = renameId(oldId);
    if (newId === oldId) continue;
    doc.lessons[newId] = combine(doc.lessons[newId], entry);
    delete doc.lessons[oldId];
  }
  if (typeof doc.lastLessonId === 'string') doc.lastLessonId = renameId(doc.lastLessonId);
  doc.journal.forEach((e) => { if (e && typeof e.lessonId === 'string') e.lessonId = renameId(e.lessonId); });
  return doc;
}

function readGuest() {
  try {
    const doc = JSON.parse(localStorage.getItem(GUEST_KEY));
    if (doc && typeof doc === 'object') {
      return migrate({ ...emptyDoc(), ...doc, lessons: doc.lessons || {}, ui: doc.ui || {}, journal: Array.isArray(doc.journal) ? doc.journal : [] });
    }
  } catch (e) { }
  return emptyDoc();
}

function updateGuest(fn) {
  const doc = readGuest();
  fn(doc);
  try { localStorage.setItem(GUEST_KEY, JSON.stringify(doc)); } catch (e) { return Promise.reject(new Error('Der Browser-Speicher ist voll.')); }
  return Promise.resolve({ ok: true });
}

function guestLesson(doc, id) {
  if (!doc.lessons[id]) doc.lessons[id] = { code: null, done: false, chat: [] };
  return doc.lessons[id];
}

function applyLesson(doc, id, patch) {
  const l = guestLesson(doc, id);
  const now = new Date().toISOString();
  if (typeof patch.code === 'string') l.code = patch.code.slice(0, MAX_CODE);
  if (patch.done === true && !l.done) { l.done = true; l.doneAt = now; }
  if (patch.lastRun && typeof patch.lastRun === 'object') {
    const r = patch.lastRun;
    l.lastRun = { passed: Number(r.passed) || 0, total: Number(r.total) || 0, error: r.error ? String(r.error).slice(0, 300) : null, at: now };
  }
  if (Array.isArray(patch.chat)) {
    l.chat = patch.chat.slice(-MAX_CHAT)
      .filter((m) => m && (m.role === 'user' || m.role === 'assistant'))
      .map((m) => ({ role: m.role, content: String(m.content || '').slice(0, MAX_CHAT_TEXT) }));
  }
  l.updatedAt = now;
  doc.lastLessonId = id;
}

function addJournal(doc, entry) {
  doc.journal.push({
    t: new Date().toISOString(),
    lessonId: String(entry.lessonId || '').slice(0, 80),
    type: String(entry.type || '').slice(0, 30),
    detail: String(entry.detail || '').slice(0, 200),
  });
  if (doc.journal.length > MAX_JOURNAL) doc.journal.splice(0, doc.journal.length - MAX_JOURNAL);
}

let guest = false;

export const api = {
  setGuest(on) { guest = !!on; },
  isGuest: () => guest,
  config: () => json('/api/config'),
  lessons: () => json('/api/lessons').then((info) => { renames = info.renames || {}; return info; }),
  lesson: (id) => json('/api/lessons/' + encodeURIComponent(id)),
  progress: () => (guest ? Promise.resolve(readGuest()) : json('/api/progress')),
  saveLesson: (id, patch, keepalive) => (guest
    ? updateGuest((doc) => applyLesson(doc, id, patch))
    : put('/api/progress/lessons/' + encodeURIComponent(id), patch, keepalive)),
  resetLesson: (id) => (guest
    ? updateGuest((doc) => { const l = guestLesson(doc, id); l.code = null; l.lastRun = null; l.updatedAt = new Date().toISOString(); })
    : post('/api/progress/lessons/' + encodeURIComponent(id) + '/reset')),
  saveUi: (ui) => (guest
    ? updateGuest((doc) => {
      if (['verstehen', 'aufgabe', 'tutor'].includes(ui.tab)) doc.ui.tab = ui.tab;
      if (['pruefung', 'ausgabe', 'diagramm', 'vorschau'].includes(ui.resultTab)) doc.ui.resultTab = ui.resultTab;
    })
    : put('/api/progress/ui', ui)),
  event: (lessonId, type, detail) => (guest
    ? updateGuest((doc) => { if (type === 'open') doc.lastLessonId = lessonId; addJournal(doc, { lessonId, type, detail }); })
    : post('/api/progress/event', { lessonId, type, detail })).catch(() => {}),
  guestProgress() {
    const doc = readGuest();
    return Object.keys(doc.lessons).length ? doc : null;
  },
  clearGuestProgress() { try { localStorage.removeItem(GUEST_KEY); } catch (e) { } },
  importGuestProgress: (doc) => post('/api/progress/import', doc),
  logout: () => post('/auth/logout'),
  deleteAccount: () => json('/api/me', { method: 'DELETE' }),
};
