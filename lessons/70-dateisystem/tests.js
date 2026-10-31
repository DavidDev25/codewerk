const ohneKommentare = (text) => (text || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const { woerterZaehlen, notieren, statistikSpeichern } = modul('main.js');

test('woerterZaehlen zählt die Wörter einer Datei', () => {
  node.fs.writeFileSync('probe.txt', 'eins zwei\n  drei\n\nvier ');
  expect(woerterZaehlen('probe.txt'), 'text.split(/\\s+/).filter(Boolean).length').toBe(4);
  expect(woerterZaehlen('/projekt/texte/gedicht.txt')).toBe(13);
});

test('Eine fehlende Datei ergibt 0, andere Fehler werden weitergeworfen', () => {
  expect(woerterZaehlen('gibt-es-nicht.txt'), 'Im catch: if (fehler.code === "ENOENT") return 0;').toBe(0);
  expect(() => woerterZaehlen('/projekt/texte'), 'Ein Ordner ist ein anderer Fehler (EISDIR): throw fehler;').toThrow();
});

test('notieren hängt eine Zeile an notizen.txt an', () => {
  notieren('Test-Notiz');
  expect(node.datei('notizen.txt'), 'fs.appendFileSync(…, text + "\\n")').toBe('Projekt angelegt\nGedicht gezählt\nTest-Notiz\n');
});

test('statistikSpeichern legt den Ordner an und schreibt JSON', () => {
  node.fs.rmSync('ausgabe', { recursive: true, force: true });
  statistikSpeichern({ datei: 'x.txt', woerter: 7 });
  const text = node.datei('ausgabe/statistik.json');
  expect(text, 'fs.mkdirSync(ordner, { recursive: true }) und dann fs.writeFileSync(…)').not.toBeNull();
  expect(JSON.parse(text)).toEqual({ datei: 'x.txt', woerter: 7 });
  expect(text, 'JSON.stringify(daten, null, 2) rückt schön ein.').toMatch(/\n  "datei"/);
});

test('Das Hauptprogramm zählt das Gedicht und gibt das Ergebnis aus', () => {
  expect(output()).toContain('Das Gedicht hat 13 Wörter.');
});

test('Pfade werden mit path.join gebaut', () => {
  expect(ohneKommentare(source('main.js')), 'path.join(__dirname, "texte", "gedicht.txt")').toMatch(/path\.join\(/);
});
