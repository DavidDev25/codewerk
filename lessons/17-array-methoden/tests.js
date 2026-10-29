test('`namen` enthält alle Produktnamen', () => {
  expect(namen, 'Nutze produkte.map((p) => p.name).').toEqual(['Apfel', 'Brot', 'Banane', 'Kuchen', 'Milch']);
});

test('`obst` enthält nur Apfel und Banane', () => {
  expect(obst, 'Nutze produkte.filter((p) => p.kategorie === "Obst").').toHaveLength(2);
  expect(obst.map((p) => p.name)).toEqual(['Apfel', 'Banane']);
});

test('`gesamt` ist 16', () => {
  expect(gesamt, 'Nutze reduce((summe, p) => summe + p.preis, 0). Die 0 am Ende ist der Startwert.').toBe(16);
});

test('`kuchen` ist das Kuchen-Objekt aus der Liste', () => {
  expect(kuchen, 'Nutze produkte.find((p) => p.name === "Kuchen").').toBe(produkte[3]);
});

test('`guenstig` enthält die Namen bis 2 €', () => {
  expect(guenstig, 'Erst filter((p) => p.preis <= 2), dann .map((p) => p.name).').toEqual(['Apfel', 'Banane', 'Milch']);
});

test('Du nutzt Array-Methoden statt Schleifen', () => {
  expect(source(), 'Schreibe die Lösung mit map, filter, reduce und find – ohne for-Schleife.').not.toMatch(/\bfor\s*\(/);
  expect(source()).toMatch(/\.reduce\(/);
});

test('Die ursprüngliche Liste bleibt unverändert', () => {
  expect(produkte, 'Array-Methoden liefern neue Arrays. produkte selbst sollte gleich bleiben.').toHaveLength(5);
});
