const ohneKommentare = (text) => (text || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const gespeichert = () => {
  const text = node.datei('daten/notizen.json');
  try { return JSON.parse(text); } catch (e) { return null; }
};

test('laden liest die Datei, eine fehlende Datei ergibt []', () => {
  const { laden } = modul('speicher.js');
  expect(laden('/projekt/daten/notizen.json').map((n) => n.text), 'JSON.parse(readFileSync(datei, "utf8"))').toEqual(['Tee kaufen', 'Node.js lernen']);
  expect(laden('/projekt/gibt-es-nicht.json'), 'Im catch: if (fehler.code === "ENOENT") return [];').toEqual([]);
  node.fs.writeFileSync('kaputt.json', '[{');
  expect(() => laden('/projekt/kaputt.json'), 'Andere Fehler (hier kaputtes JSON) wirfst du weiter.').toThrow();
});

test('Der Server läuft auf process.env.PORT', () => {
  expect(node.serverLaeuft(), 'server.listen(port, () => …)').toBe(true);
  expect(output()).toContain('Notiz-API läuft auf Port 3000');
});

test('GET /notizen liefert alle Notizen, ?suche filtert', async () => {
  const a = await node.anfrage('GET', '/notizen');
  expect(a.status).toBe(200);
  expect(a.json().map((n) => n.id)).toEqual([1, 2]);
  const b = await node.anfrage('GET', '/notizen?suche=NODE');
  expect(b.json().map((n) => n.text), 'n.text.toLowerCase().includes(suche.toLowerCase())').toEqual(['Node.js lernen']);
});

test('POST /notizen legt an, speichert die Datei und meldet "gespeichert"', async () => {
  const meldungen = await capture(async () => {
    const a = await node.anfrage('POST', '/notizen', { text: 'Brot backen' });
    expect(a.status, 'json(res, 201, speicher.hinzufuegen(daten.text))').toBe(201);
    expect(a.json()).toEqual({ id: 3, text: 'Brot backen', erledigt: false });
  });
  const datei = gespeichert();
  expect(datei && datei.map((n) => n.text), '#sichern() schreibt mit writeFileSync(this.#datei, JSON.stringify(…, null, 2)).').toEqual(['Tee kaufen', 'Node.js lernen', 'Brot backen']);
  expect(meldungen, 'speicher.on("gespeichert", (anzahl) => console.log(`Gespeichert: ${anzahl} Notizen`))').toContain('Gespeichert: 3 Notizen');
});

test('POST ohne gültigen Text ergibt 400', async () => {
  const kaputt = await node.anfrage('POST', '/notizen', 'kein json{');
  expect(kaputt.status, 'JSON.parse in try/catch, bei Fehler 400').toBe(400);
  expect(kaputt.json()).toEqual({ fehler: 'Text fehlt' });
  expect((await node.anfrage('POST', '/notizen', { text: '   ' })).status, 'Leerer Text: daten.text.trim() ist leer.').toBe(400);
  expect((await node.anfrage('POST', '/notizen', { text: 42 })).status, 'text muss ein String sein.').toBe(400);
});

test('PATCH /notizen/:id ändert eine Notiz', async () => {
  const a = await node.anfrage('PATCH', '/notizen/1', { erledigt: true });
  expect(a.status).toBe(200);
  expect(a.json()).toEqual({ id: 1, text: 'Tee kaufen', erledigt: true });
  expect(gespeichert()[0].erledigt, 'Die Änderung steht auch in der Datei.').toBe(true);
  expect((await node.anfrage('PATCH', '/notizen/99', { erledigt: true })).status).toBe(404);
});

test('DELETE /notizen/:id löscht mit 204, danach 404', async () => {
  const a = await node.anfrage('DELETE', '/notizen/2');
  expect(a.status, 'res.writeHead(204); res.end();').toBe(204);
  expect(a.text, '204 heißt: ohne Inhalt.').toBe('');
  expect(gespeichert().map((n) => n.id)).not.toContain(2);
  const b = await node.anfrage('DELETE', '/notizen/2');
  expect(b.status).toBe(404);
  expect(b.json()).toEqual({ fehler: 'Notiz nicht gefunden' });
});

test('Unbekannte Adressen ergeben 404', async () => {
  const a = await node.anfrage('GET', '/irgendwas');
  expect(a.status).toBe(404);
  expect(a.json()).toEqual({ fehler: 'Nicht gefunden' });
});

test('Das Projekt nutzt ES-Module', () => {
  expect(JSON.parse(source('package.json')).type, '"type": "module" bleibt in package.json.').toBe('module');
  expect(ohneKommentare(source('main.js')), 'Nutze import statt require.').not.toMatch(/\brequire\(/);
});
