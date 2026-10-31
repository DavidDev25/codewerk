test('`sorten` enthält alle vier Sorten', () => {
  expect(sorten, 'Object.keys(lager)').toEqual(['aepfel', 'birnen', 'kirschen', 'pflaumen']);
});

test('`gesamt` ist 19', () => {
  expect(gesamt, 'Object.values(lager).reduce((summe, menge) => summe + menge, 0)').toBe(19);
});

test('`ausverkauft` sind Birnen und Pflaumen', () => {
  expect(ausverkauft, 'Object.entries(lager).filter(([, menge]) => menge === 0).map(([sorte]) => sorte)').toEqual(['birnen', 'pflaumen']);
});

test('verdoppeln verdoppelt jeden Wert', () => {
  expect(verdoppeln(lager), 'Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, v * 2]))').toEqual({ aepfel: 24, birnen: 0, kirschen: 14, pflaumen: 0 });
});

test('verdoppeln klappt mit jedem Objekt', () => {
  expect(verdoppeln({ a: 1, b: 2.5 })).toEqual({ a: 2, b: 5 });
});

test('verdoppeln verändert das Original nicht', () => {
  verdoppeln(lager);
  expect(lager.aepfel, 'Baue ein neues Objekt, statt die Werte in obj zu überschreiben.').toBe(12);
});
