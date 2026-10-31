const form = () => document.querySelector('#neu');
const neu = (text) => {
  form().elements.text.value = text;
  const stopp = (e) => e.preventDefault();
  form().addEventListener('submit', stopp);
  form().requestSubmit();
  form().removeEventListener('submit', stopp);
};
const eintraege = () => [...document.querySelectorAll('#aufgaben li')];
const texte = () => eintraege().map((li) => li.querySelector('span') ? li.querySelector('span').textContent : li.textContent);
const zaehler = () => document.querySelector('#zaehler').textContent.trim();
const leeren = () => {
  aufgaben.length = 0;
  speichern();
  zeichnen();
};

test('laden gibt ohne Daten ein leeres Array zurück', () => {
  const alt = localStorage.getItem('aufgaben');
  localStorage.removeItem('aufgaben');
  expect(laden(), 'const text = localStorage.getItem("aufgaben"); return text ? JSON.parse(text) : [];').toEqual([]);
  if (alt !== null) localStorage.setItem('aufgaben', alt);
});

test('Hinzufügen zeigt die Aufgabe an', () => {
  leeren();
  neu('Einkaufen');
  expect(texte(), 'Im submit-Listener: aufgaben.push({ text, erledigt: false }); speichern(); zeichnen();').toEqual(['Einkaufen']);
  expect(form().elements.text.value, 'Leere danach das Feld, z. B. mit form.reset().').toBe('');
});

test('Leere Eingaben werden ignoriert', () => {
  leeren();
  neu('   ');
  expect(eintraege().length, 'Prüfe nach trim(): if (!text) return;').toBe(0);
});

test('Jedes <li> hat Text, Löschknopf und data-index', () => {
  leeren();
  neu('A');
  neu('B');
  const li = eintraege()[1];
  expect(li.querySelector('span') && li.querySelector('span').textContent, 'Lege im <li> ein <span> mit dem Text an.').toBe('B');
  expect(li.querySelector('button.loeschen') && li.querySelector('button.loeschen').textContent, 'Ein <button> mit Klasse loeschen und Text ✕.').toBe('✕');
  expect(li.dataset.index, 'li.dataset.index = index;').toBe('1');
});

test('Der Zähler zeigt die offenen Aufgaben', () => {
  leeren();
  neu('A');
  neu('B');
  expect(zaehler(), 'Format: 2 von 2 offen').toBe('2 von 2 offen');
});

test('Ein Klick auf eine Aufgabe hakt sie ab und wieder auf', () => {
  leeren();
  neu('Sport');
  eintraege()[0].querySelector('span').click();
  expect(eintraege()[0].classList.contains('erledigt'), 'Listener auf #aufgaben: closest("li"), dann aufgaben[index].erledigt umschalten.').toBe(true);
  expect(zaehler()).toBe('0 von 1 offen');
  eintraege()[0].querySelector('span').click();
  expect(eintraege()[0].classList.contains('erledigt'), 'Ein zweiter Klick schaltet zurück: erledigt = !erledigt.').toBe(false);
});

test('Der Löschknopf entfernt nur diese Aufgabe', () => {
  leeren();
  neu('A');
  neu('B');
  neu('C');
  eintraege()[1].querySelector('.loeschen').click();
  expect(texte(), 'Ist event.target.closest(".loeschen") gesetzt: aufgaben.splice(index, 1).').toEqual(['A', 'C']);
});

test('Löschen hakt nichts ab', () => {
  leeren();
  neu('A');
  neu('B');
  eintraege()[0].querySelector('.loeschen').click();
  expect(eintraege()[0].classList.contains('erledigt'), 'Nach dem Löschen mit return aufhören, sonst wird auch umgeschaltet.').toBe(false);
});

test('Alles wird gespeichert', () => {
  leeren();
  neu('Bleibt');
  eintraege()[0].querySelector('span').click();
  expect(JSON.parse(localStorage.getItem('aufgaben')), 'Nach jeder Änderung speichern().').toEqual([{ text: 'Bleibt', erledigt: true }]);
});

test('Ein Text mit HTML bleibt Text', () => {
  leeren();
  neu('<b>fett</b>');
  expect(document.querySelector('#aufgaben b'), 'Nutze textContent statt innerHTML.').toBeNull();
});
