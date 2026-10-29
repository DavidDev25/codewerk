// Verfügbar: test(name, fn), expect(wert, tipp?), output(), source(), capture(fn)
// Alle Variablen, Funktionen und Klassen des Nutzercodes sind direkt sichtbar.

test('Beispiel: `zahl` ist 42', () => {
  expect(zahl, 'Dieser Tipp erscheint unter der Fehlermeldung.').toBe(42);
});
