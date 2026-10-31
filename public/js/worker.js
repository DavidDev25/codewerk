importScripts('/vendor/acorn/acorn.js', '/js/core.js', '/js/node-runtime.js');

['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'indexedDB',
  'caches', 'BroadcastChannel', 'SharedWorker', 'Worker'].forEach(function (name) {
  try { self[name] = undefined; } catch (e) { }
});

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
