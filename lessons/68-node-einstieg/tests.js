const ohneKommentare = (text) => (text || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('begruessen gibt ein Array mit Zeilen zurück', () => {
  const { begruessen } = modul('main.js');
  expect(typeof begruessen, 'function begruessen(name, anzahl, gruss = "Hallo") { … }').toBe('function');
  expect(begruessen('Ali', 3), 'Für anzahl = 3 kommen drei gleiche Zeilen heraus.').toEqual(['Hallo, Ali!', 'Hallo, Ali!', 'Hallo, Ali!']);
  expect(begruessen('Lea', 1, 'Servus')).toEqual(['Servus, Lea!']);
});

test('Das Programm liest process.argv und process.env', () => {
  const code = ohneKommentare(source('main.js'));
  expect(code, 'Hole die Argumente mit process.argv.slice(2).').toMatch(/process\.argv/);
  expect(code, 'Lies den Gruß aus process.env.GRUSS.').toMatch(/process\.env\.GRUSS|process\.env\[["']GRUSS["']\]/);
});

test('Mit „Mara 2“ und GRUSS=Moin kommen zwei Grüße', () => {
  expect(output(), 'Gib jede Zeile von begruessen(…) mit console.log aus. Denk an Number(anzahlText).').toEqual(['Moin, Mara!', 'Moin, Mara!']);
  expect(node.process.exitCode ?? 0, 'Mit Namen ist alles gut: Der Exit-Code bleibt 0.').toBe(0);
});

test('Ohne Namen gibt es eine Fehlermeldung und den Exit-Code 1', () => {
  const code = ohneKommentare(source('main.js'));
  expect(code, 'Melde den fehlenden Namen mit console.error(…).').toMatch(/console\.error\(/);
  expect(code, 'Setze process.exitCode = 1;').toMatch(/process\.exitCode\s*=\s*1|process\.exit\(\s*1\s*\)/);
});
