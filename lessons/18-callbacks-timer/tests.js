test('rechne ruft den Callback auf', () => {
  expect(rechne(10, 2, (x, y) => x - y), 'Schreibe in rechne: return operation(a, b);').toBe(8);
});

test('`summe` ist 7', () => {
  expect(summe, 'const summe = rechne(3, 4, (x, y) => x + y);').toBe(7);
});

test('`produkt` ist 12', () => {
  expect(produkt, 'Der Callback für produkt rechnet x * y.').toBe(12);
});

test('erinnern gibt den Text nicht sofort aus', async () => {
  const frueh = await capture(async () => {
    erinnern('Pizza ist da!', 400);
    await wait(30);
  });
  expect(frueh, 'Gib den Text nicht direkt aus, sondern in setTimeout(() => console.log(text), ms).').toEqual([]);
});

test('erinnern gibt den Text nach der Wartezeit aus', async () => {
  const spaeter = await capture(async () => {
    erinnern('Pizza ist da!', 50);
    await wait(120);
  });
  expect(spaeter, 'Nutze setTimeout(() => { console.log(text); }, ms);').toEqual(['Pizza ist da!']);
});

test('Die Ausgabe kommt in der richtigen Reihenfolge', () => {
  expect(output(), 'Erst erinnern("Tee ist fertig!", 300); aufrufen, dann console.log("Wasser kocht …");').toEqual(['Wasser kocht …', 'Tee ist fertig!']);
});
