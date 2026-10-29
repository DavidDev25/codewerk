/* ==========================================================================
   tutor-chat.js – Der Chat mit dem KI-Tutor.

   Schickt Fragen an /api/chat (unser Server -> OmniRoute) und zeigt die
   Antwort live an, während sie ankommt (Streaming per Server-Sent Events).
   ========================================================================== */
import { renderMarkdown, inline } from './markdown.js';

const MODE_LABEL = {
  tipp: 'Gib mir einen Tipp',
  fehler: 'Erklär mir den Fehler',
  review: 'Code-Review',
  wo: 'Wo war ich?',
};

const EMPTY_HINT =
  'Hier kannst du Fragen stellen. Der Tutor verrät die Lösung nicht, hilft dir aber Schritt für Schritt. ' +
  'Probier eine der Schnellfragen oben.';

/**
 * @param {object} o
 * @param {HTMLElement} o.root        das Tutor-Panel
 * @param {() => object} o.getContext liefert {lessonId, code, output, error, tests}
 * @param {(messages: object[]) => void} o.onChange  wird nach jeder fertigen Antwort aufgerufen (zum Speichern)
 * @param {(mode: string) => void} o.onAsk           Protokoll: Tutor wurde gefragt
 */
export function createTutor({ root, getContext, onChange, onAsk }) {
  const log = root.querySelector('#chat-log');
  const form = root.querySelector('#chat-form');
  const input = root.querySelector('#chat-input');
  const sendBtn = root.querySelector('#chat-send');
  const stopBtn = root.querySelector('#chat-stop');
  const clearBtn = root.querySelector('#chat-clear');
  const quick = root.querySelectorAll('.quick [data-mode]');
  const setup = root.querySelector('#tutor-setup');

  let messages = [];       // {role, content}
  let controller = null;   // AbortController des laufenden Streams
  let configured = true;

  function bubble(role, html, extraClass) {
    const div = document.createElement('div');
    div.className = 'msg msg-' + role + (extraClass ? ' ' + extraClass : '');
    div.innerHTML = html;
    log.appendChild(div);
    return div;
  }

  function scrollDown(force) {
    const nearBottom = log.scrollHeight - log.scrollTop - log.clientHeight < 120;
    if (force || nearBottom) log.scrollTop = log.scrollHeight;
  }

  function renderAll() {
    log.innerHTML = '';
    if (!messages.length) {
      bubble('hint', '<p>' + inline(EMPTY_HINT) + '</p>');
      return;
    }
    messages.forEach((m) => {
      bubble(m.role === 'user' ? 'user' : 'bot', m.role === 'user' ? '<p>' + inline(m.content) + '</p>' : renderMarkdown(m.content));
    });
    scrollDown(true);
  }

  function setBusy(busy) {
    sendBtn.hidden = busy;
    stopBtn.hidden = !busy;
    sendBtn.disabled = busy;
    quick.forEach((b) => { b.disabled = busy; });
    input.disabled = busy;
  }

  /** Eine Frage stellen. mode: 'tipp' | 'fehler' | 'review' | 'wo' | 'chat' */
  async function ask({ mode, message }) {
    if (controller) return; // es läuft schon eine Antwort
    const ctx = getContext();
    const userText = mode === 'chat' ? String(message || '').trim() : MODE_LABEL[mode];
    if (!userText) return;

    if (!configured) { renderAll(); bubble('error', '<p>Der Tutor ist noch nicht eingerichtet (siehe Hinweis oben).</p>'); return; }

    const history = messages.slice(-8);
    messages.push({ role: 'user', content: userText });
    renderAll();
    const botDiv = bubble('bot', '<p class="typing" aria-label="Der Tutor schreibt">…</p>');
    scrollDown(true);
    onAsk(mode);

    controller = new AbortController();
    setBusy(true);
    let answer = '';
    let failed = null;
    let raf = 0;
    const paint = () => { raf = 0; botDiv.innerHTML = renderMarkdown(answer); scrollDown(); };

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode, message: mode === 'chat' ? userText : undefined, history,
          lessonId: ctx.lessonId, code: ctx.code, output: ctx.output, error: ctx.error, tests: ctx.tests,
        }),
        signal: controller.signal,
      });
      if (!res.ok || !res.body) {
        let msg = 'Der Server antwortet mit Fehler ' + res.status + '.';
        try { msg = (await res.json()).error || msg; } catch (e) { /* kein JSON */ }
        throw new Error(msg);
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf('\n\n')) !== -1) {
          const event = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const line = event.split('\n').find((l) => l.startsWith('data:'));
          if (!line) continue;
          let data;
          try { data = JSON.parse(line.slice(5)); } catch (e) { continue; }
          if (data.delta) { answer += data.delta; if (!raf) raf = requestAnimationFrame(paint); }
          if (data.error) failed = data.error;
        }
      }
    } catch (e) {
      if (e.name !== 'AbortError') failed = e.message || 'Verbindung zum Server unterbrochen.';
    } finally {
      if (raf) cancelAnimationFrame(raf);
      controller = null;
      setBusy(false);
    }

    if (answer.trim()) {
      messages.push({ role: 'assistant', content: answer });
      onChange(messages);
    } else {
      // keine Antwort: die Frage wieder aus dem Verlauf nehmen
      messages.pop();
    }
    renderAll();
    if (failed) bubble('error', '<p>' + inline(failed) + '</p>');
    scrollDown(true);
    if (mode === 'chat') input.focus();
  }

  /* ---- Bedienung ---- */
  quick.forEach((b) => b.addEventListener('click', () => ask({ mode: b.dataset.mode })));
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    ask({ mode: 'chat', message: text });
  });
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); }
  });
  stopBtn.addEventListener('click', () => { if (controller) controller.abort(); });
  clearBtn.addEventListener('click', () => {
    if (controller) controller.abort();
    messages = [];
    onChange(messages);
    renderAll();
  });

  renderAll();

  return {
    ask,
    setMessages(list) { if (controller) controller.abort(); messages = Array.isArray(list) ? list.slice() : []; renderAll(); },
    setConfigured(ok, model) {
      configured = ok;
      setup.hidden = ok;
      if (!ok) {
        setup.innerHTML = '<strong>Der Tutor ist noch nicht eingerichtet.</strong> Trage in der Datei <code>.env</code> die Werte <code>OMNIROUTE_API_KEY</code> und <code>OMNIROUTE_MODEL</code> ein und starte den Container neu. Alles andere funktioniert auch ohne Tutor.';
      }
      void model;
    },
    focusInput() { input.focus(); },
  };
}
