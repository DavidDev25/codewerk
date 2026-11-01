test('durchschnitt rechnet und rundet auf eine Stelle', () => {
  expect(durchschnitt([1, 2, 2]), 'Summe mit reduce, geteilt durch noten.length, dann Math.round(wert * 10) / 10.').toBe(1.7);
  expect(durchschnitt([3, 4, 3, 2])).toBe(3);
  expect(durchschnitt([2])).toBe(2);
});

test('bewertung: sehr gut und gut', () => {
  expect(bewertung(1.0)).toBe('sehr gut');
  expect(bewertung(1.5), 'Bei „bis 1.5“ gehört 1.5 noch dazu. Nimm deshalb <=.').toBe('sehr gut');
  expect(bewertung(1.6)).toBe('gut');
  expect(bewertung(2.5)).toBe('gut');
});

test('bewertung: befriedigend und ausreichend', () => {
  expect(bewertung(3.0)).toBe('befriedigend');
  expect(bewertung(3.5)).toBe('befriedigend');
  expect(bewertung(4.5)).toBe('ausreichend');
});

test('bewertung: nicht bestanden', () => {
  expect(bewertung(4.6), 'Alles über 4.5 fängt der else-Zweig.').toBe('nicht bestanden');
});

test('zeugnis erstellt eine Zeile pro Person', () => {
  const z = zeugnis(klasse);
  expect(z, 'Nutze klasse.map(({ name, noten }) => …).').toHaveLength(4);
  expect(z[0], 'Format: Lea: 1.7 (gut)').toBe('Lea: 1.7 (gut)');
});

test('zeugnis hat für alle das richtige Format', () => {
  expect(zeugnis(klasse)).toEqual([
    'Lea: 1.7 (gut)',
    'Tom: 3 (befriedigend)',
    'Ben: 4.7 (nicht bestanden)',
    'Mia: 1.3 (sehr gut)',
  ]);
});

test('bester findet Mia', () => {
  expect(bester(klasse), 'Sortiere eine Kopie nach durchschnitt (aufsteigend) und nimm den ersten Namen.').toBe('Mia');
});

test('bester klappt mit anderen Klassen', () => {
  expect(bester([{ name: 'A', noten: [3] }, { name: 'B', noten: [2] }])).toBe('B');
});

test('bester verändert die Reihenfolge der Klasse nicht', () => {
  bester(klasse);
  expect(klasse[0].name, 'sort verändert das Original. Sortiere eine Kopie: [...klasse].sort(…)').toBe('Lea');
});

test('notenSpiegel zählt alle Noten', () => {
  expect(notenSpiegel(klasse), 'Gehe durch alle Personen und alle Noten und zähle in einem Objekt: spiegel[note] = (spiegel[note] ?? 0) + 1;').toEqual({ 1: 4, 2: 4, 3: 2, 4: 2, 5: 2 });
});
