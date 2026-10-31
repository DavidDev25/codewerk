test('besuchZaehlen zählt pro Objekt', () => {
  const lea = { name: 'Lea' };
  const tom = { name: 'Tom' };
  expect(besuche, 'const besuche = new WeakMap();').toBeInstanceOf(WeakMap);
  expect(besuchZaehlen(lea)).toBe(1);
  expect(besuchZaehlen(lea), 'besuche.set(nutzer, (besuche.get(nutzer) ?? 0) + 1)').toBe(2);
  expect(besuchZaehlen(tom)).toBe(1);
});

test('Gleich aussehende Objekte sind verschiedene Schlüssel', () => {
  expect(besuchZaehlen({ name: 'Mia' })).toBe(1);
  expect(besuchZaehlen({ name: 'Mia' }), 'Ein neues Objekt ist ein neuer Schlüssel, auch mit gleichem Inhalt.').toBe(1);
});

test('sperren und istGesperrt arbeiten mit einem WeakSet', () => {
  const ben = {};
  expect(gesperrt, 'const gesperrt = new WeakSet();').toBeInstanceOf(WeakSet);
  expect(istGesperrt(ben)).toBe(false);
  sperren(ben);
  expect(istGesperrt(ben), 'gesperrt.add(nutzer) und gesperrt.has(nutzer)').toBe(true);
});

test('objektCache rechnet pro Objekt nur einmal', () => {
  let aufrufe = 0;
  const groesse = objektCache((obj) => { aufrufe++; return Object.keys(obj).length; });
  const a = { x: 1, y: 2 };
  expect(groesse(a)).toBe(2);
  expect(groesse(a)).toBe(2);
  expect(groesse({ z: 1 })).toBe(1);
  expect(aufrufe, 'Schau zuerst mit speicher.has(obj) in der WeakMap nach.').toBe(2);
});

test('objektCache nutzt eine WeakMap', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  const rumpf = code.slice(code.search(/function\s+objektCache/));
  expect(rumpf, 'Lege in objektCache eine new WeakMap() an.').toMatch(/new WeakMap\(/);
});

test('Die Uhr läuft und lässt sich stoppen', async () => {
  let takte = 0;
  const uhr = new Uhr(() => takte++);
  uhr.start();
  await wait(60);
  expect(takte > 0, 'Die Uhr soll erst einmal laufen.').toBe(true);
  expect(typeof uhr.stop, 'Ergänze in der Klasse eine Methode stop().').toBe('function');
  uhr.stop();
  const stand = takte;
  await wait(60);
  expect(takte, 'In start(): this.id = setInterval(…); in stop(): clearInterval(this.id);').toBe(stand);
});
