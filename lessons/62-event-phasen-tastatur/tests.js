const $ = (s) => document.querySelector(s);
const taste = (ziel, key) => ziel.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));

test('Ein Klick auf die Karte schaltet sie um', () => {
  const vorher = $('#karte').classList.contains('offen');
  $('#karte').click();
  expect($('#karte').classList.contains('offen'), 'karte.classList.toggle("offen")').toBe(!vorher);
  $('#karte').click();
  expect($('#karte').classList.contains('offen')).toBe(vorher);
});

test('Merken reagiert, ohne die Karte umzuschalten', () => {
  const vorher = $('#karte').classList.contains('offen');
  $('#merken').click();
  expect($('#gemerkt').textContent, '#gemerkt.textContent = "Gemerkt!"').toBe('Gemerkt!');
  expect($('#karte').classList.contains('offen'), 'Der Klick blubbert zur Karte hoch. Stoppe ihn mit event.stopPropagation().').toBe(vorher);
});

test('Der Menü-Knopf öffnet und schließt das Menü', () => {
  $('#menue-knopf').click();
  expect($('#menue').hidden, 'menue.hidden = !menue.hidden;').toBe(false);
  expect($('#menue-knopf').getAttribute('aria-expanded'), 'setAttribute("aria-expanded", "true")').toBe('true');
  $('#menue-knopf').click();
  expect($('#menue').hidden).toBe(true);
  expect($('#menue-knopf').getAttribute('aria-expanded')).toBe('false');
});

test('Escape schließt das Menü und gibt den Fokus zurück', () => {
  if ($('#menue').hidden) $('#menue-knopf').click();
  $('#auswahl li').focus();
  taste(document, 'Escape');
  expect($('#menue').hidden, 'document.addEventListener("keydown", (e) => { if (e.key === "Escape") … })').toBe(true);
  expect($('#menue-knopf').getAttribute('aria-expanded')).toBe('false');
  expect(document.activeElement, 'Nach dem Schließen: menueKnopf.focus();').toBe($('#menue-knopf'));
});

test('Pfeil nach unten springt zum nächsten Eintrag', () => {
  const eintraege = document.querySelectorAll('#auswahl li');
  eintraege[0].focus();
  taste(eintraege[0], 'ArrowDown');
  expect(document.activeElement, 'Finde das fokussierte li und rufe nextElementSibling.focus() auf.').toBe(eintraege[1]);
  taste(eintraege[1], 'ArrowDown');
  expect(document.activeElement).toBe(eintraege[2]);
});

test('Pfeil nach oben und das Ende der Liste', () => {
  const eintraege = document.querySelectorAll('#auswahl li');
  eintraege[2].focus();
  taste(eintraege[2], 'ArrowDown');
  expect(document.activeElement, 'Gibt es kein nächstes Element, bleibt der Fokus stehen.').toBe(eintraege[2]);
  taste(eintraege[2], 'ArrowUp');
  expect(document.activeElement, 'previousElementSibling').toBe(eintraege[1]);
});
