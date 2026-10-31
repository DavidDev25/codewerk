test('initialen("mara", "schulz") ergibt "M.S."', () => {
  expect(initialen('mara', 'schulz'), 'Nimm vorname[0] und nachname[0], mach sie mit toUpperCase() groß und setze Punkte dahinter.').toBe('M.S.');
});

test('initialen klappt auch mit großen Anfangsbuchstaben', () => {
  expect(initialen('Ali', 'Yilmaz')).toBe('A.Y.');
});

test('bereinigen entfernt Leerzeichen und macht alles klein', () => {
  expect(bereinigen('  Mara@Beispiel.de '), 'return text.trim().toLowerCase();').toBe('mara@beispiel.de');
});

test('istBild erkennt .png und .jpg', () => {
  expect(istBild('urlaub.png'), 'Nutze endsWith(".png") || endsWith(".jpg").').toBe(true);
  expect(istBild('katze.jpg')).toBe(true);
});

test('istBild ignoriert Groß- und Kleinschreibung', () => {
  expect(istBild('FOTO.JPG'), 'Mach den Namen vorher mit toLowerCase() klein.').toBe(true);
});

test('istBild lehnt andere Dateien ab', () => {
  expect(istBild('lebenslauf.pdf')).toBe(false);
  expect(istBild('png-anleitung.txt'), '„png“ steht hier zwar im Namen, aber nicht am Ende.').toBe(false);
});

test('kuerzen lässt kurze Texte unverändert', () => {
  expect(kuerzen('Hallo', 10)).toBe('Hallo');
  expect(kuerzen('Hallo', 5), 'Genau max Zeichen sind noch erlaubt.').toBe('Hallo');
});

test('kuerzen schneidet lange Texte ab und hängt … an', () => {
  expect(kuerzen('Codewerk ist super', 8), 'text.slice(0, max) + "…"').toBe('Codewerk…');
});
