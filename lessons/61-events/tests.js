const stand = () => document.querySelector('#stand').textContent.trim();
const tippen = (text) => {
  const feld = document.querySelector('#name');
  feld.value = text;
  feld.dispatchEvent(new Event('input', { bubbles: true }));
};

test('+1 erhöht den Zähler', () => {
  document.querySelector('#reset').click();
  document.querySelector('#plus').click();
  document.querySelector('#plus').click();
  expect(stand(), 'Lege let zaehler = 0; an. Im click-Listener: zaehler++ und dann #stand.textContent = zaehler;').toBe('2');
});

test('Zurücksetzen setzt auf 0', () => {
  document.querySelector('#plus').click();
  document.querySelector('#reset').click();
  expect(stand(), 'Im Listener von #reset: zaehler = 0; und #stand aktualisieren.').toBe('0');
  document.querySelector('#plus').click();
  expect(stand(), 'Nach dem Zurücksetzen muss wieder bei 1 weitergezählt werden.').toBe('1');
});

test('Die Eingabe begrüßt', () => {
  tippen('Mara');
  expect(document.querySelector('#gruss').textContent, 'feld.addEventListener("input", …) und dann #gruss.textContent = `Hallo ${…}!`').toBe('Hallo Mara!');
});

test('Ein leeres Feld leert die Begrüßung', () => {
  tippen('Mara');
  tippen('   ');
  expect(document.querySelector('#gruss').textContent, 'Prüfe mit value.trim(), ob etwas drinsteht.').toBe('');
});

test('Ein Klick auf eine Farbe zeigt die Auswahl', () => {
  document.querySelectorAll('#farben li')[2].click();
  expect(document.querySelector('#auswahl').textContent, 'li.dataset.farbe enthält die Farbe.').toBe('Gewählt: blau');
});

test('Auch neue Farben funktionieren (Event-Delegation)', () => {
  const neu = document.createElement('li');
  neu.dataset.farbe = 'lila';
  neu.textContent = 'Lila';
  document.querySelector('#farben').append(neu);
  neu.click();
  expect(document.querySelector('#auswahl').textContent, 'Hänge den Listener an #farben und nutze event.target.closest("li").').toBe('Gewählt: lila');
});
