const frisch = (leben = 100) => ({ ...figur, name: 'Testheld', leben });

test('treffer zieht Leben ab', () => {
  const f = frisch();
  f.treffer(30);
  expect(f.leben, 'this.leben -= schaden;').toBe(70);
});

test('treffer lässt die Leben nicht unter 0 fallen', () => {
  const f = frisch(20);
  f.treffer(50);
  expect(f.leben, 'Nutze Math.max(0, …) oder ein if.').toBe(0);
});

test('heilen erhöht die Leben', () => {
  const f = frisch(40);
  f.heilen(25);
  expect(f.leben).toBe(65);
});

test('heilen geht höchstens bis 100', () => {
  const f = frisch(90);
  f.heilen(50);
  expect(f.leben, 'Nutze Math.min(100, …).').toBe(100);
});

test('status beschreibt die Figur', () => {
  expect(frisch(80).status(), 'Format: Testheld: 80 Leben').toBe('Testheld: 80 Leben');
});

test('Die Methoden nutzen this statt figur', () => {
  const f = frisch(50);
  f.treffer(10);
  expect(f.leben, 'Steht in treffer figur.leben? Dann ändert die Methode immer das Original. Schreibe this.leben.').toBe(40);
  expect(f.status()).toBe('Testheld: 40 Leben');
});

test('melden funktioniert ohne Objekt davor', () => {
  expect(typeof melden, 'const melden = figur.status.bind(figur);').toBe('function');
  expect(melden()).toBe(`Ritter: ${figur.leben} Leben`);
});
