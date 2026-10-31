test('eintragErstellen baut ein <li>', () => {
  const li = eintragErstellen('Butter');
  expect(li && li.tagName, 'const li = document.createElement("li"); … return li;').toBe('LI');
  expect(li.textContent).toBe('Butter');
});

test('eintragErstellen fügt noch nichts ein', () => {
  const vorher = document.querySelectorAll('#liste li').length;
  eintragErstellen('Nur gebaut');
  expect(document.querySelectorAll('#liste li').length, 'eintragErstellen soll das <li> nur zurückgeben. Eingefügt wird woanders.').toBe(vorher);
});

test('Alle drei Artikel stehen in der Liste', () => {
  const texte = [...document.querySelectorAll('#liste li')].map((li) => li.textContent);
  expect(texte.slice(0, 3), 'for (const name of artikel) { liste.append(eintragErstellen(name)); }').toEqual(['Milch', 'Brot', 'Käse']);
});

test('Der Hinweis „Noch nichts auf der Liste“ ist weg', () => {
  expect(document.querySelector('#leer'), 'document.querySelector("#leer").remove();').toBeNull();
});

test('hinzufuegen hängt einen Eintrag an', () => {
  hinzufuegen('Äpfel');
  const alle = document.querySelectorAll('#liste li');
  expect(alle[alle.length - 1].textContent, 'document.querySelector("#liste").append(eintragErstellen(text));').toBe('Äpfel');
});

test('hinzufuegen ist sicher vor HTML', () => {
  hinzufuegen('<b>fett</b>');
  const alle = document.querySelectorAll('#liste li');
  expect(document.querySelector('#liste b'), 'Steht da ein echtes <b>? Dann wurde innerHTML benutzt. Nimm textContent.').toBeNull();
  expect(alle[alle.length - 1].textContent).toBe('<b>fett</b>');
});

test('Du nutzt kein innerHTML', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code, 'Löse alles mit createElement, textContent und append.').not.toMatch(/innerHTML/);
});
