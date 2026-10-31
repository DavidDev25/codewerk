const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');

test('nutzerName(2) ist "Ali"', async () => {
  expect(await nutzerName(2), 'const antwort = await fetch(`/uebung/nutzer/${id}`); dann (await antwort.json()).name').toBe('Ali');
});

test('nutzerName gibt null für unbekannte Nutzer zurück', async () => {
  expect(await nutzerName(99), 'Prüfe antwort.ok, bevor du die Daten liest: if (!antwort.ok) return null;').toBeNull();
});

test('wetterText beschreibt das Wetter', async () => {
  expect(await wetterText('Erlangen'), 'Format: Erlangen: 11 Grad, Regen').toBe('Erlangen: 11 Grad, Regen');
});

test('wetterText klappt mit Umlauten', async () => {
  expect(await wetterText('Nürnberg'), 'Verpacke die Stadt mit encodeURIComponent(stadt).').toBe('Nürnberg: 12 Grad, bewölkt');
});

test('wetterText meldet fehlende Daten', async () => {
  expect(await wetterText('Atlantis'), 'Bei 404: return `Keine Daten für ${stadt}`;').toBe('Keine Daten für Atlantis');
});

test('notizSpeichern schickt die Notiz und liefert die id', async () => {
  const id = await notizSpeichern('Milch kaufen');
  expect(typeof id, 'Lies die Antwort mit await antwort.json() und gib .id zurück.').toBe('number');
  const zweite = await notizSpeichern('Brot');
  expect(zweite, 'Jede gespeicherte Notiz bekommt eine neue id.').toBe(id + 1);
});

test('notizSpeichern nutzt POST mit JSON', () => {
  const code = ohneKommentare();
  expect(code, 'Gib fetch als zweiten Wert { method: "POST", … } mit.').toMatch(/method\s*:\s*["'`]POST["'`]/);
  expect(code, 'Der body muss ein Text sein: JSON.stringify({ text })').toMatch(/JSON\.stringify\(/);
});

test('staedte holt mehrere Nutzer', async () => {
  expect(await staedte([1, 3]), 'Erst alle fetch-Aufrufe starten, dann mit Promise.all warten.').toEqual(['Nürnberg', 'Fürth']);
  expect(await staedte([])).toEqual([]);
});

test('staedte nutzt Promise.all', () => {
  expect(ohneKommentare(), 'Hole alle Nutzer gleichzeitig: await Promise.all(ids.map(…))').toMatch(/Promise\.all\(/);
});
