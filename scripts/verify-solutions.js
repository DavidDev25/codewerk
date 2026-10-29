'use strict';
/* ==========================================================================
   verify-solutions.js – Prüft alle Lektionen, bevor du sie ausliefert.

   Aufruf:  npm run pruefen

   Für jede Lektion wird mit demselben Kern wie im Browser (public/js/core.js)
   geprüft:
     1. Die Musterlösung besteht ALLE Tests und läuft ohne Fehler.
     2. Der Startcode hat keinen Syntaxfehler, stürzt nicht ab und besteht
        NICHT schon alle Tests (sonst wäre die Aufgabe schon gelöst).
     3. Das Diagramm (Snapshot) lässt sich für die Lösung erzeugen.
   Bei einem Fehler endet das Skript mit Exit-Code 1.
   ========================================================================== */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const lessons = require('../server/lessons');

const acornSource = fs.readFileSync(path.join(ROOT, 'node_modules', 'acorn', 'dist', 'acorn.js'), 'utf8');
const coreSource = fs.readFileSync(path.join(ROOT, 'public', 'js', 'core.js'), 'utf8');

// Nicht abgefangene Promise-Fehler gehen an die gerade laufende Umgebung (wie im Worker)
let activeCtx = null;
process.on('unhandledRejection', (reason) => { if (activeCtx) activeCtx.CW.asyncError(reason); });

/** Führt Code in einer frischen, isolierten vm-Umgebung aus (wie ein frischer Worker). */
async function run(code, tests) {
  const ctx = vm.createContext({ setTimeout, clearTimeout, setInterval, clearInterval });
  vm.runInContext(acornSource, ctx);
  vm.runInContext(coreSource, ctx);
  ctx.__input = JSON.stringify({ code, tests });
  activeCtx = ctx;
  try {
    // Der synchrone Teil ist durch timeout begrenzt, der asynchrone durch das Rennen gegen 6 Sekunden.
    const pending = vm.runInContext('CW.runLesson(JSON.parse(__input)).then(JSON.stringify)', ctx, { timeout: 5000 });
    let timer;
    const json = await Promise.race([
      pending,
      new Promise((_, reject) => { timer = setTimeout(() => reject(new Error('Zeitlimit von 6 Sekunden überschritten')), 6000); }),
    ]).finally(() => clearTimeout(timer));
    return JSON.parse(json);
  } finally {
    activeCtx = null;
  }
}

const { lessons: all, problems } = lessons.loadAll();
let failures = 0;
const fail = (msg) => { failures++; console.log('   ✗ ' + msg); };

problems.forEach((p) => fail(p));

(async () => {
for (const lesson of all) {
  console.log(`\n${String(lesson.index).padStart(2, '0')} ${lesson.title}  (${lesson.id})`);

  /* 1. Musterlösung */
  let sol;
  try {
    sol = await run(lesson.solution, lesson.testsSource);
  } catch (e) {
    fail('Musterlösung brach ab: ' + e.message);
    continue;
  }
  if (sol.syntaxError) fail(`Musterlösung hat einen Syntaxfehler (Zeile ${sol.syntaxError.line}): ${sol.syntaxError.raw}`);
  else if (sol.error) fail(`Musterlösung wirft einen Fehler: ${sol.error.raw}`);
  else if (sol.testsBroken) fail(sol.testsBroken);
  else if (!sol.tests || sol.tests.length === 0) fail('Die Lektion hat keine Tests.');
  else {
    const bad = sol.tests.filter((t) => !t.ok);
    if (bad.length) bad.forEach((t) => fail(`Test fehlgeschlagen: „${t.name}“ → ${t.message}`));
    else console.log(`   ✓ Musterlösung besteht alle ${sol.tests.length} Tests`);
    if (!sol.snapshot) fail('Kein Diagramm-Snapshot erzeugt' + (sol.snapshotError ? ': ' + sol.snapshotError : ''));
    else console.log(`   ✓ Diagramm: ${sol.snapshot.variables.length} Variablen, ${sol.snapshot.order.length} Boxen`);
  }

  /* 2. Startcode */
  let start;
  try {
    start = await run(lesson.starterCode, lesson.testsSource);
  } catch (e) {
    fail('Startcode brach ab: ' + e.message);
    continue;
  }
  if (start.syntaxError) fail(`Startcode hat einen Syntaxfehler (Zeile ${start.syntaxError.line}): ${start.syntaxError.raw}`);
  else if (start.error) fail(`Startcode wirft schon beim Start einen Fehler: ${start.error.raw}`);
  else if (start.tests && start.tests.every((t) => t.ok)) fail('Der Startcode besteht schon alle Tests – die Aufgabe wäre sofort „gelöst“.');
  else console.log(`   ✓ Startcode läuft und besteht noch nicht alles (${start.tests ? start.tests.filter((t) => t.ok).length : 0}/${start.tests ? start.tests.length : 0})`);

  /* 3. Hinweise der Lektion */
  if (!lesson.tip) fail('lektion.json hat keinen „tipp“.');
}

console.log('\n' + (failures ? `✗ ${failures} Problem(e) gefunden.` : `✓ Alle ${all.length} Lektionen sind in Ordnung.`));
process.exit(failures ? 1 : 0);
})();
