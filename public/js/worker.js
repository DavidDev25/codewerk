/* ==========================================================================
   worker.js – Hier läuft der Code der Lernenden, getrennt von der Seite.

   Ein Web Worker hat keinen Zugriff auf die Seite (kein document, kein
   localStorage, keine Cookies). Zusätzlich schalten wir unten alles ab, womit
   man Netzwerkanfragen stellen könnte. Der Timeout (Endlosschleifen) wird in
   runner.js erzwungen: Dort wird der Worker notfalls hart beendet.
   ========================================================================== */
importScripts('/vendor/acorn/acorn.js', '/js/core.js');

['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'indexedDB',
  'caches', 'BroadcastChannel', 'SharedWorker', 'Worker'].forEach(function (name) {
  try { self[name] = undefined; } catch (e) { /* nicht überschreibbar: ignorieren */ }
});

// Nicht abgefangene Promise-Fehler (z. B. reject ohne catch) als Fehler des Nutzercodes melden
self.addEventListener('unhandledrejection', function (event) {
  event.preventDefault();
  self.CW.asyncError(event.reason);
});

self.onmessage = function (event) {
  self.CW.runLesson(event.data).then(function (result) {
    self.postMessage(result);
  }, function (e) {
    self.postMessage({ crashed: 'Interner Fehler beim Ausführen: ' + (e && e.message ? e.message : String(e)) });
  });
};
