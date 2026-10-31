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
