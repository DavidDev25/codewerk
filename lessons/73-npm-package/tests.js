let pkg = null;
try { pkg = JSON.parse(source('package.json')); } catch (e) { pkg = null; }
const { passt } = modul('main.js');

test('package.json ist gültiges JSON mit Version und Beschreibung', () => {
  expect(pkg, 'Prüfe Kommas und doppelte Anführungszeichen in package.json.').not.toBeNull();
  expect(pkg.version, '"version": "1.0.0"').toBe('1.0.0');
  expect(typeof pkg.description === 'string' && pkg.description.trim().length > 0, '"description": "…" darf nicht leer sein.').toBe(true);
});

test('package.json hat die Skripte start und test', () => {
  expect(pkg.scripts, '"scripts": { "start": "node main.js", "test": "node --test" }').toEqual({ start: 'node main.js', test: 'node --test' });
});

test('express ist eine dependency, eslint eine devDependency', () => {
  expect(pkg.dependencies, '"dependencies": { "express": "^4.21.2" }').toEqual({ express: '^4.21.2' });
  expect(pkg.devDependencies, '"devDependencies": { "eslint": "~9.17.0" }').toEqual({ eslint: '~9.17.0' });
});

test('passt: genaue Versionen und *', () => {
  expect(passt('1.2.3', '1.2.3')).toBe(true);
  expect(passt('1.2.4', '1.2.3'), 'Ohne ^ oder ~ zählt nur genau diese Version.').toBe(false);
  expect(passt('7.0.0', '*'), '"*" passt immer.').toBe(true);
});

test('passt: ~ erlaubt nur neue Patches', () => {
  expect(passt('1.2.9', '~1.2.3')).toBe(true);
  expect(passt('1.3.0', '~1.2.3'), 'Bei ~ muss die zweite Zahl gleich bleiben.').toBe(false);
  expect(passt('1.2.2', '~1.2.3'), 'Kleiner als die Version im Bereich passt nie.').toBe(false);
});

test('passt: ^ erlaubt neue Minor-Versionen, unter 1.0 nur Patches', () => {
  expect(passt('1.9.0', '^1.2.3')).toBe(true);
  expect(passt('1.10.0', '^1.9.0'), 'Vergleiche Zahlen, nicht Texte: 10 ist größer als 9.').toBe(true);
  expect(passt('2.0.0', '^1.2.3'), 'Bei ^ muss die erste Zahl gleich bleiben.').toBe(false);
  expect(passt('1.2.0', '^1.2.3')).toBe(false);
  expect(passt('0.2.5', '^0.2.3')).toBe(true);
  expect(passt('0.3.0', '^0.2.3'), 'Sonderfall: Bei ^0.x muss auch die zweite Zahl gleich bleiben.').toBe(false);
});

test('Das Programm meldet die Versionen', () => {
  expect(output()).toEqual(['mein-laden v1.0.0', 'express ^4.21.2: installiert 4.22.3 passt', 'eslint ~9.17.0: installiert 9.18.0 passt nicht']);
});
