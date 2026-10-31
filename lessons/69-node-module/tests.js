const ohneKommentare = (text) => (text || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('lager.js gibt genau einlagern und bestand frei', () => {
  const lager = modul('lager.js');
  expect(typeof lager, 'module.exports = { einlagern, bestand };').toBe('object');
  expect(Object.keys(lager).sort(), 'Nur einlagern und bestand gehören in module.exports, nicht die Map.').toEqual(['bestand', 'einlagern']);
});

test('einlagern zählt zusammen und gibt den neuen Bestand zurück', () => {
  const { einlagern, bestand } = modul('lager.js');
  expect(einlagern('Kakao', 3), 'Ein neuer Artikel startet bei 0: 0 + 3 = 3').toBe(3);
  expect(einlagern('Kakao', 2)).toBe(5);
  expect(bestand('Kakao')).toBe(5);
});

test('bestand gibt 0 für unbekannte Artikel', () => {
  expect(modul('lager.js').bestand('Limonade'), 'lager.get(name) ?? 0').toBe(0);
});

test('main.js lädt lager und preise mit require', () => {
  const code = ohneKommentare(source('main.js'));
  expect(code, 'const { einlagern, bestand } = require("./lager");').toMatch(/require\(\s*["']\.\/lager(\.js)?["']\s*\)/);
  expect(code, 'const preise = require("./preise.json");').toMatch(/require\(\s*["']\.\/preise\.json["']\s*\)/);
  expect(code, 'Rechne mit den Preisen aus der Datei, nicht mit festen Zahlen.').not.toMatch(/4\.5/);
});

test('Der Lagerwert stimmt', () => {
  expect(output(), '10 · 4,5 + 4 · 6 = 69').toContain('Lagerwert: 69 Euro');
});
