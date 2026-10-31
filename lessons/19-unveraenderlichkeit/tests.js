const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('`sortiert`, `rueckwaerts` und `ersetzt` stimmen', () => {
  expect(sortiert, 'zahlen.toSorted((a, b) => a - b)').toEqual([1, 2, 3]);
  expect(rueckwaerts, 'zahlen.toReversed()').toEqual([2, 1, 3]);
  expect(ersetzt, 'zahlen.with(0, 10)').toEqual([10, 1, 2]);
});

test('`zahlen` ist unverändert', () => {
  expect(zahlen, 'Nutze toSorted, toReversed und with statt sort, reverse und Zuweisung.').toEqual([3, 1, 2]);
  expect(ohneKommentare(), 'sort( und reverse( verändern das Original.').not.toMatch(/\.(sort|reverse)\(/);
});

test('`kopie` ist eine tiefe Kopie mit neuer Stadt', () => {
  expect(kopie.ort.stadt, 'kopie.ort.stadt = "Fürth";').toBe('Fürth');
  expect(kopie.titel).toBe('JavaScript');
  expect(kurs.ort.stadt, 'Mit { ...kurs } wird ort geteilt. Nimm structuredClone(kurs).').toBe('Nürnberg');
});

test('mitTeilnehmer gibt einen neuen Kurs zurück', () => {
  const neu = mitTeilnehmer(kurs, 'Ben');
  expect(neu.teilnehmer, 'return { ...kurs, teilnehmer: [...kurs.teilnehmer, name] };').toEqual(['Lea', 'Tom', 'Ben']);
  expect(neu.titel).toBe('JavaScript');
});

test('mitTeilnehmer verändert den alten Kurs nicht', () => {
  mitTeilnehmer(kurs, 'Mia');
  expect(kurs.teilnehmer, 'push verändert das Original. Baue mit [...] ein neues Array.').toEqual(['Lea', 'Tom']);
});

test('`konfig` ist eingefroren', () => {
  expect(Object.isFrozen(konfig), 'const konfig = Object.freeze({ farbe: "blau" });').toBe(true);
  expect(konfig.farbe).toBe('blau');
});
