test('`gesamt` ist 13.5', () => {
  expect(gesamt, 'Multiplizieren geht mit *: preis * anzahl.').toBe(13.5);
});

test('`istGerade` ist false, weil 3 ungerade ist', () => {
  expect(typeof istGerade, 'Ein Vergleich mit === ergibt true oder false.').toBe('boolean');
  expect(istGerade, 'anzahl % 2 ist der Rest beim Teilen durch 2. Gerade Zahlen haben den Rest 0.').toBe(false);
});

test('`trinkgeld` ist die Zahl 2', () => {
  expect(typeof trinkgeld, 'Wandle den Text mit Number(eingabe) in eine Zahl um.').toBe('number');
  expect(trinkgeld).toBe(2);
});

test('`bezahlt` ist 15.5 und eine Zahl', () => {
  expect(bezahlt, 'Kommt "13.52" heraus? Dann wurde Text zusammengeklebt. Rechne mit trinkgeld, nicht mit eingabe.').toBe(15.5);
});

test('`typVonEingabe` ist "string"', () => {
  expect(typVonEingabe, 'Schreibe typeof eingabe.').toBe('string');
});

test('`bezahlt` wird ausgegeben', () => {
  expect(output(), 'Schreibe console.log(bezahlt);').toContain('15.5');
});
