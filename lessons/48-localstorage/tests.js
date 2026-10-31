test('Die Besuche werden gezählt und gespeichert', () => {
  const gespeichert = localStorage.getItem('besuche');
  expect(gespeichert, 'localStorage.setItem("besuche", anzahl);').not.toBeNull();
  expect(Number(gespeichert) >= 1, 'Starte mit Number(localStorage.getItem("besuche") ?? 0) und zähle 1 dazu.').toBe(true);
});

test('Die Seite zeigt die Zahl der Besuche', () => {
  expect(document.querySelector('#besuche').textContent.trim(), 'document.querySelector("#besuche").textContent = anzahl;').toBe(localStorage.getItem('besuche'));
});

test('Die gespeicherte Notiz steht im Textfeld', () => {
  expect(document.querySelector('#notiz').value, 'notiz.value = localStorage.getItem("notiz") ?? "";').toBe(localStorage.getItem('notiz') ?? '');
});

test('Speichern legt die Notiz im Speicher ab', () => {
  document.querySelector('#notiz').value = 'Test-Notiz 123';
  document.querySelector('#speichern').click();
  expect(localStorage.getItem('notiz'), 'Im click-Listener: localStorage.setItem("notiz", notiz.value);').toBe('Test-Notiz 123');
  expect(document.querySelector('#status').textContent.trim()).toBe('Gespeichert');
});

test('einstellungenLaden gibt ohne Daten den Standard zurück', () => {
  localStorage.removeItem('einstellungen');
  expect(einstellungenLaden(), 'Ist getItem null: return { thema: "hell" };').toEqual({ thema: 'hell' });
});

test('Einstellungen überleben als JSON', () => {
  einstellungenSpeichern({ thema: 'dunkel', schrift: 18 });
  expect(typeof localStorage.getItem('einstellungen'), 'localStorage.setItem("einstellungen", JSON.stringify(obj));').toBe('string');
  expect(einstellungenLaden(), 'return JSON.parse(localStorage.getItem("einstellungen"));').toEqual({ thema: 'dunkel', schrift: 18 });
});
