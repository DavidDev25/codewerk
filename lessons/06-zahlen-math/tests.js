test('runden(3.14159) ergibt 3.14', () => {
  expect(runden(3.14159), 'Math.round(zahl * 100) / 100').toBe(3.14);
});

test('runden lässt kurze Zahlen in Ruhe', () => {
  expect(runden(2.5)).toBe(2.5);
  expect(runden(10)).toBe(10);
  expect(runden(1.239)).toBe(1.24);
});

test('preisText(4.5) ergibt "4,50 €"', () => {
  expect(preisText(4.5), 'betrag.toFixed(2) ergibt "4.50". Tausche den Punkt mit replace gegen ein Komma und hänge " €" an.').toBe('4,50 €');
});

test('preisText klappt auch mit ganzen Zahlen', () => {
  expect(preisText(12)).toBe('12,00 €');
});

test('wuerfeln liefert nur ganze Zahlen von 1 bis 6', () => {
  for (let i = 0; i < 300; i++) {
    const wurf = wuerfeln();
    expect(Number.isInteger(wurf), 'Runde mit Math.floor ab, damit keine Kommazahl herauskommt.').toBe(true);
    expect(wurf >= 1 && wurf <= 6, `Herausgekommen ist ${wurf}. Math.floor(Math.random() * 6) + 1 ergibt 1 bis 6.`).toBe(true);
  }
});

test('wuerfeln kann jede Augenzahl würfeln', () => {
  const gesehen = new Set();
  for (let i = 0; i < 600; i++) gesehen.add(wuerfeln());
  expect(gesehen.size, 'In 600 Würfen sollte jede Zahl von 1 bis 6 vorkommen. Fehlt die 6? Dann fehlt das + 1 oder du rundest falsch.').toBe(6);
});

test('alsZahl wandelt Texte in Zahlen um', () => {
  expect(alsZahl('42'), 'Number(text)').toBe(42);
  expect(alsZahl('3.5')).toBe(3.5);
});

test('alsZahl gibt null zurück, wenn es keine Zahl ist', () => {
  expect(alsZahl('vier'), 'Prüfe mit Number.isNaN(…), ob die Umwandlung geklappt hat.').toBeNull();
});
