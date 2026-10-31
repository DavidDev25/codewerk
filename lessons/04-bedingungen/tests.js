test('kleidung: unter 10 Grad gibt es die Jacke', () => {
  expect(kleidung(5), 'if (grad < 10) { return "Jacke"; }').toBe('Jacke');
  expect(kleidung(-3)).toBe('Jacke');
});

test('kleidung: von 10 bis unter 20 Grad den Pulli', () => {
  expect(kleidung(10), 'Bei genau 10 Grad ist es nicht mehr „unter 10“. Nutze else if (grad < 20).').toBe('Pulli');
  expect(kleidung(19)).toBe('Pulli');
});

test('kleidung: ab 20 Grad das T-Shirt', () => {
  expect(kleidung(20), 'Der else-Zweig fängt alles andere auf.').toBe('T-Shirt');
  expect(kleidung(31)).toBe('T-Shirt');
});

test('darfRein: ab 18 immer', () => {
  expect(darfRein(18, false), 'alter >= 18 || (…)').toBe(true);
  expect(darfRein(40, true)).toBe(true);
});

test('darfRein: mit 16 oder 17 nur mit Eltern', () => {
  expect(darfRein(16, true), 'alter >= 16 && mitEltern').toBe(true);
  expect(darfRein(17, false), 'Ohne Eltern reicht 17 nicht.').toBe(false);
});

test('darfRein: unter 16 nie', () => {
  expect(darfRein(15, true), 'Auch mit Eltern muss man mindestens 16 sein.').toBe(false);
});

test('anrede begrüßt mit Namen', () => {
  expect(anrede('Mara'), 'Format: Hallo Mara!').toBe('Hallo Mara!');
});

test('anrede begrüßt ohne Namen den Gast', () => {
  expect(anrede(''), 'Ein leerer Text zählt als falsch: name ? … : "Hallo Gast!"').toBe('Hallo Gast!');
});

test('anrede nutzt den Bedingungsoperator ? :', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code, 'Schreibe die Entscheidung in anrede als name ? … : ….').toMatch(/\?[^:]+:/);
});
