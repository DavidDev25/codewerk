test('warten(50) gibt ein Promise zurück', () => {
  expect(warten(50), 'Schreibe in warten: return new Promise((resolve) => { … });').toBeInstanceOf(Promise);
});

test('warten(50) wird nach der Wartezeit erfüllt', async () => {
  let fertig = false;
  warten(50).then(() => { fertig = true; });
  await wait(10);
  expect(fertig, 'Rufe resolve erst in setTimeout(resolve, ms) auf, nicht sofort.').toBe(false);
  await wait(120);
  expect(fertig, 'Nach ms Millisekunden muss resolve aufgerufen werden: setTimeout(resolve, ms).').toBe(true);
});

test('bestellen("Pizza") liefert "Pizza ist fertig!"', async () => {
  const ergebnis = bestellen('Pizza');
  expect(ergebnis, 'bestellen muss ein Promise zurückgeben: return new Promise((resolve, reject) => { … });').toBeInstanceOf(Promise);
  expect(await ergebnis, 'Rufe resolve(gericht + " ist fertig!") auf, wenn das Gericht auf der Speisekarte steht.').toBe('Pizza ist fertig!');
});

test('bestellen funktioniert für jedes Gericht der Speisekarte', async () => {
  expect(await bestellen('Salat'), 'Prüfe mit speisekarte.includes(gericht), statt nur "Pizza" fest einzutragen.').toBe('Salat ist fertig!');
});

test('bestellen("Sushi") wird abgelehnt', async () => {
  let fehler = null;
  try {
    await bestellen('Sushi');
  } catch (e) {
    fehler = e;
  }
  expect(fehler, 'Rufe sonst reject(new Error(…)) auf.').toBeInstanceOf(Error);
  expect(fehler.message, 'Der Text muss "Sushi gibt es heute nicht." sein.').toBe('Sushi gibt es heute nicht.');
});

test('Pizza und Sushi werden ausgegeben', () => {
  expect(output(), 'Gib den Text in .then((text) => console.log(text)) aus.').toContain('Pizza ist fertig!');
  expect(output(), 'Gib im .catch((fehler) => console.log(fehler.message)) die Meldung aus.').toContain('Sushi gibt es heute nicht.');
});
