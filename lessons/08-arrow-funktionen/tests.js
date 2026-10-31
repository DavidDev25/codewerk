const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('quadrat(5) ergibt 25', () => {
  expect(quadrat(5), 'const quadrat = (x) => x * x;').toBe(25);
});

test('istVolljaehrig prüft das Alter', () => {
  expect(istVolljaehrig(18), 'Mindestens 18 heißt >= 18.').toBe(true);
  expect(istVolljaehrig(17)).toBe(false);
});

test('begruessen mit Namen', () => {
  expect(begruessen('Mara'), 'Format: Hallo Mara!').toBe('Hallo Mara!');
});

test('begruessen ohne Namen nutzt den Standardwert', () => {
  expect(begruessen(), 'Gib dem Parameter einen Standardwert: (name = "Gast") => …').toBe('Hallo Gast!');
});

test('zweimal(quadrat, 3) ergibt 81', () => {
  expect(zweimal(quadrat, 3), 'Erst fn(wert), dann fn auf dieses Ergebnis: fn(fn(wert)).').toBe(81);
});

test('zweimal klappt mit jeder Funktion', () => {
  expect(zweimal((x) => x + 10, 1), 'zweimal darf nicht fest quadrat benutzen, sondern die übergebene Funktion fn.').toBe(21);
});

test('Alle vier sind Arrow-Funktionen', () => {
  const code = ohneKommentare();
  ['quadrat', 'istVolljaehrig', 'begruessen', 'zweimal'].forEach((name) => {
    expect(code, `Schreibe ${name} als const ${name} = (…) => …`).toMatch(new RegExp('const\\s+' + name + '\\s*=\\s*(\\([^)]*\\)|\\w+)\\s*=>'));
  });
});
