test('Die Liste enthält jetzt vier Einträge, Brot ist hinten', () => {
  expect(einkaufsliste, 'Nutze einkaufsliste.push("Brot");').toEqual(["Milch", "Eier", "Käse", "Brot"]);
});

test('`anzahl` ist 4', () => {
  expect(anzahl, 'Die Länge steht in einkaufsliste.length.').toBe(4);
});

test('`erstes` ist "Milch"', () => {
  expect(erstes, 'Der erste Eintrag hat die Nummer 0: einkaufsliste[0].').toBe('Milch');
});

test('`letztes` ist "Brot"', () => {
  expect(letztes, 'Der letzte Eintrag hat die Nummer einkaufsliste.length - 1.').toBe('Brot');
});

test('`hatBrot` ist true', () => {
  expect(hatBrot, 'Nutze einkaufsliste.includes("Brot").').toBe(true);
});
