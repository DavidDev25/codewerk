test('`rechner` ist ein Objekt mit genau zwei Funktionen', () => {
  expect(typeof rechner, 'const rechner = (() => { … return { addiere, letzteRechnung }; })();').toBe('object');
  expect(Object.keys(rechner).sort(), 'Gib nur addiere und letzteRechnung zurück.').toEqual(['addiere', 'letzteRechnung']);
});

test('Vor der ersten Rechnung gibt es keine letzte Rechnung', () => {
  expect(rechner.letzteRechnung(), 'Ist verlauf leer, gib null zurück.').toBeNull();
});

test('addiere rechnet und merkt sich die Rechnung', () => {
  expect(rechner.addiere(2, 3)).toBe(5);
  expect(rechner.letzteRechnung(), 'Format: 2 + 3 = 5').toBe('2 + 3 = 5');
  rechner.addiere(10, 4);
  expect(rechner.letzteRechnung()).toBe('10 + 4 = 14');
});

test('`verlauf` ist privat', () => {
  expect(typeof verlauf, 'Lege verlauf innerhalb der Klammer-Funktion an, nicht ganz oben.').toBe('undefined');
  expect(rechner.verlauf, 'verlauf darf nicht im zurückgegebenen Objekt stehen.').toBeUndefined();
});

test('`addiere` wurde per Destructuring „importiert“', () => {
  expect(addiere, 'const { addiere } = rechner;').toBe(rechner.addiere);
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code).toMatch(/const\s*\{\s*addiere\s*\}\s*=\s*rechner/);
});

test('Das „importierte“ addiere schreibt in denselben Verlauf', () => {
  addiere(1, 1);
  expect(rechner.letzteRechnung()).toBe('1 + 1 = 2');
});
