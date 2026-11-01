const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('alleNutzer ist ein async-Generator', () => {
  expect(Object.prototype.toString.call(alleNutzer()), 'Schreibe async function* alleNutzer() { … }').toBe('[object AsyncGenerator]');
});

test('alleNutzer liefert alle drei Nutzer und hört dann auf', async () => {
  const liste = [];
  for await (const n of alleNutzer()) liste.push(n.id);
  expect(liste, 'Ist antwort.ok falsch, mit return aufhören.').toEqual([1, 2, 3]);
});

test('namenSammeln nutzt for await', async () => {
  expect(await namenSammeln()).toEqual(['Mara', 'Ali', 'Lea']);
  expect(ohneKommentare(), 'for await (const nutzer of alleNutzer()) { … }').toMatch(/for\s+await\s*\(/);
});

test('anzahlNutzer nutzt Array.fromAsync', async () => {
  expect(await anzahlNutzer(), '(await Array.fromAsync(alleNutzer())).length').toBe(3);
  expect(ohneKommentare()).toMatch(/Array\.fromAsync\(/);
});

test('`geradeQuadrate` stimmt', () => {
  expect(geradeQuadrate, 'zahlenAb(1).filter((n) => n % 2 === 0).map((n) => n * n).take(3).toArray()').toEqual([4, 16, 36]);
});

test('Die Iterator-Helfer werden benutzt', () => {
  expect(ohneKommentare(), 'Nutze .take(3). Ohne Begrenzung endet der unendliche Generator nie.').toMatch(/\.take\(/);
  expect(ohneKommentare()).toMatch(/\.toArray\(/);
});
