const fange = (fn) => { try { fn(); } catch (e) { return e; } return null; };

test('GEHEIM ist ein Symbol', () => {
  expect(typeof GEHEIM, 'const GEHEIM = Symbol("geheim");').toBe('symbol');
  expect(GEHEIM.description).toBe('geheim');
});

test('verstecken speichert unsichtbar', () => {
  const o = verstecken({ name: 'Lea' }, 42);
  expect(o[GEHEIM], 'obj[GEHEIM] = wert; return obj;').toBe(42);
  expect(Object.keys(o)).toEqual(['name']);
  expect(JSON.stringify(o)).toBe('{"name":"Lea"}');
});

test('mitStandard liefert echte Werte', () => {
  const p = mitStandard({ farbe: 'blau', anzahl: 0 }, '?');
  expect(p.farbe, 'In der get-Falle: Gibt es name im Ziel (name in ziel), Reflect.get(…) zurückgeben.').toBe('blau');
  expect(p.anzahl, 'Auch 0 ist ein echter Wert. Prüfe mit in, nicht mit ||.').toBe(0);
});

test('mitStandard liefert den Standard für Fehlendes', () => {
  expect(mitStandard({}, 'unbekannt').groesse, 'Sonst: return standard;').toBe('unbekannt');
});

test('nurZahlen speichert Zahlen', () => {
  const ziel = {};
  const p = nurZahlen(ziel);
  p.punkte = 5;
  expect(ziel.punkte, 'Am Ende der set-Falle: return Reflect.set(ziel, name, wert, empfaenger);').toBe(5);
});

test('nurZahlen wirft bei anderen Werten einen TypeError', () => {
  const p = nurZahlen({});
  const f = fange(() => { p.punkte = 'viele'; });
  expect(f, 'if (typeof wert !== "number") throw new TypeError(…);').toBeInstanceOf(TypeError);
  expect(p.punkte).toBeUndefined();
});

test('protokolliert schreibt jede Änderung mit', () => {
  const log = [];
  const ziel = {};
  const p = protokolliert(ziel, log);
  p.a = 1;
  p.b = 'x';
  expect(log, 'log.push(`${String(name)}=${wert}`)').toEqual(['a=1', 'b=x']);
  expect(ziel).toEqual({ a: 1, b: 'x' });
});
