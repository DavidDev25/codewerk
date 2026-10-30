import { escapeHtml } from './markdown.js';

const STORAGE_KEY = 'cw-tour-done';
const MOBILE = window.matchMedia('(max-width: 999px)');

export function tourSeen() {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) { return true; }
}

function markSeen() {
  try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) { }
}

export function createTour({ setView, setLeftTab, setResultTab, needsLogin }) {
  const steps = [
    {
      title: 'Willkommen bei Codewerk',
      text: 'Hier lernst du JavaScript, indem du selbst Code schreibst. Die Tour zeigt dir in einer Minute, wo alles ist. Du kannst sie jederzeit überspringen.',
    },
    {
      target: '#btn-menu',
      title: 'Alle Lektionen',
      text: 'Hier findest du alle Lektionen und siehst, welche du schon geschafft hast. Am besten startest du mit Lektion 0.',
    },
    {
      target: '.pane-left .tabs',
      view: 'lernen',
      before: () => setLeftTab('verstehen'),
      title: 'Verstehen und Aufgabe',
      text: 'Unter „Verstehen“ steht eine kurze Erklärung mit Beispielen zum Ausprobieren. Unter „Aufgabe“ steht, was dein Code können soll.',
    },
    {
      target: '.editor-card',
      view: 'code',
      title: 'Dein Code',
      text: 'Hier schreibst du deinen Code. Er wird automatisch gespeichert. Mit „Startcode zurücksetzen“ fängst du neu an.',
    },
    {
      target: '#btn-run',
      view: 'code',
      title: 'Ausführen',
      text: 'Startet deinen Code und die automatischen Tests. Schneller geht es mit Strg + Enter.',
    },
    {
      target: '.results-card',
      view: 'ergebnis',
      before: () => setResultTab('pruefung'),
      title: 'Prüfung, Ausgabe, Diagramm',
      text: '„Prüfung“ zeigt mit ✓ und ✗, welche Tests bestehen. „Ausgabe“ zeigt console.log und Fehler. „Diagramm“ macht deine Variablen sichtbar.',
    },
    {
      target: '#tabbtn-tutor',
      view: 'lernen',
      title: 'Der KI-Tutor',
      text: 'Wenn du hängst, gibt dir der Tutor Hinweise und stellt Rückfragen. Die Lösung verrät er nicht.' +
        (needsLogin ? ' Er ist verfügbar, sobald du dich mit GitHub anmeldest.' : ''),
    },
    {
      target: '#btn-view',
      title: 'Ansicht',
      text: 'Hell oder dunkel, normale oder große Schrift: Stell es so ein, wie du am besten lesen kannst.',
    },
    {
      target: '#btn-tour',
      title: 'Fertig!',
      text: 'Über diesen Knopf startest du die Tour jederzeit neu. Jetzt geht es los mit Lektion 0.',
    },
  ];

  let index = 0;
  let active = false;
  let lastFocus = null;
  let root;
  let spot;
  let card;

  function build() {
    root = document.createElement('div');
    root.className = 'tour';
    root.innerHTML =
      '<div class="tour-spot" aria-hidden="true"></div>' +
      '<div class="tour-card" role="dialog" aria-modal="true" aria-labelledby="tour-title" aria-describedby="tour-text">' +
      '<div class="tour-count small muted"></div>' +
      '<h2 id="tour-title" class="tour-title"></h2>' +
      '<p id="tour-text" class="tour-text"></p>' +
      '<div class="tour-actions">' +
      '<button type="button" class="btn ghost small" data-tour="skip">Überspringen</button>' +
      '<span class="spacer"></span>' +
      '<button type="button" class="btn small" data-tour="back">Zurück</button>' +
      '<button type="button" class="btn primary small" data-tour="next">Weiter</button>' +
      '</div></div>';
    spot = root.querySelector('.tour-spot');
    card = root.querySelector('.tour-card');
    root.addEventListener('click', (e) => {
      const b = e.target.closest('[data-tour]');
      if (!b) return;
      if (b.dataset.tour === 'skip') finish();
      else if (b.dataset.tour === 'back') go(index - 1);
      else go(index + 1);
    });
    root.addEventListener('keydown', onKey);
    document.body.appendChild(root);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); finish(); return; }
    if (e.key === 'ArrowRight') { e.preventDefault(); go(index + 1); return; }
    if (e.key === 'ArrowLeft') { e.preventDefault(); go(index - 1); return; }
    if (e.key === 'Tab') {
      const buttons = Array.from(card.querySelectorAll('button:not([hidden])'));
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }

  function targetOf(step) {
    if (!step.target) return null;
    const el = document.querySelector(step.target);
    if (!el) return null;
    const r = el.getBoundingClientRect();
    return r.width && r.height ? el : null;
  }

  function go(next) {
    if (next < 0) return;
    if (next >= steps.length) { finish(); return; }
    index = next;
    const step = steps[index];
    if (MOBILE.matches && step.view) setView(step.view);
    if (step.before) step.before();

    card.querySelector('.tour-count').textContent = `${index + 1} von ${steps.length}`;
    card.querySelector('.tour-title').innerHTML = escapeHtml(step.title);
    card.querySelector('.tour-text').innerHTML = escapeHtml(step.text);
    card.querySelector('[data-tour="back"]').hidden = index === 0;
    card.querySelector('[data-tour="skip"]').hidden = index === steps.length - 1;
    card.querySelector('[data-tour="next"]').textContent = index === steps.length - 1 ? 'Los geht’s' : 'Weiter';

    const el = targetOf(step);
    if (el) el.scrollIntoView({ block: 'nearest' });
    requestAnimationFrame(place);
    card.querySelector('[data-tour="next"]').focus();
  }

  function place() {
    if (!active) return;
    const el = targetOf(steps[index]);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 12;
    const cw = card.offsetWidth;
    const ch = card.offsetHeight;

    if (!el) {
      spot.hidden = true;
      root.classList.add('is-centered');
      card.style.left = Math.max(margin, (vw - cw) / 2) + 'px';
      card.style.top = Math.max(margin, (vh - ch) / 2) + 'px';
      return;
    }

    root.classList.remove('is-centered');
    const pad = 6;
    const r = el.getBoundingClientRect();
    const top = Math.max(r.top - pad, 4);
    const left = Math.max(r.left - pad, 4);
    const bottom = Math.min(r.bottom + pad, vh - 4);
    const right = Math.min(r.right + pad, vw - 4);
    spot.hidden = false;
    spot.style.top = top + 'px';
    spot.style.left = left + 'px';
    spot.style.width = right - left + 'px';
    spot.style.height = bottom - top + 'px';

    let y;
    if (vh - bottom >= ch + margin * 2) y = bottom + margin;
    else if (top >= ch + margin * 2) y = top - ch - margin;
    else y = vh - ch - margin;
    let x = r.left + r.width / 2 - cw / 2;
    x = Math.min(Math.max(x, margin), vw - cw - margin);
    card.style.left = x + 'px';
    card.style.top = Math.max(margin, y) + 'px';
  }

  function onResize() { requestAnimationFrame(place); }

  function start() {
    if (active) return;
    if (!root) build();
    active = true;
    lastFocus = document.activeElement;
    root.hidden = false;
    document.body.classList.add('tour-open');
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onResize, true);
    go(0);
  }

  function finish() {
    if (!active) return;
    active = false;
    markSeen();
    root.hidden = true;
    document.body.classList.remove('tour-open');
    window.removeEventListener('resize', onResize);
    window.removeEventListener('scroll', onResize, true);
    if (MOBILE.matches) setView('lernen');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
  }

  return { start };
}
