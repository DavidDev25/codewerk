const namen = (liste) => (liste || []).map((p) => p.name);

test('`nachKategorie` hat drei Gruppen', () => {
  expect(Object.keys(nachKategorie).sort(), 'Object.groupBy(produkte, (p) => p.kategorie)').toEqual(['Backwaren', 'Getränke', 'Obst']);
  expect(namen(nachKategorie.Obst)).toEqual(['Apfel', 'Birne']);
});

test('`nachPreis` ist eine Map mit günstig und teuer', () => {
  expect(nachPreis, 'Map.groupBy(produkte, (p) => p.preis < 2 ? "günstig" : "teuer")').toBeInstanceOf(Map);
  expect(namen(nachPreis.get('günstig'))).toEqual(['Apfel', 'Birne', 'Milch']);
  expect(namen(nachPreis.get('teuer')), 'Ab 2 € ist teuer: Kuchen kostet genau 2.').toEqual(['Brot', 'Kuchen']);
});

test('`beides` ist die Schnittmenge', () => {
  expect(beides, 'fussball.intersection(schwimmen)').toBeInstanceOf(Set);
  expect([...beides].sort()).toEqual(['Ali', 'Tom']);
});

test('`alle` ist die Vereinigung', () => {
  expect([...alle].sort(), 'fussball.union(schwimmen)').toEqual(['Ali', 'Ben', 'Lea', 'Mia', 'Tom']);
});

test('`nurFussball` ist die Differenz', () => {
  expect([...nurFussball].sort(), 'fussball.difference(schwimmen)').toEqual(['Ben', 'Lea']);
});

test('istTeilVon prüft Teilmengen', () => {
  expect(istTeilVon(new Set(['Tom', 'Ali']), fussball), 'return a.isSubsetOf(b);').toBe(true);
  expect(istTeilVon(new Set(['Mia']), fussball)).toBe(false);
});

test('Die Sets selbst bleiben unverändert', () => {
  expect(fussball.size).toBe(4);
  expect(schwimmen.size).toBe(3);
});
