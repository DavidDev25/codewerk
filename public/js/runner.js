const TIMEOUT_MS = 5000;

export function runCode(job) {
  return new Promise((resolve) => {
    let worker;
    try {
      worker = new Worker('/js/worker.js');
    } catch (e) {
      resolve({ crashed: 'Der Ausführungs-Worker konnte nicht gestartet werden: ' + e.message });
      return;
    }
    const finish = (value) => {
      clearTimeout(timer);
      worker.terminate();
      resolve(value);
    };
    const timer = setTimeout(() => finish({ timeout: true }), TIMEOUT_MS);
    worker.onmessage = (e) => finish(e.data);
    worker.onerror = (e) => finish({ crashed: e.message || 'Unbekannter Fehler im Worker.' });
    worker.postMessage(job);
  });
}

const PAGE_SCRIPTS = ['/vendor/acorn/acorn.js', '/js/core.js', '/js/page-runner.js'];

function pageDocument(page) {
  return '<!doctype html><html lang="de"><head><meta charset="utf-8">' +
    '<style>body{font-family:system-ui,sans-serif;margin:16px;line-height:1.5;color:#1a1a1a;background:#fff}</style></head><body>' +
    page + PAGE_SCRIPTS.map((src) => `<script src="${src}"></script>`).join('') + '</body></html>';
}

const runs = new Set();

window.addEventListener('message', (e) => {
  if (!e.data) return;
  for (const run of runs) {
    if (e.source !== run.frame.contentWindow) continue;
    if (e.data.type === 'ready' && !run.sent) {
      run.sent = true;
      run.frame.contentWindow.postMessage({ type: 'run', job: run.job }, '*');
    } else if (e.data.type === 'result') run.finish(e.data.result);
    else if (e.data.type === 'log' && run.onLive) run.onLive({ log: e.data.entry });
    else if (e.data.type === 'storage' && run.onLive) run.onLive({ storage: e.data.storage });
    return;
  }
});

let visible = null;

export function runInPage(job, host, onLive) {
  return new Promise((resolve) => {
    const frame = document.createElement('iframe');
    frame.setAttribute('sandbox', 'allow-scripts allow-forms');
    frame.className = 'preview-frame';
    frame.title = 'Vorschau: deine Seite';
    const run = { frame, job, onLive: null, sent: false, done: false };
    const timer = setTimeout(() => run.finish({ timeout: true }), TIMEOUT_MS + 2000);
    run.finish = (value) => {
      if (run.done) return;
      run.done = true;
      clearTimeout(timer);
      if (host && !value.timeout) {
        run.onLive = onLive || null;
      } else {
        runs.delete(run);
        frame.remove();
      }
      resolve(value);
    };
    runs.add(run);
    if (host) {
      if (visible) {
        runs.delete(visible);
        if (!visible.done) visible.finish({ crashed: 'Abgebrochen, weil ein neuer Lauf gestartet wurde.' });
      }
      visible = run;
    }
    frame.srcdoc = pageDocument(job.page || '');
    if (host) host.replaceChildren(frame);
    else {
      frame.className = 'preview-frame preview-frame-unsichtbar';
      frame.setAttribute('aria-hidden', 'true');
      frame.tabIndex = -1;
      document.body.appendChild(frame);
    }
  });
}

export function clearPreview(host) {
  if (visible) {
    runs.delete(visible);
    if (!visible.done) visible.finish({ crashed: 'Abgebrochen.' });
    visible = null;
  }
  if (host) host.replaceChildren();
}

export const TIMEOUT_SECONDS = TIMEOUT_MS / 1000;
