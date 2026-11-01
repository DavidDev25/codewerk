const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('`alleBestanden` ist false', () => {
  expect(alleBestanden, 'noten.every((n) => n <= 4). Die 5 und die 10 sind zu schlecht.').toBe(false);
});

test('`einserDabei` ist true', () => {
  expect(einserDabei, 'noten.some((n) => n === 1)').toBe(true);
});

test('`sortiert` ist aufsteigend nach Zahlenwert', () => {
  expect(sortiert, 'Steht die 10 vorne? Dann fehlt die Vergleichsfunktion: .sort((a, b) => a - b)').toEqual([1, 1, 2, 2, 3, 5, 10]);
});

test('`noten` selbst ist nicht umsortiert', () => {
  expect(noten, 'sort verändert das Original. Sortiere eine Kopie: [...noten].sort(…)').toEqual([2, 1, 3, 2, 5, 1, 10]);
});

test('`positionFuenf` ist 4', () => {
  expect(positionFuenf, 'noten.indexOf(5). Gezählt wird ab 0.').toBe(4);
});

test('`namen` ist ein Array mit drei Namen', () => {
  expect(namen, 'zeile.split(", ")').toEqual(['Lea', 'Tom', 'Ben']);
});

test('`liste` ist "Lea und Tom und Ben"', () => {
  expect(liste, 'namen.join(" und ")').toBe('Lea und Tom und Ben');
});

test('Du nutzt Array-Methoden statt Schleifen', () => {
  expect(ohneKommentare(), 'Löse alles mit every, some, sort, indexOf, split und join, ohne for-Schleife.').not.toMatch(/\bfor\s*\(/);
});
