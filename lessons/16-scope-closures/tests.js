test('zaehlerErstellen gibt eine Funktion zurück', () => {
  expect(typeof zaehlerErstellen(), 'return () => { … };').toBe('function');
});

test('Der Zähler zählt 1, 2, 3', () => {
  const z = zaehlerErstellen();
  expect(z(), 'Lege let stand = 0; in zaehlerErstellen an, nicht in der inneren Funktion.').toBe(1);
  expect(z()).toBe(2);
  expect(z()).toBe(3);
});

test('Zwei Zähler sind unabhängig', () => {
  const a = zaehlerErstellen();
  const b = zaehlerErstellen();
  a();
  a();
  expect(b(), 'Liegt stand außerhalb von zaehlerErstellen? Dann teilen sich alle Zähler eine Variable.').toBe(1);
  expect(a()).toBe(3);
});

test('begruesser baut Grußfunktionen', () => {
  const moin = begruesser('Moin');
  expect(typeof moin, 'begruesser gibt eine Funktion zurück: return (name) => …').toBe('function');
  expect(moin('Lea'), 'Format: Moin, Lea!').toBe('Moin, Lea!');
  expect(begruesser('Servus')('Ben')).toBe('Servus, Ben!');
});

test('Das Konto startet mit dem Startwert', () => {
  const konto = kontoErstellen(50);
  expect(typeof konto.stand, 'Gib ein Objekt zurück: return { einzahlen(betrag) { … }, stand() { … } };').toBe('function');
  expect(konto.stand()).toBe(50);
});

test('einzahlen erhöht den Kontostand', () => {
  const konto = kontoErstellen(50);
  konto.einzahlen(20);
  konto.einzahlen(5);
  expect(konto.stand()).toBe(75);
});

test('Zwei Konten sind getrennt', () => {
  const a = kontoErstellen(0);
  const b = kontoErstellen(100);
  a.einzahlen(30);
  expect(b.stand()).toBe(100);
  expect(a.stand()).toBe(30);
});

test('Der Kontostand ist von außen nicht erreichbar', () => {
  const konto = kontoErstellen(50);
  const zahlen = Object.values(konto).filter((wert) => typeof wert === 'number');
  expect(zahlen, 'Das Objekt soll nur die beiden Funktionen enthalten. Der Stand lebt in einer Variable in kontoErstellen.').toHaveLength(0);
});
