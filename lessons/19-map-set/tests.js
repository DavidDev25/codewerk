test('`optionen` enthält jede Antwort einmal', () => {
  expect(optionen, '[...new Set(antworten)]').toEqual(['Kino', 'Bowling', 'Picknick']);
});

test('zaehlen gibt eine Map zurück', () => {
  expect(zaehlen(['a']), 'Lege mit const zaehler = new Map(); eine Map an und gib sie zurück.').toBeInstanceOf(Map);
});

test('`ergebnis` zählt richtig', () => {
  expect(ergebnis.get('Kino'), 'ergebnis.set(antwort, (ergebnis.get(antwort) ?? 0) + 1)').toBe(3);
  expect(ergebnis.get('Bowling')).toBe(2);
  expect(ergebnis.get('Picknick')).toBe(1);
  expect(ergebnis.size).toBe(3);
});

test('zaehlen klappt mit jeder Liste', () => {
  const z = zaehlen(['x', 'y', 'x']);
  expect(z.get('x')).toBe(2);
  expect(zaehlen([]).size, 'Eine leere Liste ergibt eine leere Map.').toBe(0);
});

test('beliebteste findet den häufigsten Eintrag', () => {
  expect(beliebteste(antworten), 'Gehe durch zaehlen(liste) und merke dir den Eintrag mit der größten Zahl.').toBe('Kino');
  expect(beliebteste(['Tee', 'Kaffee', 'Kaffee'])).toBe('Kaffee');
});
