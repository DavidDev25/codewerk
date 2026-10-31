(function () {
  'use strict';

  self.addEventListener('unhandledrejection', function (event) {
    event.preventDefault();
    self.CW.asyncError(event.reason);
  });

  let started = false;

  function liveConsole(send) {
    const forward = function (type) {
      return function () {
        send({ type: type, text: [].slice.call(arguments).map(function (a) { return typeof a === 'string' ? a : self.CW.show(a); }).join(' ') });
      };
    };
    self.console = { log: forward('log'), info: forward('log'), debug: forward('log'), warn: forward('warn'), error: forward('error'), table: forward('log'), clear: function () {}, group: function () {}, groupEnd: function () {} };
    self.addEventListener('error', function (event) {
      send({ type: 'error', text: (event.error && event.error.name ? event.error.name + ': ' : '') + event.message });
    });
  }

  self.addEventListener('message', function (event) {
    if (event.source !== self.parent || started || !event.data || event.data.type !== 'run') return;
    started = true;
    const job = event.data.job || {};
    const page = self.CW.installPage(self, job.storage);
    self.CW.runLesson({ code: job.code, files: job.files, entry: job.entry, tests: job.tests, loopGuard: true }).then(function (result) {
      result.storage = page.dump();
      self.parent.postMessage({ type: 'result', result: result }, '*');
      liveConsole(function (entry) {
        self.parent.postMessage({ type: 'log', entry: entry }, '*');
      });
      page.onChange(function () {
        self.parent.postMessage({ type: 'storage', storage: page.dump() }, '*');
      });
    }, function (e) {
      self.parent.postMessage({ type: 'result', result: { crashed: 'Interner Fehler beim Ausführen: ' + (e && e.message ? e.message : String(e)) } }, '*');
    });
  });

  self.parent.postMessage({ type: 'ready' }, '*');
})();
