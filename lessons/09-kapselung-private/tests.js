test('Die Klasse nutzt ein privates Feld #saldo', () => {
  expect(source(), 'Lege oben in der Klasse #saldo = 0; an.').toMatch(/#saldo/);
});

test('Ein neues Konto hat 0 Guthaben', () => {
  expect(new Konto().kontostand()).toBe(0);
});

test('einzahlen() erhöht das Guthaben', () => {
  const k = new Konto();
  k.einzahlen(50);
  k.einzahlen(25);
  expect(k.kontostand(), 'Schreibe this.#saldo += betrag;').toBe(75);
});

test('einzahlen() ignoriert 0 und negative Beträge', () => {
  const k = new Konto();
  k.einzahlen(0);
  k.einzahlen(-20);
  expect(k.kontostand(), 'Prüfe mit if (betrag > 0), bevor du etwas einzahlst.').toBe(0);
});

test('abheben() mit genug Geld klappt und gibt true zurück', () => {
  const k = new Konto();
  k.einzahlen(100);
  expect(k.abheben(30), 'Gib true zurück, wenn es geklappt hat.').toBe(true);
  expect(k.kontostand()).toBe(70);
});

test('abheben() ohne genug Geld gibt false zurück und ändert nichts', () => {
  const k = new Konto();
  k.einzahlen(10);
  expect(k.abheben(50), 'Prüfe zuerst, ob betrag <= this.#saldo ist.').toBe(false);
  expect(k.kontostand()).toBe(10);
});

test('Von außen kommt niemand an den Saldo', () => {
  const k = new Konto();
  k.einzahlen(10);
  expect(k.saldo, 'Das Feld muss #saldo heißen (mit #), nicht this.saldo.').toBeUndefined();
  expect(Object.keys(k)).toEqual([]);
});

test('`meinKonto` hat 100 eingezahlt', () => {
  expect(meinKonto, 'Erzeuge es mit new Konto().').toBeInstanceOf(Konto);
  expect(meinKonto.kontostand(), 'Rufe meinKonto.einzahlen(100); auf.').toBe(100);
});
