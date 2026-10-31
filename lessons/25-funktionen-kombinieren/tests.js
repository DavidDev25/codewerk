test('addiere ist gecurryt', () => {
  expect(typeof addiere(2), 'addiere(2) gibt eine Funktion zurück: const addiere = (a) => (b) => a + b;').toBe('function');
  expect(addiere(2)(3)).toBe(5);
});

test('plusZehn addiert 10', () => {
  expect(plusZehn(5), 'const plusZehn = addiere(10);').toBe(15);
});

test('pipe schaltet Funktionen hintereinander', () => {
  const rechnen = pipe((x) => x + 1, (x) => x * 2, (x) => `Ergebnis: ${x}`);
  expect(rechnen(4), 'Erst +1, dann ·2, dann Text: (4 + 1) · 2 = 10. Nutze reduce.').toBe('Ergebnis: 10');
});

test('pipe ohne Funktionen gibt den Wert zurück', () => {
  expect(pipe()(7), 'reduce mit Startwert wert liefert bei leerer Liste einfach wert.').toBe(7);
});

test('merken rechnet jeden Wert nur einmal', () => {
  let aufrufe = 0;
  const teuer = merken((x) => { aufrufe++; return x * 3; });
  expect(teuer(5)).toBe(15);
  expect(teuer(5)).toBe(15);
  expect(teuer(6)).toBe(18);
  expect(aufrufe, 'Prüfe zuerst speicher.has(wert). Nur wenn nicht: berechnen und speicher.set(…).').toBe(2);
});

test('Zwei gemerkte Funktionen haben getrennte Speicher', () => {
  const a = merken((x) => x + 1);
  const b = merken((x) => x + 100);
  a(1);
  expect(b(1), 'Lege die Map innerhalb von merken an, nicht ganz oben im Programm.').toBe(101);
});

test('fibSchnell rechnet richtig', () => {
  expect([0, 1, 2, 3, 4, 5, 6, 10].map((n) => fibSchnell(n)), 'Bis 1 ist fib(n) = n, sonst fibSchnell(n - 1) + fibSchnell(n - 2).').toEqual([0, 1, 1, 2, 3, 5, 8, 55]);
});

test('fibSchnell(60) ist sofort fertig', () => {
  expect(fibSchnell(60), 'Ohne merken würde das Stunden dauern. Rufe innen fibSchnell auf, nicht die ungemerkte Funktion.').toBe(1548008755920);
});
