test('teilen(10, 2) ergibt weiterhin 5', () => {
  expect(teilen(10, 2), 'Gib im Normalfall a / b zurück.').toBe(5);
});

test('teilen(1, 0) wirft einen Fehler', () => {
  expect(() => teilen(1, 0), 'Prüfe mit if (b === 0) und schreibe darin throw new Error("…");').toThrow();
});

test('Der Fehler hat den richtigen Text', () => {
  let meldung = '';
  try { teilen(1, 0); } catch (fehler) { meldung = fehler.message; }
  expect(meldung, 'Der Text muss genau "Durch 0 kann man nicht teilen." sein.').toBe('Durch 0 kann man nicht teilen.');
});

test('sicherTeilen(9, 3) ergibt 3', () => {
  expect(sicherTeilen(9, 3), 'Rufe im try-Block return teilen(a, b); auf.').toBe(3);
});

test('sicherTeilen(10, 0) fängt den Fehler ab', () => {
  expect(sicherTeilen(10, 0), 'Gib im catch-Block "Fehler: " + fehler.message zurück.').toBe('Fehler: Durch 0 kann man nicht teilen.');
});

test('`ergebnis` wird ausgegeben', () => {
  expect(ergebnis, 'Lege const ergebnis = sicherTeilen(10, 0); an.').toBe('Fehler: Durch 0 kann man nicht teilen.');
  expect(output(), 'Gib ergebnis mit console.log(ergebnis); aus.').toContain('Fehler: Durch 0 kann man nicht teilen.');
});
