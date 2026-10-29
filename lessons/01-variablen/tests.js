test('`name` ist ein Text', () => {
  expect(typeof name, 'Lege mit const name = "…" einen Text an.').toBe('string');
});

test('`punkte` steht am Ende auf 10', () => {
  expect(punkte, 'Starte mit let punkte = 0 und erhöhe danach mit punkte += 10.').toBe(10);
});

test('`nachricht` hat das richtige Format', () => {
  expect(nachricht, 'Format: Hallo <name>, du hast <punkte> Punkte.').toBe(`Hallo ${name}, du hast 10 Punkte.`);
});

test('Die Nachricht wird mit console.log ausgegeben', () => {
  expect(output(), 'Schreibe console.log(nachricht);').toContain(nachricht);
});
