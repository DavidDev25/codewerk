const ohneKommentare = (text) => (text || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('rechner.js exportiert genau addiere und letzteRechnung', () => {
  const rechner = modul('rechner.js');
  expect(Object.keys(rechner), 'Schreibe export vor beide Funktionen, aber nicht vor verlauf.').toEqual(['addiere', 'letzteRechnung']);
});

test('`verlauf` bleibt privat', () => {
  expect(modul('rechner.js').verlauf, 'verlauf darf nicht exportiert werden.').toBeUndefined();
});

test('letzteRechnung gibt die letzte Rechnung zurück', () => {
  const { addiere, letzteRechnung } = modul('rechner.js');
  expect(typeof letzteRechnung, 'export function letzteRechnung() { … }').toBe('function');
  expect(addiere(1, 1)).toBe(2);
  expect(letzteRechnung(), 'Gib den letzten Eintrag aus verlauf zurück: verlauf.at(-1)').toBe('1 + 1 = 2');
  expect(ohneKommentare(source('rechner.js')), 'Ist verlauf leer, gib null zurück, z. B. mit ?? null.').toMatch(/null/);
});

test('main.js importiert aus ./rechner.js', () => {
  const code = ohneKommentare(source('main.js'));
  expect(code, 'import { addiere, letzteRechnung } from "./rechner.js";').toMatch(/import\s*\{[^}]*\baddiere\b[^}]*\}\s*from\s*["']\.\/rechner\.js["']/);
  expect(code, 'Importiere auch letzteRechnung.').toMatch(/import\s*\{[^}]*\bletzteRechnung\b[^}]*\}\s*from/);
});

test('main.js importiert den Standard-Export als `schoen`', () => {
  expect(ohneKommentare(source('main.js')), 'import schoen from "./format.js"; (ohne geschweifte Klammern)')
    .toMatch(/import\s+schoen\s+from\s*["']\.\/format\.js["']/);
});

test('Die Ausgabe zeigt die letzte Rechnung', () => {
  expect(output(), 'Rechne erst 2 + 3, dann 10 + 4, und gib schoen(letzteRechnung()) aus.').toContain('Ergebnis: 10 + 4 = 14');
});
