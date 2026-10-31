const fange = (fn) => { try { fn(); } catch (e) { return e; } return null; };

test('Es gibt einen @typedef für Posten', () => {
  expect(source(), '/** @typedef {Object} Posten … */').toMatch(/@typedef\s+\{Object\}\s+Posten/);
  expect(source(), '@property {string} name').toMatch(/@property\s+\{string\}\s+name/);
  expect(source(), '@property {number} preis').toMatch(/@property\s+\{number\}\s+preis/);
  expect(source(), '@property {number} menge').toMatch(/@property\s+\{number\}\s+menge/);
});

test('rechnungsSumme ist beschrieben', () => {
  expect(source(), '@param {Posten[]} posten').toMatch(/@param\s+\{Posten\[\]\}\s+posten/);
  expect(source(), '@returns {number}').toMatch(/@returns?\s+\{number\}/);
});

test('mussZahlSein lässt Zahlen durch', () => {
  expect(fange(() => mussZahlSein(3.5, 'preis')), 'Bei einer echten Zahl passiert nichts.').toBeNull();
});

test('mussZahlSein lehnt Texte, NaN und Unendlich ab', () => {
  const f = fange(() => mussZahlSein('3', 'preis'));
  expect(f, 'if (typeof wert !== "number" || !Number.isFinite(wert)) throw new TypeError(…)').toBeInstanceOf(TypeError);
  expect(f.message).toBe('preis muss eine Zahl sein');
  expect(fange(() => mussZahlSein(NaN, 'x'))).toBeInstanceOf(TypeError);
  expect(fange(() => mussZahlSein(Infinity, 'x'))).toBeInstanceOf(TypeError);
});

test('rechnungsSumme rechnet', () => {
  expect(rechnungsSumme([{ name: 'Brot', preis: 3, menge: 2 }, { name: 'Milch', preis: 1.5, menge: 4 }])).toBe(12);
  expect(rechnungsSumme([])).toBe(0);
});

test('rechnungsSumme prüft die Posten', () => {
  const f = fange(() => rechnungsSumme([{ name: 'Milch', preis: '1.5', menge: 1 }]));
  expect(f, 'Rufe für jeden Posten mussZahlSein(p.preis, "preis") und mussZahlSein(p.menge, "menge") auf.').toBeInstanceOf(TypeError);
  expect(fange(() => rechnungsSumme([{ name: 'Brot', preis: 3, menge: undefined }]))).toBeInstanceOf(TypeError);
});
