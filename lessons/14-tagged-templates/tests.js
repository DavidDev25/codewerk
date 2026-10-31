test('hervorheben setzt Werte zwischen Sternchen', () => {
  const name = 'Mara';
  const n = 3;
  expect(hervorheben`Hallo ${name}, du hast ${n} Punkte.`, 'Baue den Text zusammen: teile[0], dann für jeden Wert "*" + wert + "*" + teile[i + 1].').toBe('Hallo *Mara*, du hast *3* Punkte.');
});

test('hervorheben klappt auch ohne Werte', () => {
  expect(hervorheben`Nur Text`, 'Ohne Werte ist das Ergebnis einfach teile[0].').toBe('Nur Text');
});

test('sicher entschärft HTML in den Werten', () => {
  const eingabe = '<b>Tom & Jerry</b>';
  expect(sicher`<p>${eingabe}</p>`, 'Nur die Werte ersetzen, die festen <p>-Teile bleiben. Erst & ersetzen, dann < und >.').toBe('<p>&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;</p>');
});

test('sicher lässt harmlose Werte in Ruhe', () => {
  expect(sicher`Hallo ${'Ali'}!`).toBe('Hallo Ali!');
});

test('euro formatiert Beträge', () => {
  expect(euro`Summe: ${12.5}`, 'wert.toFixed(2).replace(".", ",") + " €"').toBe('Summe: 12,50 €');
  expect(euro`${3} plus ${0.5}`).toBe('3,00 € plus 0,50 €');
});

test('`pfad` behält seine Backslashes', () => {
  expect(pfad, 'const pfad = String.raw`C:\\neu\\daten`;').toBe('C:\\neu\\daten');
});
