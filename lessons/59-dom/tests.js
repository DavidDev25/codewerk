test('Die Überschrift heißt „Codewerk-Laden“', () => {
  expect(titel, 'const titel = document.querySelector("#titel");').toBe(document.querySelector('#titel'));
  expect(document.querySelector('#titel').textContent, 'titel.textContent = "Codewerk-Laden";').toBe('Codewerk-Laden');
});

test('`eintraege` enthält alle drei Einträge', () => {
  expect(eintraege.length, 'document.querySelectorAll("#angebote li")').toBe(3);
  expect(eintraege[0], 'Es sollen die <li>-Elemente selbst sein.').toBe(document.querySelector('#angebote li'));
});

test('`anzahl` ist 3', () => {
  expect(anzahl, 'eintraege.length').toBe(3);
});

test('Der Hinweis hat die Klasse „wichtig“', () => {
  const hinweis = document.querySelector('.hinweis');
  expect(hinweis.classList.contains('wichtig'), 'document.querySelector(".hinweis").classList.add("wichtig");').toBe(true);
  expect(hinweis.classList.contains('hinweis'), 'Die alte Klasse soll bleiben. Nutze classList.add statt className = "…".').toBe(true);
});

test('Alle Einträge stehen in Großbuchstaben', () => {
  const texte = [...document.querySelectorAll('#angebote li')].map((li) => li.textContent);
  expect(texte, 'for (const li of eintraege) { li.textContent = li.textContent.toUpperCase(); }').toEqual(['ÄPFEL', 'BIRNEN', 'KIRSCHEN']);
});

test('Der Knopf ist umbeschriftet', () => {
  const knopf = document.querySelector('#knopf');
  expect(knopf.textContent, 'knopf.textContent = "In den Warenkorb";').toBe('In den Warenkorb');
  expect(knopf.getAttribute('data-produkt'), 'knopf.dataset.produkt = "obst";').toBe('obst');
});
