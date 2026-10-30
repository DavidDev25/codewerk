test('Die Ausgabe lautet „Hallo Codewerk!“', () => {
  expect(output(), 'Schreibe genau console.log("Hallo Codewerk!"); – mit Ausrufezeichen.').toContain('Hallo Codewerk!');
});

test('`lieblingszahl` ist eine Zahl', () => {
  expect(typeof lieblingszahl, 'Entferne // vor der Zeile und schreibe eine Zahl ohne Anführungszeichen, z. B. const lieblingszahl = 7;').toBe('number');
});
