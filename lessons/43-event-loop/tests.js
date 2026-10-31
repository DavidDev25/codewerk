test('Die Vorhersage stimmt', () => {
  expect(vorhersage, 'Erst normaler Code, dann alle Microtasks (then, queueMicrotask) in Reihenfolge, zuletzt der Timer.').toEqual(['Y', 'X', 'Z', 'W']);
});

test('Die Ausgabe hat wirklich diese Reihenfolge', () => {
  expect(output().filter((t) => ['W', 'X', 'Y', 'Z'].includes(t)), 'Lass den Code oben unverändert.').toEqual(['Y', 'X', 'Z', 'W']);
});

test('einplanen trägt sync, micro und task richtig ein', async () => {
  const log = [];
  einplanen(log);
  expect(log, 'Nur "sync" gehört sofort ins Array.').toEqual(['sync']);
  await wait(20);
  expect(log, 'queueMicrotask(() => log.push("micro")) und setTimeout(() => log.push("task"), 0)').toEqual(['sync', 'micro', 'task']);
});

test('einplanen plant den Timer zuerst ein', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const rumpf = code.slice(code.search(/function\s+einplanen/));
  expect(rumpf.search(/setTimeout/) < rumpf.search(/queueMicrotask|then\(/), 'Schreibe setTimeout vor queueMicrotask – die Reihenfolge entsteht trotzdem durch den Event Loop.').toBe(true);
});

test('zerlegen verdoppelt alle Zahlen und meldet sich am Ende', async () => {
  let ergebnis = null;
  const r = zerlegen([1, 2, 3], (fertig) => { ergebnis = fertig; });
  expect(r, 'zerlegen gibt nichts zurück, das Ergebnis kommt über fertig(…).').toBeUndefined();
  expect(ergebnis, 'Die Arbeit soll in Tasks passieren, also noch nicht sofort fertig sein.').toBeNull();
  await wait(100);
  expect(ergebnis).toEqual([2, 4, 6]);
});

test('zerlegen arbeitet Stück für Stück', async () => {
  const fortschritt = [];
  const liste = [5, 6, 7];
  let fertigGemeldet = false;
  zerlegen(liste, () => { fertigGemeldet = true; });
  await new Promise((r) => setTimeout(r, 0));
  fortschritt.push(fertigGemeldet);
  await wait(100);
  expect(fortschritt, 'Plane jedes Element mit setTimeout(…, 0) als eigenen Task ein, nicht alle in einer Schleife.').toEqual([false]);
  expect(fertigGemeldet).toBe(true);
});

test('zerlegen kommt mit leeren Listen klar', async () => {
  let ergebnis = null;
  zerlegen([], (fertig) => { ergebnis = fertig; });
  await wait(30);
  expect(ergebnis).toEqual([]);
});
