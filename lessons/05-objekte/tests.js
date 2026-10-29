test('`auto` hat marke, baujahr und farbe', () => {
  expect(typeof auto.marke, 'Lege marke als Text an, z. B. marke: "VW".').toBe('string');
  expect(typeof auto.baujahr, 'baujahr ist eine Zahl, z. B. baujahr: 2015.').toBe('number');
  expect(typeof auto.farbe).toBe('string');
});

test('Die Farbe ist jetzt "rot"', () => {
  expect(auto.farbe, 'Schreibe auto.farbe = "rot";').toBe('rot');
});

test('`auto.tueren` ist 4', () => {
  expect(auto.tueren, 'Schreibe auto.tueren = 4;').toBe(4);
});

test('beschreibe() baut den Text zusammen', () => {
  expect(beschreibe({ marke: 'Opel', baujahr: 1999, farbe: 'grün' }), 'Nutze Backticks: `${fahrzeug.marke}, Baujahr …`').toBe('Opel, Baujahr 1999, grün');
});

test('beschreibe(auto) passt zu deinem Auto', () => {
  expect(beschreibe(auto)).toBe(`${auto.marke}, Baujahr ${auto.baujahr}, rot`);
});
