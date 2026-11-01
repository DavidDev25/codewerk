test('begruessung ist eine async-Funktion', () => {
  expect(begruessung(1), 'Schreibe async function begruessung(id) { … }. Eine async-Funktion gibt immer ein Promise zurück.').toBeInstanceOf(Promise);
});

test('begruessung(1) ergibt "Hallo Mia!"', async () => {
  expect(await begruessung(1), 'Lade mit const person = await ladeBenutzer(id); und gib "Hallo " + person.name + "!" zurück.').toBe('Hallo Mia!');
});

test('begruessung(2) ergibt "Hallo Ben!"', async () => {
  expect(await begruessung(2), 'Nutze den Namen aus dem geladenen Benutzer, nicht fest "Mia".').toBe('Hallo Ben!');
});

test('bestellAnzahl(1) ist 2', async () => {
  expect(await bestellAnzahl(1), 'Lade erst den Benutzer, dann await ladeBestellungen(person.name), und gib liste.length zurück.').toBe(2);
});

test('bestellAnzahl(2) ist 0', async () => {
  expect(await bestellAnzahl(2), 'Ben hat keine Bestellungen, die Länge seiner Liste ist 0.').toBe(0);
});

test('sicherBegruessen(1) begrüßt Mia', async () => {
  expect(await sicherBegruessen(1), 'Gib im try-Block return await begruessung(id); zurück.').toBe('Hallo Mia!');
});

test('sicherBegruessen(9) fängt den Fehler ab', async () => {
  expect(await sicherBegruessen(9), 'Schreibe im try-Block return await begruessung(id); Ohne das await landet der Fehler nicht im catch. Dort gibst du "Unbekannter Benutzer" zurück.').toBe('Unbekannter Benutzer');
});

test('start() gibt die Begrüßung aus', () => {
  expect(output(), 'Schreibe in start(): console.log(await begruessung(1)); und rufe danach start(); auf.').toContain('Hallo Mia!');
});

test('Du nutzt async und await', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code, 'Löse die Aufgabe mit async function und await statt mit .then(…).').toMatch(/async\s+function/);
  expect(code, 'Hole die Ergebnisse mit await, z. B. const person = await ladeBenutzer(id);').toMatch(/\bawait\b/);
});
