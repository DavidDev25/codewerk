test('stadtVon findet die Stadt', () => {
  expect(stadtVon(komplett), 'bestellung.kunde?.adresse?.stadt').toBe('Erlangen');
});

test('stadtVon stürzt bei fehlender Adresse nicht ab', () => {
  expect(stadtVon(lueckenhaft), 'Ohne Adresse: … ?? "unbekannt"').toBe('unbekannt');
});

test('stadtVon klappt sogar ohne Kunde', () => {
  expect(stadtVon({}), 'Auch hinter kunde braucht es ?., denn kunde kann fehlen.').toBe('unbekannt');
});

test('rabattVon behält einen Rabatt von 0', () => {
  expect(rabattVon(komplett), 'Mit || würde aus 0 eine 10. Nimm ??.').toBe(0);
});

test('rabattVon nimmt 10, wenn kein Rabatt angegeben ist', () => {
  expect(rabattVon(lueckenhaft), 'bestellung.rabatt ?? 10').toBe(10);
  expect(rabattVon({ rabatt: 25 })).toBe(25);
});

test('anzahlArtikel zählt die Artikel', () => {
  expect(anzahlArtikel(komplett), 'bestellung.artikel?.length').toBe(2);
});

test('anzahlArtikel ohne Artikel ist 0', () => {
  expect(anzahlArtikel(lueckenhaft), 'bestellung.artikel?.length ?? 0').toBe(0);
});
