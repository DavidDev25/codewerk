const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('summe([1, 2, 3]) ergibt 6', () => {
  expect(summe([1, 2, 3]), 'Starte mit let ergebnis = 0 und addiere in der Schleife jede Zahl dazu.').toBe(6);
});

test('summe([]) ergibt 0', () => {
  expect(summe([])).toBe(0);
});

test('nurGrosse([5, 12, 8, 30]) ergibt [12, 30]', () => {
  expect(nurGrosse([5, 12, 8, 30]), 'Prüfe in der Schleife mit if (zahl > 10) und hänge die Zahl mit push an.').toEqual([12, 30]);
});

test('nurGrosse([1, 2]) ergibt ein leeres Array', () => {
  expect(nurGrosse([1, 2])).toEqual([]);
});

test('einsBis(4) ergibt [1, 2, 3, 4]', () => {
  expect(einsBis(4), 'for (let i = 1; i <= n; i++) { … push(i) … }').toEqual([1, 2, 3, 4]);
});

test('einsBis(0) ergibt ein leeres Array', () => {
  expect(einsBis(0)).toEqual([]);
});

test('ersteNegative findet die erste negative Zahl', () => {
  expect(ersteNegative([3, 8, -2, 5, -9]), 'Sobald zahl < 0 ist: return zahl; (oder merken und break).').toBe(-2);
});

test('ersteNegative gibt null zurück, wenn es keine gibt', () => {
  expect(ersteNegative([1, 2, 3]), 'Nach der Schleife: return null;').toBeNull();
  expect(ersteNegative([])).toBeNull();
});

test('verdoppelnBis zählt die Verdopplungen', () => {
  expect(verdoppelnBis(1, 100), 'while (wert < grenze) { wert *= 2; anzahl++; }').toBe(7);
  expect(verdoppelnBis(5, 40)).toBe(3);
});

test('verdoppelnBis ist 0, wenn die Grenze schon erreicht ist', () => {
  expect(verdoppelnBis(50, 50), '„Mindestens“ heißt: bei 50 und Grenze 50 muss nicht verdoppelt werden.').toBe(0);
});

test('verdoppelnBis nutzt while', () => {
  expect(ohneKommentare(), 'Löse Aufgabe 5 mit einer while-Schleife.').toMatch(/\bwhile\s*\(/);
});
