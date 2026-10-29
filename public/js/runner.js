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

export const TIMEOUT_SECONDS = TIMEOUT_MS / 1000;
