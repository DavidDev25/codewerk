test('`original` bleibt unverändert (punkte ist noch 5)', () => {
  expect(original.punkte, 'Schreibe const kopie = { ...original };').toBe(5);
});

test('`kopie` ist ein eigenes Objekt mit punkte 100', () => {
  expect(kopie.punkte).toBe(100);
  expect(kopie === original, 'kopie und original dürfen nicht dasselbe Objekt sein.').toBe(false);
});

test('plusEins(obj) verändert das übergebene Objekt', () => {
  const t = { punkte: 1 };
  plusEins(t);
  expect(t.punkte, 'Schreibe obj.punkte = obj.punkte + 1;').toBe(2);
});

test('plusEinsKopie(obj) gibt ein neues Objekt mit punkte + 1 zurück', () => {
  const t = { name: 'Lea', punkte: 1 };
  const r = plusEinsKopie(t);
  expect(r, 'Erst kopieren ({ ...obj }), dann die Kopie ändern, dann zurückgeben.').toEqual({ name: 'Lea', punkte: 2 });
});

test('plusEinsKopie(obj) lässt das Original unberührt', () => {
  const t = { name: 'Lea', punkte: 1 };
  const r = plusEinsKopie(t);
  expect(t.punkte, 'Ändere nur die Kopie, nicht obj selbst.').toBe(1);
  expect(r === t).toBe(false);
});
