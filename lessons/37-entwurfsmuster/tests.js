test('emit ruft alle angemeldeten Funktionen mit den Daten auf', () => {
  const e = new Ereignisse();
  const empfangen = [];
  e.on('neu', (a, b) => empfangen.push(`1:${a}${b}`));
  e.on('neu', (a, b) => empfangen.push(`2:${a}${b}`));
  expect(e.emit('neu', 'x', 'y'), 'emit gibt die Anzahl der aufgerufenen Funktionen zurück.').toBe(2);
  expect(empfangen, 'Gib alle Daten weiter: fn(...daten)').toEqual(['1:xy', '2:xy']);
});

test('Ereignisse ohne Abonnenten sind kein Problem', () => {
  expect(new Ereignisse().emit('leer'), 'Gibt es keine Liste, ist die Anzahl 0 (z. B. mit ?? []).').toBe(0);
});

test('Verschiedene Ereignisse sind getrennt', () => {
  const e = new Ereignisse();
  let a = 0;
  e.on('a', () => a++);
  e.emit('b');
  expect(a).toBe(0);
});

test('off meldet genau diese Funktion ab', () => {
  const e = new Ereignisse();
  const log = [];
  const eins = () => log.push(1);
  const zwei = () => log.push(2);
  e.on('x', eins);
  e.on('x', zwei);
  e.off('x', eins);
  e.emit('x');
  expect(log, 'Filtere die Liste: liste.filter((f) => f !== fn)').toEqual([2]);
});

test('einmal wird nur beim nächsten emit aufgerufen', () => {
  const e = new Ereignisse();
  let n = 0;
  e.einmal('start', () => n++);
  e.emit('start');
  e.emit('start');
  expect(n, 'Registriere eine Hilfsfunktion, die zuerst off(name, hilfe) aufruft und dann fn.').toBe(1);
});

test('Zwei Ereignis-Objekte teilen nichts', () => {
  const a = new Ereignisse();
  const b = new Ereignisse();
  a.on('x', () => {});
  expect(b.emit('x'), 'Lege die Map im Objekt an (z. B. #abos = new Map()), nicht außerhalb der Klasse.').toBe(0);
});

test('Die Factory baut das richtige Tier', () => {
  const h = tierErstellen('hund', 'Bello');
  expect(h, 'if (art === "hund") return new Hund(name);').toBeInstanceOf(Hund);
  expect(h.name).toBe('Bello');
  expect(tierErstellen('katze', 'Minka').laut()).toBe('Miau');
});

test('Die Factory gibt bei Unbekanntem null zurück', () => {
  expect(tierErstellen('drache', 'Smaug')).toBeNull();
});
