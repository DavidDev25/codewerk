const ohneKommentare = (text) => (text || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('Der Server läuft auf dem Port aus process.env.PORT', () => {
  expect(node.serverLaeuft(), 'server.listen(port, () => { … });').toBe(true);
  expect(output(), 'Gib im listen-Callback "Server läuft auf Port 3000" aus.').toContain('Server läuft auf Port 3000');
  expect(ohneKommentare(source('main.js')), 'const port = Number(process.env.PORT ?? 3000);').toMatch(/process\.env\.PORT/);
});

test('GET / begrüßt mit Text', async () => {
  const a = await node.anfrage('GET', 'http://localhost:3000/');
  expect(a.status).toBe(200);
  expect(a.headers['content-type'], 'res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" })').toBe('text/plain; charset=utf-8');
  expect(a.text).toBe('Willkommen im Laden-Server');
});

test('GET /api/produkte liefert alle Produkte als JSON', async () => {
  const a = await node.anfrage('GET', '/api/produkte');
  expect(a.status).toBe(200);
  expect(a.headers['content-type'], 'Nutze die Hilfsfunktion json(res, 200, produkte).').toBe('application/json; charset=utf-8');
  expect(a.json().map((p) => p.name)).toEqual(['Tee', 'Kaffee', 'Kakao']);
});

test('?max=5 filtert nach dem Preis', async () => {
  const a = await node.anfrage('GET', '/api/produkte?max=5');
  expect(a.json().map((p) => p.name), 'url.searchParams.get("max") und filter(p => p.preis <= Number(max))').toEqual(['Tee', 'Kakao']);
});

test('GET /api/produkte/2 liefert ein Produkt, unbekannte IDs 404', async () => {
  const a = await node.anfrage('GET', '/api/produkte/2');
  expect(a.status).toBe(200);
  expect(a.json(), '/^\\/api\\/produkte\\/(\\d+)$/.exec(url.pathname)').toEqual({ id: 2, name: 'Kaffee', preis: 6 });
  const b = await node.anfrage('GET', '/api/produkte/99');
  expect(b.status, 'Kein Produkt gefunden: json(res, 404, { fehler: "Produkt nicht gefunden" })').toBe(404);
  expect(b.json()).toEqual({ fehler: 'Produkt nicht gefunden' });
});

test('Alles andere ergibt 404', async () => {
  const a = await node.anfrage('GET', '/gibts-nicht');
  expect(a.status).toBe(404);
  expect(a.json()).toEqual({ fehler: 'Seite nicht gefunden' });
  const b = await node.anfrage('POST', '/api/produkte', { name: 'X' });
  expect(b.status, 'Prüfe auch req.method === "GET".').toBe(404);
});
