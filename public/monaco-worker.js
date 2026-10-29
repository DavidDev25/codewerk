/* Hintergrund-Worker für Monaco (Syntaxprüfung, Autovervollständigung).
   Alles kommt aus dem eigenen Server – kein CDN. */
self.MonacoEnvironment = { baseUrl: '/vendor/monaco/' };
importScripts('/vendor/monaco/vs/base/worker/workerMain.js');
