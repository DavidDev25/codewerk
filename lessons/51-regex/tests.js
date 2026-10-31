test('istPlz erkennt Postleitzahlen', () => {
  expect(istPlz('90459'), '/^\\d{5}$/.test(text)').toBe(true);
  expect(istPlz('01067')).toBe(true);
});

test('istPlz lehnt alles andere ab', () => {
  expect(istPlz('9045'), 'Genau fünf: \\d{5}').toBe(false);
  expect(istPlz('904590'), 'Ohne ^ und $ passt auch ein Teil eines längeren Textes.').toBe(false);
  expect(istPlz('PLZ 90459')).toBe(false);
});

test('zahlenFinden findet alle Zahlen', () => {
  expect(zahlenFinden('3 Äpfel und 12 Birnen'), 'text.match(/\\d+/g) liefert Texte. Wandle sie mit .map(Number) um.').toEqual([3, 12]);
  expect(zahlenFinden('Bus 7, Gleis 21, Abfahrt 1430')).toEqual([7, 21, 1430]);
});

test('zahlenFinden ohne Zahlen ergibt []', () => {
  expect(zahlenFinden('keine Zahl hier'), 'match gibt ohne Treffer null zurück: (text.match(…) ?? [])').toEqual([]);
});

test('datumDeutsch dreht das Datum um', () => {
  expect(datumDeutsch('2026-10-31'), 'iso.replace(/(\\d{4})-(\\d{2})-(\\d{2})/, "$3.$2.$1")').toBe('31.10.2026');
  expect(datumDeutsch('1999-01-05')).toBe('05.01.1999');
});

test('istEmail erkennt Adressen', () => {
  expect(istEmail('mara@beispiel.de'), 'Ein Muster wie /^[^\\s@]+@[^\\s@]+\\.[a-z]{2,}$/i').toBe(true);
  expect(istEmail('Ali.Yilmaz@Firma.COM'), 'Mit dem Flag i ist Groß- und Kleinschreibung egal.').toBe(true);
});

test('istEmail lehnt Unsinn ab', () => {
  expect(istEmail('mara.beispiel.de'), 'Ohne @ ist es keine Adresse.').toBe(false);
  expect(istEmail('mara@beispiel'), 'Es fehlt der Punkt mit Endung.').toBe(false);
  expect(istEmail('ma ra@beispiel.de'), 'Leerzeichen sind nicht erlaubt.').toBe(false);
  expect(istEmail('mara@@beispiel.de')).toBe(false);
});
