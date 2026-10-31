test('durchschnitt rechnet richtig', () => {
  expect(durchschnitt([2, 4, 6]), 'Logge i und zahlen[i] in der Schleife. Was ist beim letzten Durchlauf?').toBe(4);
  expect(durchschnitt([5])).toBe(5);
});

test('istGleich vergleicht streng', () => {
  expect(istGleich(5, 5)).toBe(true);
  expect(istGleich(5, '5'), 'Zwei Gleichheitszeichen wandeln Typen um. Wie vergleichst du streng?').toBe(false);
  expect(istGleich(0, false)).toBe(false);
});

test('sortiertKopie liefert eine sortierte Kopie', () => {
  expect(sortiertKopie([3, 1, 2])).toEqual([1, 2, 3]);
});

test('sortiertKopie lässt das Original in Ruhe', () => {
  const original = [3, 1, 2];
  sortiertKopie(original);
  expect(original, 'sort verändert das Array, auf dem es aufgerufen wird. Welche Methode macht eine Kopie?').toEqual([3, 1, 2]);
});

test('letzter liefert das letzte Element', () => {
  expect(letzter(['a', 'b', 'c']), 'Bei 3 Elementen sind die Positionen 0, 1 und 2.').toBe('c');
  expect(letzter([7])).toBe(7);
});

test('Die Funktionen wurden repariert, nicht ersetzt', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code, 'Behalte die Schleife in durchschnitt und repariere nur die Bedingung.').toMatch(/for\s*\(let i = 0; i < zahlen\.length; i\+\+\)/);
});
