const tasse = { name: 'Tasse', preis: 8 };
const kaffee = { name: 'Kaffee', preis: 12 };

test('Warenkorb: Ein neuer Korb ist leer', () => {
  const korb = new Warenkorb();
  expect(korb.anzahl, 'Lege #artikel = []; an. Der Getter anzahl zählt mit reduce alle Mengen zusammen, Startwert 0.').toBe(0);
  expect(korb.summe(), 'summe() rechnet mit reduce, Startwert 0.').toBe(0);
});

test('Warenkorb: anzahl zählt alle Stück', () => {
  const korb = new Warenkorb();
  korb.hinzufuegen(tasse, 2);
  korb.hinzufuegen(kaffee);
  expect(korb.anzahl, 'Ohne Angabe ist die Menge 1: hinzufuegen(produkt, menge = 1). anzahl addiert alle Mengen: 2 + 1.').toBe(3);
});

test('Warenkorb: summe() rechnet Preis mal Menge', () => {
  const korb = new Warenkorb();
  korb.hinzufuegen(tasse, 2);
  korb.hinzufuegen(kaffee);
  expect(korb.summe(), '2 Tassen à 8 € und 1 Kaffee à 12 € sind 28 €. Rechne eintrag.produkt.preis * eintrag.menge.').toBe(28);
});

test('Warenkorb: namen() liefert die Produktnamen', () => {
  const korb = new Warenkorb();
  korb.hinzufuegen(tasse);
  korb.hinzufuegen(kaffee);
  expect(korb.namen(), 'Nutze map: this.#artikel.map((eintrag) => eintrag.produkt.name).').toEqual(['Tasse', 'Kaffee']);
});

test('Warenkorb: Eine Menge unter 1 wird abgelehnt', () => {
  const korb = new Warenkorb();
  let meldung = '';
  try { korb.hinzufuegen(tasse, 0); } catch (fehler) { meldung = fehler.message; }
  expect(meldung, 'Prüfe zuerst if (menge < 1) und wirf throw new Error("Menge muss mindestens 1 sein.");').toBe('Menge muss mindestens 1 sein.');
  expect(korb.anzahl, 'Bei einem Fehler darf nichts im Korb landen – wirf den Fehler vor dem push.').toBe(0);
});

test('Warenkorb: #artikel ist privat', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code, 'Nutze ein privates Feld #artikel.').toMatch(/#artikel/);
  expect(new Warenkorb().artikel, 'Speichere die Artikel in #artikel, nicht in this.artikel.').toBeUndefined();
});

test('einkaufen füllt den Korb mit den richtigen Produkten', async () => {
  const ergebnis = einkaufen(['Tasse', 'Kaffee']);
  expect(ergebnis, 'Schreibe async function einkaufen(namen) { … }.').toBeInstanceOf(Promise);
  const korb = await ergebnis;
  expect(korb, 'Gib am Ende den Korb zurück: return korb;').toBeInstanceOf(Warenkorb);
  expect(korb.namen(), 'Suche jedes Produkt mit produkte.find((p) => p.name === name) und lege es in den Korb.').toEqual(['Tasse', 'Kaffee']);
  expect(korb.summe()).toBe(20);
});

test('einkaufen meldet unbekannte Produkte', async () => {
  let fehler = null;
  try {
    await einkaufen(['Tasse', 'Banane']);
  } catch (e) {
    fehler = e;
  }
  expect(fehler, 'Findet find nichts, ist das Ergebnis undefined. Wirf dann throw new Error(name + " gibt es nicht.");').toBeInstanceOf(Error);
  expect(fehler.message).toBe('Banane gibt es nicht.');
});

test('kasse bezahlt kleine Einkäufe', async () => {
  const korb = new Warenkorb();
  korb.hinzufuegen(tasse);
  korb.hinzufuegen(kaffee);
  expect(await kasse(korb), 'Gib im try-Block return await bezahlen(korb.summe()); zurück.').toBe('Bezahlt: 20 €');
});

test('kasse fängt eine abgelehnte Zahlung ab', async () => {
  const korb = new Warenkorb();
  korb.hinzufuegen({ name: 'Fernseher', preis: 400 });
  expect(await kasse(korb), 'Fange den Fehler mit try … catch ab und gib "Zahlung fehlgeschlagen: " + fehler.message zurück.').toBe('Zahlung fehlgeschlagen: Limit überschritten');
});

test('start() gibt das Ergebnis der Kasse aus', () => {
  expect(output(), 'Kaufe in start() Tasse und Kaffee ein, gib console.log(await kasse(korb)) aus und rufe start(); auf.').toContain('Bezahlt: 20 €');
});
