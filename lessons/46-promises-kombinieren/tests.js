const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('namenListe liefert Namen und "unbekannt"', async () => {
  expect(await namenListe([1, 99, 3]), 'allSettled, dann e.status === "fulfilled" ? e.value : "unbekannt"').toEqual(['Mara', 'unbekannt', 'Lea']);
});

test('namenListe nutzt Promise.allSettled', () => {
  expect(ohneKommentare(), 'Mit Promise.all würde ein einziger Fehler alles scheitern lassen.').toMatch(/Promise\.allSettled\(/);
});

test('schnellste gibt die schnellste Antwort zurück', async () => {
  expect(await schnellste([300, 40, 200]), 'Promise.any([...]) mit je fetch(`/uebung/langsam?ms=${ms}`).then((r) => r.json())').toBe(40);
});

test('mitZeitlimit liefert schnelle Antworten', async () => {
  expect(await mitZeitlimit(50, 400), 'fetch(…, { signal: AbortSignal.timeout(limit) }) und dann antwort.json()').toEqual({ ms: 50 });
});

test('mitZeitlimit bricht langsame Anfragen ab', async () => {
  expect(await mitZeitlimit(600, 100), 'Fange den Fehler mit try … catch und gib "zu langsam" zurück.').toBe('zu langsam');
});

test('abbrechbar liefert sofort Ergebnis und Abbruch-Funktion', async () => {
  const a = abbrechbar(50);
  expect(typeof a.abbrechen, 'return { ergebnis, abbrechen: () => controller.abort() };').toBe('function');
  expect(await a.ergebnis).toEqual({ ms: 50 });
});

test('abbrechen bricht die Anfrage wirklich ab', async () => {
  const a = abbrechbar(800);
  a.abbrechen();
  let fehler = null;
  try { await a.ergebnis; } catch (e) { fehler = e; }
  expect(fehler && fehler.name, 'Gib fetch { signal: controller.signal } mit.').toBe('AbortError');
});
