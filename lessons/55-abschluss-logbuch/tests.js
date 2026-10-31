test('zeileLesen zerlegt eine Zeile', () => {
  expect(zeileLesen('2026-10-31 02:15 FEHLER Datenbank nicht erreichbar'), 'Nutze match mit vier Gruppen und gib { datum, zeit, stufe, text } zurück.').toEqual({
    datum: '2026-10-31', zeit: '02:15', stufe: 'FEHLER', text: 'Datenbank nicht erreichbar',
  });
});

test('zeileLesen gibt null für kaputte Zeilen zurück', () => {
  expect(zeileLesen('kaputte Zeile ohne Format'), 'Passt die RegEx nicht, liefert match null. Dann return null;').toBeNull();
  expect(zeileLesen('')).toBeNull();
});

test('zeileLesen kennt nur INFO, WARNUNG und FEHLER', () => {
  expect(zeileLesen('2026-10-31 02:41 DEBUG zu viele Details'), 'Erlaube nur diese drei Stufen: (INFO|WARNUNG|FEHLER)').toBeNull();
});

test('nurFehler ist ein Generator', () => {
  expect(Object.prototype.toString.call(nurFehler([])), 'function* nurFehler(zeilen) { … yield … }').toBe('[object Generator]');
});

test('nurFehler liefert die beiden Fehler', () => {
  const fehler = [...nurFehler(log)];
  expect(fehler.map((f) => f.text), 'Lies jede Zeile mit zeileLesen und gib mit yield nur die mit stufe "FEHLER" heraus.').toEqual(['Datenbank nicht erreichbar', 'Speicher voll']);
});

test('zaehleStufen zählt nur gültige Zeilen', () => {
  expect(zaehleStufen(log), 'Kaputte Zeilen und DEBUG zählen nicht mit.').toEqual({ INFO: 3, FEHLER: 2, WARNUNG: 1 });
});

test('bericht fasst die Fehler zusammen', () => {
  expect(bericht(log), 'Format: 2 Fehler, zuletzt am 31. Oktober 2026 um 02:40: Speicher voll').toBe('2 Fehler, zuletzt am 31. Oktober 2026 um 02:40: Speicher voll');
});

test('bericht klappt mit einem Fehler', () => {
  expect(bericht(['2027-01-01 00:01 FEHLER Neujahr kaputt'])).toBe('1 Fehler, zuletzt am 1. Januar 2027 um 00:01: Neujahr kaputt');
});

test('bericht ohne Fehler', () => {
  expect(bericht(['2026-10-31 02:14 INFO alles gut']), 'Gibt es keinen Fehler: "Keine Fehler"').toBe('Keine Fehler');
  expect(bericht([])).toBe('Keine Fehler');
});
