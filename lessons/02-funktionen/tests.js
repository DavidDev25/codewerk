test('quadrat(5) gibt 25 zurück', () => {
  expect(quadrat(5), 'Schreibe return zahl * zahl;').toBe(25);
});

test('quadrat(-3) gibt 9 zurück', () => {
  expect(quadrat(-3)).toBe(9);
});

test('begruesse("Mara") gibt "Hallo Mara!" zurück', () => {
  expect(begruesse('Mara'), 'Nutze return `Hallo ${name}!`;').toBe('Hallo Mara!');
});

test('istGerade(4) ist true', () => {
  expect(istGerade(4), 'Gerade Zahlen haben bei zahl % 2 den Rest 0.').toBe(true);
});

test('istGerade(7) ist false', () => {
  expect(istGerade(7)).toBe(false);
});
