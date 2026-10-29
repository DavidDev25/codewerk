test('Kreis und Rechteck erben von Form', () => {
  expect(new Kreis(1)).toBeInstanceOf(Form);
  expect(new Rechteck(1, 1)).toBeInstanceOf(Form);
});

test('Ein Kreis mit Radius 2 hat die Fläche π · 4', () => {
  expect(new Kreis(2).flaeche(), 'Schreibe return Math.PI * this.radius * this.radius;').toBeCloseTo(12.566, 2);
});

test('Ein Rechteck 2 × 3 hat die Fläche 6', () => {
  expect(new Rechteck(2, 3).flaeche(), 'Schreibe return this.breite * this.hoehe;').toBe(6);
});

test('beschreibe() von Form nutzt die überschriebene flaeche()', () => {
  expect(new Rechteck(2, 3).beschreibe()).toBe('Rechteck mit Fläche 6.00');
  expect(new Kreis(1).beschreibe()).toBe('Kreis mit Fläche 3.14');
});

test('gesamtFlaeche() addiert alle Flächen', () => {
  const formen = [new Rechteck(2, 3), new Rechteck(1, 1), new Kreis(1)];
  expect(gesamtFlaeche(formen), 'Gehe mit for…of durch und addiere forme.flaeche().').toBeCloseTo(10.14, 2);
});

test('gesamtFlaeche([]) ist 0', () => {
  expect(gesamtFlaeche([])).toBe(0);
});

test('gesamtFlaeche() prüft keine Typen', () => {
  expect(source(), 'Polymorphie heißt: einfach flaeche() aufrufen, ohne zu prüfen, welche Form es ist.').not.toMatch(/instanceof|typeof/);
});
