import { api } from './api.js';
import { renderMarkdown, inline, escapeHtml } from './markdown.js';
import { loadMonaco, createEditor } from './editor.js';
import { runCode, runInPage, clearPreview, TIMEOUT_SECONDS } from './runner.js';
import { createDiagram } from './diagram.js';
import { createTutor } from './tutor-chat.js';
import { createTour, tourSeen } from './tour.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const FONT_SIZES = { m: 15, l: 17, xl: 19 };

const state = {
  config: null,
  lessons: [],
  lesson: null,
  progress: null,
  monaco: null,
  editor: null,
  leftTab: 'verstehen',
  resultTab: 'pruefung',
  last: null,
  running: false,
  dirty: false,
  saveTimer: null,
  uiTimer: null,
  lastEditEvent: {},
  pageStorage: new Map(),
};

const isPageLesson = () => !!(state.lesson && typeof state.lesson.page === 'string');

const PREVIEW_EMPTY = '<div class="empty"><p>Hier erscheint deine Seite.</p><p class="muted">Drücke <strong>Ausführen</strong>. Danach kannst du die Seite hier auch anklicken und ausprobieren.</p></div>';

let diagram;
let tutor;

const lessonProgress = (id) => (state.progress.lessons[id] ||= { code: null, done: false, chat: [] });
const doneCount = () => state.lessons.filter((l) => state.progress.lessons[l.id] && state.progress.lessons[l.id].done).length;

function setSaveState(kind) {
  const el = $('#save-state');
  el.textContent = { saved: 'Gespeichert', dirty: 'Ungespeichert …', saving: 'Speichert …', error: 'Nicht gespeichert – Server nicht erreichbar' }[kind];
  el.classList.toggle('is-error', kind === 'error');
}

function showFatal(message) {
  document.body.innerHTML = '<main class="fatal"><h1>Codewerk startet nicht</h1><p>' + escapeHtml(message) +
    '</p><p class="muted">Lade die Seite neu. Läuft der Server noch? (<code>docker compose logs</code>)</p></main>';
}

function applyTheme(pref) {
  const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const root = document.documentElement;
  root.dataset.pref = pref;
  root.dataset.theme = pref === 'auto' ? (dark ? 'dark' : 'light') : pref;
  try { localStorage.setItem('cw-theme', pref); } catch (e) { }
  if (state.monaco) state.monaco.editor.setTheme(root.dataset.theme === 'dark' ? 'cw-dark' : 'cw-light');
}

function applySize(size) {
  document.documentElement.dataset.size = size;
  try { localStorage.setItem('cw-size', size); } catch (e) { }
  if (state.editor) {
    const fs = FONT_SIZES[size];
    state.editor.updateOptions({ fontSize: fs, lineHeight: Math.round(fs * 1.65) });
  }
}

function setLeftTab(tab, persist = true) {
  state.leftTab = tab;
  $$('[data-tab]').forEach((b) => {
    const on = b.dataset.tab === tab;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  $$('.pane-left .tab-panel').forEach((p) => { p.hidden = p.id !== 'tab-' + tab; });
  if (persist) scheduleUiSave();
}

function setResultTab(tab, persist = true) {
  if (tab === 'vorschau' && !isPageLesson()) tab = 'pruefung';
  state.resultTab = tab;
  $$('[data-rtab]').forEach((b) => {
    const on = b.dataset.rtab === tab;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
  $$('.rtab-panel').forEach((p) => { p.hidden = p.id !== 'rtab-' + tab; });
  if (tab === 'diagramm') requestAnimationFrame(() => diagram.refresh());
  if (persist) scheduleUiSave();
}

const MOBILE = window.matchMedia('(max-width: 999px)');

function setView(view) {
  document.body.dataset.view = view;
  $$('.mn-btn').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.view === view)));
  if (view === 'ergebnis' && state.resultTab === 'diagramm') requestAnimationFrame(() => diagram.refresh());
  if (view === 'code' && state.editor) requestAnimationFrame(() => state.editor.layout());
}

function scheduleUiSave() {
  clearTimeout(state.uiTimer);
  state.uiTimer = setTimeout(() => api.saveUi({ tab: state.leftTab, resultTab: state.resultTab }).catch(() => {}), 600);
}

function wireTabKeys(selector, attr, setter) {
  $$(selector).forEach((btn) => {
    btn.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const all = $$(selector, btn.parentElement).filter((b) => !b.hidden);
      const next = all[(all.indexOf(btn) + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
      setter(next.dataset[attr]);
      next.focus();
    });
  });
}

function renderProgress() {
  const total = state.lessons.length;
  const done = doneCount();
  $('#progress-fill').style.width = total ? (done / total) * 100 + '%' : '0';
  $('#progress-track').setAttribute('aria-valuenow', String(total ? Math.round((done / total) * 100) : 0));
  $('#progress-text').textContent = `${done} von ${total} geschafft`;
}

function lessonItem(l) {
  const done = state.progress.lessons[l.id] && state.progress.lessons[l.id].done;
  const current = state.lesson && state.lesson.id === l.id;
  return `<li><button type="button" class="lesson-item${current ? ' is-current' : ''}" data-id="${escapeHtml(l.id)}"${current ? ' aria-current="true"' : ''}>` +
    `<span class="lesson-status" aria-hidden="true">${done ? '✓' : current ? '●' : ''}</span>` +
    `<span class="lesson-text"><span class="lesson-name">${l.index}. ${escapeHtml(l.title)}</span>` +
    `<span class="lesson-meta">${escapeHtml(l.summary)} · ca. ${l.minutes} Min.${done ? ' · geschafft' : ''}</span></span></button></li>`;
}

function chapterGroups() {
  const groups = [];
  state.lessons.forEach((l) => {
    const last = groups[groups.length - 1];
    if (last && last.chapter === l.chapter) last.lessons.push(l);
    else groups.push({ chapter: l.chapter, lessons: [l] });
  });
  return groups;
}

function renderLessonList() {
  const list = $('#lesson-list');
  const groups = chapterGroups();
  if (groups.length === 1 && !groups[0].chapter) {
    list.innerHTML = state.lessons.map(lessonItem).join('');
    return;
  }
  list.innerHTML = groups.map((g) => {
    const done = g.lessons.filter((l) => state.progress.lessons[l.id] && state.progress.lessons[l.id].done).length;
    return `<li class="chapter"><h3 class="chapter-title">${escapeHtml(g.chapter || 'Weitere Lektionen')}` +
      `<span class="chapter-count">${done} von ${g.lessons.length}</span></h3>` +
      `<ol class="lesson-list chapter-list">${g.lessons.map(lessonItem).join('')}</ol></li>`;
  }).join('');
}

function renderLessonTexts() {
  const l = state.lesson;
  $('#lesson-title').textContent = l.title;
  $('#lesson-counter').textContent = `Lektion ${l.index} von ${state.lessons[state.lessons.length - 1].index} · ca. ${l.minutes} Min.`;
  document.title = `${l.index}. ${l.title} – Codewerk`;
  $('#tab-verstehen').innerHTML = '<h2 class="sr-only">Erklärung</h2>' + renderMarkdown(l.explanation, { runnable: true }) +
    '<div class="next-hint"><button class="btn primary" type="button" data-goto="aufgabe">Weiter zur Aufgabe</button></div>';
  $('#task-text').innerHTML = '<h2 class="sr-only">Aufgabe</h2>' + renderMarkdown(l.task);
  $('#tip-text').innerHTML = '<div class="callout-title">Tipp</div>' + renderMarkdown(l.tip || 'Für diese Lektion gibt es keinen Tipp.');
  $('#tip-text').hidden = true;
  $('#btn-tip').textContent = 'Tipp anzeigen';
  $('#btn-tip').setAttribute('aria-expanded', 'false');
}

async function openLesson(id, { initial = false, preloaded = null } = {}) {
  await flushSave();
  let lesson;
  try { lesson = preloaded && preloaded.id === id ? preloaded : await api.lesson(id); } catch (e) { showFatal('Lektion konnte nicht geladen werden: ' + e.message); return; }
  state.lesson = lesson;
  state.last = null;
  const saved = state.progress.lessons[id];
  const hasCode = !!(saved && typeof saved.code === 'string');

  renderLessonTexts();
  renderLessonList();
  $('#rtabbtn-vorschau').hidden = !isPageLesson();
  clearPreview($('#preview-host'));
  $('#preview-host').innerHTML = PREVIEW_EMPTY;

  setEditorContent(hasCode ? saved.code : null);
  clearMarkers();
  tutor.setMessages(saved ? saved.chat : []);

  const ui = state.progress.ui || {};
  if (initial && ui.tab) setLeftTab(ui.tab, false);
  else setLeftTab(hasCode ? 'aufgabe' : 'verstehen', false);
  setResultTab(initial && ui.resultTab ? ui.resultTab : 'pruefung', false);
  $('#tab-verstehen').scrollTop = 0;
  $('.pane-body').scrollTop = 0;

  state.progress.lastLessonId = id;
  if (!initial) api.event(id, 'open', `Lektion ${lesson.index} „${lesson.title}“ geöffnet`);

  if (hasCode) await run({ auto: true });
  else { renderResults(null); }
}

const isMultiFile = () => !!(state.lesson && state.lesson.starterFiles);
const nodeJob = () => (state.lesson && state.lesson.runtime === 'node' ? { args: state.lesson.nodeArgs || [], env: state.lesson.nodeEnv || {} } : undefined);
const LANGUAGES = { js: 'javascript', mjs: 'javascript', cjs: 'javascript', json: 'json', md: 'markdown', html: 'html', css: 'css' };
const languageOf = (name) => LANGUAGES[name.split('.').pop()] || 'plaintext';

function savedFiles(code) {
  try {
    const data = JSON.parse(code);
    if (data && data.dateien && typeof data.dateien === 'object') return data.dateien;
  } catch (e) { }
  return null;
}

function currentFiles() {
  return Object.fromEntries([...state.files.models].map(([name, model]) => [name, model.getValue()]));
}

function currentCode() {
  return state.files ? JSON.stringify({ dateien: currentFiles() }) : state.editor.getValue();
}

function readableCode() {
  if (!state.files) return state.editor.getValue();
  return Object.entries(currentFiles()).map(([name, text]) => `// ===== Datei: ${name} =====\n${text}`).join('\n\n');
}

function renderFileTabs() {
  const bar = $('#file-tabs');
  bar.hidden = !state.files;
  $('#editor-file').hidden = !!state.files;
  $('#runtime-badge').hidden = !nodeJob();
  if (!state.files) { bar.replaceChildren(); return; }
  bar.replaceChildren(...[...state.files.models.keys()].map((name) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'tab';
    b.setAttribute('role', 'tab');
    b.setAttribute('aria-controls', 'editor');
    b.dataset.file = name;
    b.textContent = name;
    if (name === state.lesson.entry) {
      b.classList.add('is-entry');
      b.title = 'Startdatei: Hier beginnt das Programm';
    }
    const mark = document.createElement('span');
    mark.className = 'sr-only file-error-label';
    mark.textContent = ' (Fehler)';
    b.append(mark);
    return b;
  }));
  showFile(state.files.active);
}

function showFile(name) {
  if (!state.files || !state.files.models.has(name)) return;
  state.files.active = name;
  if (state.editor.getModel() !== state.files.models.get(name)) state.editor.setModel(state.files.models.get(name));
  $$('#file-tabs [data-file]').forEach((b) => {
    const on = b.dataset.file === name;
    b.setAttribute('aria-selected', String(on));
    b.tabIndex = on ? 0 : -1;
  });
}

function setEditorContent(code) {
  const lesson = state.lesson;
  const old = state.files;
  state.suppressChange = true;
  if (lesson.starterFiles) {
    const saved = typeof code === 'string' ? savedFiles(code) : null;
    const models = new Map();
    Object.keys(lesson.starterFiles).forEach((name) => {
      const text = saved && typeof saved[name] === 'string' ? saved[name] : lesson.starterFiles[name];
      const uri = state.monaco.Uri.parse('file:///' + lesson.id + '/' + name);
      const model = state.monaco.editor.createModel(text, languageOf(name), uri);
      model.onDidChangeContent(onEditorChange);
      models.set(name, model);
    });
    state.files = { models, active: lesson.entry };
  } else {
    state.files = null;
    state.editor.setModel(state.singleModel);
    state.editor.setValue(typeof code === 'string' ? code : lesson.starterCode);
  }
  renderFileTabs();
  if (old) old.models.forEach((model) => model.dispose());
  state.suppressChange = false;
  state.editor.setScrollTop(0);
  state.dirty = false;
  setSaveState('saved');
}

function onEditorChange() {
  if (state.suppressChange) return;
  clearMarkers();
  state.dirty = true;
  setSaveState('dirty');
  clearTimeout(state.saveTimer);
  state.saveTimer = setTimeout(() => flushSave(), 800);
}

async function flushSave(keepalive = false) {
  clearTimeout(state.saveTimer);
  if (!state.dirty || !state.lesson) return;
  const id = state.lesson.id;
  const code = currentCode();
  state.dirty = false;
  setSaveState('saving');
  try {
    await api.saveLesson(id, { code }, keepalive);
    lessonProgress(id).code = code;
    state.progress.lastLessonId = id;
    if (currentCode() === code) setSaveState('saved'); else setSaveState('dirty');
    const now = Date.now();
    if (!state.lastEditEvent[id] || now - state.lastEditEvent[id] > 5 * 60 * 1000) {
      state.lastEditEvent[id] = now;
      api.event(id, 'edit', `Code bearbeitet (${code.length} Zeichen)`);
    }
  } catch (e) {
    state.dirty = true;
    setSaveState('error');
  }
}

function clearMarkers() {
  const models = state.files ? [...state.files.models.values()] : [state.editor && state.editor.getModel()];
  models.forEach((model) => { if (model) state.monaco.editor.setModelMarkers(model, 'codewerk', []); });
  $$('#file-tabs .has-error').forEach((b) => b.classList.remove('has-error'));
}

function markLine(line, column, message, file) {
  const model = file && state.files ? state.files.models.get(file) : state.editor.getModel();
  if (!model || !line || line > model.getLineCount()) return;
  if (file) $$('#file-tabs [data-file]').forEach((b) => b.classList.toggle('has-error', b.dataset.file === file));
  state.monaco.editor.setModelMarkers(model, 'codewerk', [{
    severity: state.monaco.MarkerSeverity.Error,
    message, startLineNumber: line, startColumn: column || 1, endLineNumber: line, endColumn: model.getLineMaxColumn(line),
  }]);
}

function gotoLine(line, column, file) {
  if (MOBILE.matches) setView('code');
  if (file) showFile(file);
  state.editor.revealLineInCenter(line);
  state.editor.setPosition({ lineNumber: line, column: column || 1 });
  state.editor.focus();
}

function classify(result) {
  if (!result) return { kind: 'none' };
  if (result.crashed) return { kind: 'crashed', text: result.crashed };
  if (result.timeout) return { kind: 'timeout' };
  if (result.syntaxError) return { kind: 'syntax', line: result.syntaxError.line, file: result.syntaxError.file };
  if (result.error) return { kind: 'error', line: result.error.line, file: result.error.file };
  if (result.testsBroken) return { kind: 'broken', text: result.testsBroken };
  if (result.tests) {
    const passed = result.tests.filter((t) => t.ok).length;
    return { kind: 'tests', passed, total: result.tests.length, all: passed === result.tests.length && result.tests.length > 0 };
  }
  return { kind: 'ran' };
}

function errorText(result) {
  if (!result) return '';
  const where = (e) => (e.file ? e.file + (e.line ? ', ' : ': ') : '') + (e.line ? 'Zeile ' + e.line + ': ' : '');
  if (result.syntaxError) return `Syntaxfehler in ${where(result.syntaxError)}${result.syntaxError.message}`;
  if (result.error) return `${where(result.error)}${result.error.raw} (${result.error.message})`;
  if (result.timeout) return `Zeitlimit von ${TIMEOUT_SECONDS} Sekunden überschritten (Endlosschleife?)`;
  return '';
}

async function runPageLesson(job, lessonId) {
  const { page, testsSource } = state.lesson;
  const storage = state.pageStorage.get(lessonId) || {};
  const live = (msg) => {
    if (msg.storage) state.pageStorage.set(lessonId, msg.storage);
    if (msg.log && state.lesson && state.lesson.id === lessonId) appendLiveLog(msg.log);
  };
  const [shown, tested] = await Promise.all([
    runInPage({ ...job, tests: null, page, storage }, $('#preview-host'), live),
    runInPage({ ...job, tests: testsSource, page, storage }, null),
  ]);
  if (shown.storage) state.pageStorage.set(lessonId, shown.storage);
  if (shown.syntaxError || shown.error || shown.timeout || shown.crashed) return shown;
  if (tested.timeout || tested.crashed || tested.error) return { ...tested, logs: shown.logs, snapshot: shown.snapshot };
  return { ...shown, tests: tested.tests, testsBroken: tested.testsBroken };
}

async function run({ auto = false } = {}) {
  if (state.running || !state.lesson) return;
  state.running = true;
  const btn = $('#btn-run');
  btn.disabled = true;
  btn.firstChild.textContent = 'Läuft … ';
  await flushSave();

  const code = currentCode();
  const job = state.files ? { files: currentFiles(), entry: state.lesson.entry, node: nodeJob() } : { code };
  const lessonId = state.lesson.id;
  const result = isPageLesson() ? await runPageLesson(job, lessonId) : await runCode({ ...job, tests: state.lesson.testsSource });
  state.last = { result, code };
  state.running = false;
  btn.disabled = false;
  btn.firstChild.textContent = 'Ausführen ';

  clearMarkers();
  const info = classify(result);
  const err = result.syntaxError || result.error;
  if (err && err.line) markLine(err.line, err.column, err.message, err.file);

  renderResults(result);

  if (!auto) {
    if (isPageLesson() && (info.kind === 'ran' || (info.kind === 'tests' && info.all))) setResultTab('vorschau');
    else if (info.kind === 'tests' || info.kind === 'ran') setResultTab(info.kind === 'tests' ? 'pruefung' : 'ausgabe');
    else setResultTab('ausgabe');
    if (MOBILE.matches) setView('ergebnis');
  }

  const lp = lessonProgress(state.lesson.id);
  const summary = info.kind === 'tests'
    ? { passed: info.passed, total: info.total }
    : { passed: 0, total: 0, error: errorText(result) || result.testsBroken || '' };
  lp.lastRun = summary;
  const patch = { lastRun: summary };
  if (!auto && info.kind === 'tests' && info.all && !lp.done) {
    lp.done = true;
    patch.done = true;
    api.event(state.lesson.id, 'done', `Lektion ${state.lesson.index} „${state.lesson.title}“ geschafft (${info.total} Tests bestanden)`);
    renderProgress();
    renderLessonList();
    renderNextStep();
  }
  api.saveLesson(state.lesson.id, patch).catch(() => {});
  if (!auto) {
    const detail = info.kind === 'tests' ? `Ausgeführt: ${info.passed} von ${info.total} Tests bestanden`
      : info.kind === 'ran' ? 'Ausgeführt' : 'Ausgeführt mit Fehler: ' + (errorText(result) || 'unbekannt').slice(0, 120);
    api.event(state.lesson.id, 'run', detail);
  }
}

function renderResults(result) {
  const info = classify(result);
  renderTests(result, info);
  renderConsole(result, info);

  if (!result) diagram.render(null);
  else if (result.snapshot) diagram.render(result.snapshot);
  else if (info.kind === 'syntax') diagram.render(null, 'Das Diagramm erscheint, sobald dein Code keine Schreibfehler mehr hat.');
  else diagram.render(null, 'Das Diagramm erscheint, sobald dein Code ohne Fehler bis zum Ende läuft.');
  if (state.resultTab === 'diagramm') requestAnimationFrame(() => diagram.refresh());

  const bp = $('#badge-pruefung');
  bp.textContent = info.kind === 'tests' ? `${info.passed}/${info.total}` : '';
  bp.className = 'badge' + (info.kind === 'tests' ? (info.all ? ' badge-ok' : ' badge-warn') : '');
  const ba = $('#badge-ausgabe');
  const failed = ['syntax', 'error', 'timeout', 'crashed'].includes(info.kind);
  ba.textContent = failed ? '!' : result && result.logs && result.logs.length ? String(result.logs.length) : '';
  ba.className = 'badge' + (failed ? ' badge-bad' : '');
  const bm = $('#badge-mobile');
  bm.textContent = failed ? '!' : bp.textContent;
  bm.className = failed ? ba.className : bp.className;

  renderNextStep();
}

function renderTests(result, info) {
  const el = $('#rtab-pruefung');
  if (!result) {
    el.innerHTML = '<div class="empty"><p>Hier erscheinen die Ergebnisse der Tests.</p><p class="muted">Schreibe deinen Code und drücke <strong>Ausführen</strong>.</p></div>';
    return;
  }
  if (['syntax', 'error', 'timeout', 'crashed'].includes(info.kind)) {
    el.innerHTML = '<div class="empty"><p>Die Tests laufen erst, wenn dein Code ohne Fehler durchläuft.</p>' +
      '<p><button type="button" class="btn" data-action="show-output">Fehler ansehen</button></p></div>';
    return;
  }
  if (info.kind === 'broken') {
    el.innerHTML = '<div class="notice notice-warn"><strong>Mit dieser Lektion stimmt etwas nicht.</strong><br>' + inline(info.text) + '</div>';
    return;
  }
  if (!result.tests) { el.innerHTML = '<div class="empty"><p>Diese Lektion hat keine Tests.</p></div>'; return; }

  el.innerHTML = '<ul class="tests">' + result.tests.map((t) => {
    if (t.ok) {
      return `<li class="test is-ok"><span class="test-icon" aria-hidden="true">✓</span><div class="test-body"><div class="test-name">${inline(t.name)}</div></div><span class="sr-only">bestanden</span></li>`;
    }
    return `<li class="test is-fail"><span class="test-icon" aria-hidden="true">✗</span><div class="test-body"><div class="test-name">${inline(t.name)} <span class="sr-only">nicht bestanden</span></div>` +
      `<div class="test-msg">${inline(t.message || '')}</div>` +
      (t.hint ? `<div class="test-hint"><strong>Tipp:</strong> ${inline(t.hint)}</div>` : '') + '</div></li>';
  }).join('') + '</ul>';
}

function renderConsole(result, info) {
  const el = $('#rtab-ausgabe');
  if (!result) {
    el.innerHTML = '<div class="empty"><p>Hier erscheint, was dein Code mit <code>console.log</code> ausgibt.</p></div>';
    return;
  }
  const parts = [];
  if (info.kind === 'crashed') {
    parts.push(`<div class="errorcard"><div class="errorcard-title">Das Ausführen ist abgestürzt</div><p>${escapeHtml(info.text)}</p></div>`);
  } else if (info.kind === 'timeout') {
    parts.push(`<div class="errorcard"><div class="errorcard-title">Zeitlimit überschritten</div><p>Dein Code lief länger als ${TIMEOUT_SECONDS} Sekunden und wurde angehalten. Gibt es eine Schleife, die nie aufhört? Prüfe die Bedingung der Schleife.</p>` +
      '<p><button type="button" class="btn small" data-action="explain">Erklär mir den Fehler</button></p></div>');
  } else if (result.syntaxError || result.error) {
    const e = result.syntaxError || result.error;
    const title = result.syntaxError ? 'Schreibfehler im Code' : 'Fehler beim Ausführen';
    const place = [e.file, e.line ? 'Zeile ' + e.line : ''].filter(Boolean).join(', ');
    parts.push(`<div class="errorcard"><div class="errorcard-title">${title}${place ? ' · ' + escapeHtml(place) : ''}</div>` +
      `<p>${inline(e.message)}</p><div class="errorcard-actions">` +
      (e.line ? `<button type="button" class="btn small" data-goto-line="${e.line}" data-goto-col="${e.column || 1}"${e.file ? ` data-goto-file="${escapeHtml(e.file)}"` : ''}>Zu ${e.file ? escapeHtml(e.file) + ', ' : ''}Zeile ${e.line} springen</button>` : '') +
      '<button type="button" class="btn small" data-action="explain">Erklär mir den Fehler</button></div>' +
      `<details><summary>Originalmeldung</summary><code>${escapeHtml(e.raw)}</code></details></div>`);
  }
  const logs = result.logs || [];
  if (logs.length) {
    parts.push('<div class="console" aria-label="Konsole">' + logs.map((l) =>
      `<div class="log log-${l.type}">${escapeHtml(l.text)}</div>`).join('') + '</div>');
  } else if (!result.syntaxError && !result.error && !result.timeout) {
    parts.push('<div class="empty"><p>Keine Ausgabe.</p><p class="muted">Mit <code>console.log(…)</code> kannst du Werte anzeigen.</p></div>');
  }
  if (result.fsChanges && result.fsChanges.length) {
    const label = { neu: 'neu', 'geändert': 'geändert', 'gelöscht': 'gelöscht' };
    parts.push('<details class="fs-changes" open><summary>Dateien nach dem Lauf (' + result.fsChanges.length + ')</summary>' +
      result.fsChanges.map((f) => `<div class="fs-file"><div class="fs-name"><code>${escapeHtml(f.path)}</code> <span class="fs-status fs-${escapeHtml(f.status)}">${label[f.status] || ''}</span></div>` +
        (f.status === 'gelöscht' ? '' : `<pre tabindex="0"><code>${escapeHtml(f.content.length > 2000 ? f.content.slice(0, 2000) + '\n…' : f.content)}</code></pre>`) + '</div>').join('') +
      '<p class="muted small">Das Dateisystem liegt nur im Speicher. Jeder Lauf startet wieder mit den Dateien aus dem Editor.</p></details>');
  }
  el.innerHTML = parts.join('');
}

function appendLiveLog(entry) {
  const panel = $('#rtab-ausgabe');
  let box = $('.console', panel);
  if (!box) {
    panel.innerHTML = '<div class="console" aria-label="Konsole"></div>';
    box = $('.console', panel);
  }
  const line = document.createElement('div');
  line.className = 'log log-' + (['log', 'warn', 'error'].includes(entry.type) ? entry.type : 'log');
  line.textContent = String(entry.text);
  box.appendChild(line);
  while (box.children.length > 300) box.firstChild.remove();
  const badge = $('#badge-ausgabe');
  if (badge.textContent !== '!') badge.textContent = String(box.children.length);
}

function renderNextStep() {
  const el = $('#nextstep');
  const l = state.lesson;
  if (!l) { el.innerHTML = ''; return; }
  const lp = state.progress.lessons[l.id];
  const info = classify(state.last && state.last.result);
  const isLast = l.id === state.lessons[state.lessons.length - 1].id;
  let cls = 'is-info';
  let html;
  const nextBtn = isLast ? '' : '<button type="button" class="btn primary" data-action="next">Nächste Lektion</button>';

  if (info.kind === 'tests' && info.all) {
    cls = 'is-success';
    html = `<div class="ns-text"><strong>Geschafft!</strong> Alle ${info.total} Tests bestehen.${isLast ? ' Du hast alle Lektionen durch. Starkes Ergebnis.' : ''}</div>${nextBtn}`;
  } else if (info.kind === 'tests') {
    cls = 'is-progress';
    html = `<div class="ns-text"><strong>${info.passed} von ${info.total} Tests bestehen.</strong> Nächster Schritt: Öffne unter „Prüfung“ den ersten roten Test.</div>` +
      '<button type="button" class="btn" data-action="tip">Gib mir einen Tipp</button>';
  } else if (['syntax', 'error', 'timeout', 'crashed'].includes(info.kind)) {
    cls = 'is-error';
    html = '<div class="ns-text"><strong>Ein Fehler stoppt deinen Code.</strong> Nächster Schritt: Lies die Meldung unter „Ausgabe“' + (info.line ? ` und schau in ${info.file ? escapeHtml(info.file) + ', ' : ''}Zeile ${info.line}.` : '.') + '</div>' +
      '<button type="button" class="btn" data-action="explain">Erklär mir den Fehler</button>';
  } else if (info.kind === 'broken') {
    cls = 'is-error';
    html = '<div class="ns-text"><strong>Die Tests dieser Lektion sind fehlerhaft.</strong> Das liegt nicht an dir. Prüfe die Datei tests.js.</div>';
  } else if (lp && lp.done) {
    cls = 'is-success';
    html = `<div class="ns-text"><strong>Diese Lektion hast du schon geschafft.</strong> Du kannst sie wiederholen oder weitergehen.</div>${nextBtn}`;
  } else {
    html = state.leftTab === 'verstehen'
      ? `<div class="ns-text"><strong>Nächster Schritt:</strong> Lies ${MOBILE.matches ? 'unter „Lernen“' : 'links'} die Erklärung. Danach geht es zur Aufgabe.</div><button type="button" class="btn" data-goto="aufgabe">Zur Aufgabe</button>`
      : '<div class="ns-text"><strong>Nächster Schritt:</strong> Schreibe deinen Code und drücke <strong>Ausführen</strong>.</div>';
  }
  el.className = 'nextstep ' + cls;
  el.innerHTML = html;
}

function tutorContext() {
  const last = state.last && state.last.result;
  return {
    lessonId: state.lesson.id,
    code: readableCode(),
    output: last && last.logs ? last.logs.map((l) => l.text).join('\n') : '',
    error: errorText(last),
    tests: last && last.tests ? last.tests.map((t) => ({ name: t.name, ok: t.ok, message: t.message })) : [],
  };
}

function askTutor(mode) {
  setView('lernen');
  setLeftTab('tutor');
  tutor.ask({ mode });
}

async function trySnippet(button) {
  const out = button.closest('.codeblock').querySelector('.try-out');
  button.disabled = true;
  const result = isPageLesson()
    ? await runInPage({ code: button.dataset.code, tests: null, page: state.lesson.page }, null)
    : nodeJob()
      ? await runCode({ files: { ...state.lesson.starterFiles, [state.lesson.entry]: button.dataset.code }, entry: state.lesson.entry, node: nodeJob(), tests: null })
      : await runCode({ code: button.dataset.code, tests: null });
  button.disabled = false;
  let html;
  if (result.timeout) html = '<div class="log log-error">Das hat zu lange gedauert.</div>';
  else if (result.crashed) html = '<div class="log log-error">' + escapeHtml(result.crashed) + '</div>';
  else if (result.syntaxError) html = `<div class="log log-error">Zeile ${result.syntaxError.line}: ${escapeHtml(result.syntaxError.message)}</div>`;
  else {
    const lines = (result.logs || []).map((l) => `<div class="log log-${l.type}">${escapeHtml(l.text)}</div>`);
    if (result.error) lines.push(`<div class="log log-error">${escapeHtml(result.error.message)}</div>`);
    html = lines.join('') || '<div class="log log-muted">(keine Ausgabe)</div>';
  }
  out.innerHTML = '<div class="try-label">Ausgabe</div>' + html;
  out.hidden = false;
}

function wireUi() {
  $$('[data-tab]').forEach((b) => b.addEventListener('click', () => { setLeftTab(b.dataset.tab); renderNextStep(); if (b.dataset.tab === 'tutor') tutor.focusInput(); }));
  $$('[data-rtab]').forEach((b) => b.addEventListener('click', () => setResultTab(b.dataset.rtab)));
  wireTabKeys('.pane-left .tabs .tab', 'tab', (t) => setLeftTab(t));
  wireTabKeys('.results-card .tabs .tab', 'rtab', (t) => setResultTab(t));
  $('#file-tabs').addEventListener('keydown', (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const all = $$('#file-tabs [data-file]');
    const i = all.findIndex((b) => b.dataset.file === state.files.active);
    const next = all[(i + (e.key === 'ArrowRight' ? 1 : all.length - 1)) % all.length];
    showFile(next.dataset.file);
    next.focus();
  });

  $('#btn-run').addEventListener('click', () => run());
  $$('.mn-btn').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
  MOBILE.addEventListener('change', () => renderNextStep());

  $('#btn-expand').addEventListener('click', () => {
    const on = $('.pane-right').classList.toggle('is-expanded');
    $('#btn-expand').setAttribute('aria-pressed', String(on));
    $('#btn-expand').textContent = on ? 'Ergebnis verkleinern' : 'Ergebnis vergrößern';
    requestAnimationFrame(() => { diagram.refresh(); state.editor.layout(); });
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); run(); }
  });

  $('#btn-tip').addEventListener('click', () => {
    const box = $('#tip-text');
    box.hidden = !box.hidden;
    $('#btn-tip').textContent = box.hidden ? 'Tipp anzeigen' : 'Tipp verbergen';
    $('#btn-tip').setAttribute('aria-expanded', String(!box.hidden));
  });

  document.addEventListener('click', (e) => {
    const t = e.target.closest('button');
    if (!t) return;
    if (t.classList.contains('try')) return trySnippet(t);
    if (t.dataset.goto) { setView('lernen'); setLeftTab(t.dataset.goto); renderNextStep(); return; }
    if (t.dataset.gotoLine) return gotoLine(Number(t.dataset.gotoLine), Number(t.dataset.gotoCol), t.dataset.gotoFile);
    if (t.dataset.file) return showFile(t.dataset.file);
    switch (t.dataset.action) {
      case 'next': {
        const i = state.lessons.findIndex((l) => l.id === state.lesson.id);
        if (state.lessons[i + 1]) { setView('lernen'); openLesson(state.lessons[i + 1].id); }
        break;
      }
      case 'tip': askTutor('tipp'); break;
      case 'explain': askTutor('fehler'); break;
      case 'show-output': setResultTab('ausgabe'); break;
      default: break;
    }
  });

  const menu = $('#dlg-menu');
  $('#btn-menu').addEventListener('click', () => { renderLessonList(); menu.showModal(); const cur = $('.lesson-item.is-current', menu); if (cur) cur.scrollIntoView({ block: 'center' }); });
  $('#lesson-list').addEventListener('click', (e) => {
    const b = e.target.closest('.lesson-item');
    if (!b) return;
    menu.close();
    if (!state.lesson || b.dataset.id !== state.lesson.id) { setView('lernen'); openLesson(b.dataset.id); }
  });

  const view = $('#dlg-view');
  $('#btn-view').addEventListener('click', () => {
    $(`input[name="theme"][value="${document.documentElement.dataset.pref}"]`).checked = true;
    $(`input[name="size"][value="${document.documentElement.dataset.size}"]`).checked = true;
    view.showModal();
  });
  $$('input[name="theme"]').forEach((r) => r.addEventListener('change', () => applyTheme(r.value)));
  $$('input[name="size"]').forEach((r) => r.addEventListener('change', () => applySize(r.value)));
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (document.documentElement.dataset.pref === 'auto') applyTheme('auto');
  });

  const resetDlg = $('#dlg-reset');
  $('#btn-reset').addEventListener('click', () => resetDlg.showModal());
  $('#btn-reset-confirm').addEventListener('click', async () => {
    resetDlg.close();
    const id = state.lesson.id;
    clearTimeout(state.saveTimer);
    state.dirty = false;
    try { await api.resetLesson(id); } catch (e) { }
    const lp = lessonProgress(id);
    lp.code = null;
    lp.lastRun = null;
    setEditorContent(null);
    state.last = null;
    clearMarkers();
    renderResults(null);
    setLeftTab('aufgabe');
  });

  $$('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d || e.target.closest('[data-close]')) d.close(); });
  });

  window.addEventListener('pagehide', () => flushSave(true));
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flushSave(true); });
}

const LOGIN_ERRORS = {
  abgebrochen: 'Die Anmeldung wurde abgebrochen.',
  ungueltig: 'Die Anmeldung ist abgelaufen oder ungültig. Versuch es bitte noch einmal.',
  github: 'GitHub hat die Anmeldung nicht bestätigt. Versuch es bitte noch einmal.',
};

let toastTimer;
function showToast(text, kind = 'info') {
  const el = $('#toast');
  el.textContent = text;
  el.className = 'toast toast-' + kind;
  el.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { el.hidden = true; }, 6000);
}

function initials(name) {
  const parts = String(name || '?').replace(/[^\p{L}\p{N}\s-]/gu, ' ').trim().split(/[\s-]+/).filter(Boolean);
  return ((parts[0] || '?')[0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
}

function renderAccount(config) {
  const box = $('#account');
  if (!config.accounts) { box.hidden = true; return; }
  box.hidden = false;
  if (!config.user) {
    box.innerHTML = '<a class="btn primary small login" href="/auth/github"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8a8 8 0 0 0 5.47 7.59c.4.07.55-.17.55-.38v-1.33c-2.23.48-2.7-1.07-2.7-1.07-.36-.93-.89-1.17-.89-1.17-.73-.5.06-.49.06-.49.8.06 1.23.83 1.23.83.72 1.23 1.88.87 2.34.67.07-.52.28-.87.5-1.07-1.78-.2-3.65-.89-3.65-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.6 7.6 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.28.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48v2.2c0 .21.15.46.55.38A8 8 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg><span class="login-long">Mit GitHub anmelden</span><span class="login-short">Anmelden</span></a>';
    return;
  }
  box.innerHTML = `<button type="button" class="btn ghost account-btn" id="btn-account" aria-haspopup="dialog" title="Konto: ${escapeHtml(config.user.login)}"><span class="avatar" aria-hidden="true">${escapeHtml(initials(config.user.name))}</span><span class="account-name">${escapeHtml(config.user.login)}</span></button>`;
  $('#account-login').textContent = config.user.login;
  $('#btn-account').addEventListener('click', () => $('#dlg-account').showModal());
}

function wireAccount() {
  $('#btn-logout').addEventListener('click', async () => {
    await flushSave();
    try { await api.logout(); } catch (e) { }
    location.href = '/';
  });
  $('#btn-delete-account').addEventListener('click', async (e) => {
    const btn = e.currentTarget;
    btn.disabled = true;
    try {
      await api.deleteAccount();
      location.href = '/?konto=geloescht';
    } catch (err) {
      btn.disabled = false;
      showToast('Das Konto konnte nicht gelöscht werden: ' + err.message, 'error');
    }
  });
}

async function handleLoginReturn(config) {
  const params = new URLSearchParams(location.search);
  const login = params.get('login');
  const konto = params.get('konto');
  if (!login && !konto) return;
  history.replaceState(null, '', location.pathname);
  if (konto === 'geloescht') { showToast('Dein Konto wurde gelöscht.'); return; }
  if (login === 'fehler') { showToast(LOGIN_ERRORS[params.get('grund')] || LOGIN_ERRORS.github, 'error'); return; }
  if (login !== 'ok' || !config.user) return;
  const guestDoc = api.guestProgress();
  if (!guestDoc) { showToast(`Willkommen, ${config.user.name}!`); return; }
  try {
    const res = await api.importGuestProgress(guestDoc);
    api.clearGuestProgress();
    showToast(res.lessons ? `Willkommen, ${config.user.name}! Dein Gast-Fortschritt (${res.lessons} ${res.lessons === 1 ? 'Lektion' : 'Lektionen'}) ist jetzt in deinem Konto.` : `Willkommen, ${config.user.name}!`);
  } catch (e) {
    showToast('Dein Gast-Fortschritt konnte nicht übernommen werden: ' + e.message, 'error');
  }
}

async function init() {
  const monacoReady = loadMonaco();
  monacoReady.catch(() => {});
  let config, lessonInfo, progress;
  try {
    config = await api.config();
    api.setGuest(config.accounts && !config.user);
    await handleLoginReturn(config);
    const lessonsRequest = api.lessons();
    [lessonInfo, progress] = await Promise.all([lessonsRequest, api.isGuest() ? lessonsRequest.then(() => api.progress()) : api.progress()]);
  } catch (e) {
    return showFatal('Der Server antwortet nicht: ' + e.message);
  }
  state.config = config;
  state.lessons = lessonInfo.lessons;
  state.progress = progress;
  state.progress.lessons = state.progress.lessons || {};
  state.progress.ui = state.progress.ui || {};

  if (!state.lessons.length) return showFatal('Es wurden keine Lektionen gefunden. Prüfe den Ordner „lessons“.');
  if (lessonInfo.problems && lessonInfo.problems.length) $('#lesson-problems').textContent = lessonInfo.problems.join(' ');

  const firstVisit = !progress.lastLessonId;
  const wanted = state.lessons.find((l) => l.id === progress.lastLessonId) || state.lessons[0];
  let preloaded = null;
  try {
    preloaded = await api.lesson(wanted.id);
    state.lesson = preloaded;
    renderLessonTexts();
    renderProgress();
  } catch (e) { }

  try {
    state.monaco = await monacoReady;
  } catch (e) {
    return showFatal(e.message);
  }
  const size = document.documentElement.dataset.size || 'm';
  state.editor = createEditor(state.monaco, $('#editor'), { fontSize: FONT_SIZES[size] });
  state.singleModel = state.monaco.editor.createModel('', 'javascript');
  state.singleModel.onDidChangeContent(onEditorChange);
  state.editor.setModel(state.singleModel);
  state.editor.addCommand(state.monaco.KeyMod.CtrlCmd | state.monaco.KeyCode.Enter, () => run());

  diagram = createDiagram($('#rtab-diagramm'));
  tutor = createTutor({
    root: $('#tab-tutor'),
    getContext: tutorContext,
    onChange: (messages) => {
      if (!state.lesson) return;
      lessonProgress(state.lesson.id).chat = messages;
      api.saveLesson(state.lesson.id, { chat: messages }).catch(() => {});
    },
    onAsk: (mode) => api.event(state.lesson.id, 'tutor', mode === 'chat' ? 'Tutor gefragt (eigene Frage)' : `Tutor gefragt: ${mode}`),
  });
  tutor.setConfigured(config.tutorConfigured, config.model);
  if (config.tutorLocked) tutor.setLocked();
  renderAccount(config);
  $('#guest-note').hidden = !api.isGuest();

  wireUi();
  wireAccount();
  renderProgress();

  await openLesson(wanted.id, { initial: true, preloaded });
  renderProgress();

  const tour = createTour({
    setView,
    setLeftTab: (t) => { setLeftTab(t); renderNextStep(); },
    setResultTab,
    needsLogin: !!(config.accounts && !config.user),
  });
  $('#btn-tour').addEventListener('click', () => tour.start());
  if (firstVisit && !tourSeen()) tour.start();
}

init().catch((e) => showFatal(e.message || String(e)));
