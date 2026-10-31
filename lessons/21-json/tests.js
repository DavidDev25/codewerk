test('`gespeichert` ist ein JSON-Text', () => {
  expect(typeof gespeichert, 'JSON.stringify(einstellungen)').toBe('string');
  expect(gespeichert).toBe('{"thema":"dunkel","schrift":18,"sprachen":["de","en"]}');
});

test('`geladen` ist wieder ein Objekt mit denselben Daten', () => {
  expect(typeof geladen, 'JSON.parse(gespeichert)').toBe('object');
  expect(geladen).toEqual(einstellungen);
});

test('`geladen` ist eine echte Kopie, kein Verweis', () => {
  expect(geladen, 'Parse den Text, statt einfach einstellungen zuzuweisen.').not.toBe(einstellungen);
});

test('`huebsch` ist mit 2 Leerzeichen eingerückt', () => {
  expect(huebsch, 'JSON.stringify(einstellungen, null, 2)').toBe(JSON.stringify(einstellungen, null, 2));
});

test('laden liest gespeicherte Einstellungen', () => {
  expect(laden('{"thema":"bunt","schrift":20}'), 'return JSON.parse(text);').toEqual({ thema: 'bunt', schrift: 20 });
});

test('laden gibt ohne Text die Standardwerte zurück', () => {
  expect(laden(null), 'Prüfe zuerst: if (!text) { return { thema: "hell", schrift: 16 }; }').toEqual({ thema: 'hell', schrift: 16 });
  expect(laden(''), 'Auch ein leerer Text bedeutet: nichts gespeichert.').toEqual({ thema: 'hell', schrift: 16 });
});
