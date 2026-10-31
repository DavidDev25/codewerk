const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('`name` und `stadt` kommen per Destructuring aus nutzer', () => {
  expect(name, 'const { name, stadt } = nutzer;').toBe('Mara');
  expect(stadt).toBe('Nürnberg');
  expect(ohneKommentare(), 'Nutze die Schreibweise mit geschweiften Klammern links vom =.').toMatch(/const\s*\{[^}]*\bname\b[^}]*\}\s*=\s*nutzer/);
});

test('`erster` und `zweiter` kommen per Destructuring aus punkte', () => {
  expect(erster, 'const [erster, zweiter] = punkte;').toBe(12);
  expect(zweiter).toBe(7);
  expect(ohneKommentare()).toMatch(/const\s*\[\s*erster\s*,\s*zweiter/);
});

test('`umgezogen` wohnt in Fürth, der Rest ist gleich', () => {
  expect(umgezogen.stadt, 'const umgezogen = { ...nutzer, stadt: "Fürth" };').toBe('Fürth');
  expect(umgezogen.name).toBe('Mara');
  expect(umgezogen.alter).toBe(31);
});

test('`nutzer` selbst bleibt unverändert', () => {
  expect(nutzer.stadt, 'Ändere nicht nutzer.stadt, sondern baue mit ... ein neues Objekt.').toBe('Nürnberg');
  expect(umgezogen, 'umgezogen muss ein eigenes Objekt sein, keine zweite Beschriftung von nutzer.').not.toBe(nutzer);
});

test('summe nimmt beliebig viele Zahlen', () => {
  expect(summe(1, 2, 3), 'Mit ...zahlen im Parameter ist zahlen ein Array. Addiere es mit einer for…of-Schleife.').toBe(6);
  expect(summe(10, 20, 30, 40)).toBe(100);
  expect(summe(5)).toBe(5);
});

test('summe ohne Zahlen ist 0', () => {
  expect(summe(), 'Starte mit let ergebnis = 0;').toBe(0);
});

test('vorstellen packt das Objekt im Parameter aus', () => {
  expect(vorstellen({ name: 'Ali', alter: 25 }), 'Format: Ali ist 25.').toBe('Ali ist 25.');
  expect(ohneKommentare(), 'Schreibe den Parameter als ({ name, alter }).').toMatch(/vorstellen\s*=\s*\(\s*\{/);
});
