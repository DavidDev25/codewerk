const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('`geteilt` ist true', () => {
  expect(geteilt, 'minka.miau === felix.miau').toBe(true);
});

test('`eigene` enthält nur den Namen', () => {
  expect(eigene, 'Object.keys(minka) – miau wohnt auf dem Prototyp, nicht im Objekt.').toEqual(['name']);
});

test('`istPrototyp` ist true', () => {
  expect(istPrototyp, 'Object.getPrototypeOf(minka) === Katze.prototype').toBe(true);
});

test('Punkt speichert x und y', () => {
  const p = new Punkt(3, 4);
  expect(p.x, 'this.x = x; this.y = y;').toBe(3);
  expect(p.y).toBe(4);
});

test('Punkt ist eine Konstruktorfunktion, keine Klasse', () => {
  expect(ohneKommentare(), 'Schreibe function Punkt(x, y) { … } statt class Punkt.').toMatch(/function\s+Punkt\s*\(/);
});

test('abstand() von (3, 4) ist 5', () => {
  expect(new Punkt(3, 4).abstand(), 'Math.sqrt(this.x ** 2 + this.y ** 2)').toBe(5);
  expect(new Punkt(0, 0).abstand()).toBe(0);
  expect(new Punkt(6, 8).abstand()).toBe(10);
});

test('abstand liegt auf dem Prototyp', () => {
  const p = new Punkt(1, 1);
  expect(Object.hasOwn(p, 'abstand'), 'Lege die Methode mit Punkt.prototype.abstand = function () { … } an, nicht im Konstruktor.').toBe(false);
  expect(typeof Punkt.prototype.abstand).toBe('function');
});
