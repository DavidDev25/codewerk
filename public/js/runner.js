/* runner.js – startet pro Ausführung einen frischen Worker und erzwingt ein Zeitlimit. */

const TIMEOUT_MS = 5000;

/**
 * @param {{code: string, tests?: string|null}} job
 * @returns {Promise<object>} Ergebnis von CW.runLesson – oder { timeout: true } / { crashed: "…" }
 */
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
