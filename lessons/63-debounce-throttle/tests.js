const tippen = (text) => {
  const feld = document.querySelector('#suche');
  feld.value = text;
  feld.dispatchEvent(new Event('input', { bubbles: true }));
};
const sichtbar = () => [...document.querySelectorAll('#liste li')].filter((li) => !li.hidden).map((li) => li.textContent.trim());

test('debounce führt nur den letzten Aufruf aus', async () => {
  const log = [];
  const d = debounce((x) => log.push(x), 50);
  d('a');
  d('b');
  d('c');
  expect(log, 'Noch nichts sofort ausführen, erst nach der Wartezeit.').toEqual([]);
  await wait(120);
  expect(log, 'Bei jedem Aufruf clearTimeout(id) und neu planen.').toEqual(['c']);
});

test('debounce führt nach einer Pause erneut aus', async () => {
  const log = [];
  const d = debounce((x, y) => log.push(x + y), 30);
  d(1, 2);
  await wait(80);
  d(10, 20);
  await wait(80);
  expect(log, 'Gib alle Werte weiter: fn(...werte)').toEqual([3, 30]);
});

test('throttle lässt den ersten Aufruf sofort durch', () => {
  const log = [];
  const t = throttle((x) => log.push(x), 1000);
  t(1);
  t(2);
  t(3);
  expect(log, 'Merke dir den Zeitpunkt der letzten Ausführung und ignoriere alles innerhalb von ms.').toEqual([1]);
});

test('throttle lässt nach der Sperrzeit wieder durch', async () => {
  const log = [];
  const t = throttle((x) => log.push(x), 40);
  t('a');
  await wait(80);
  t('b');
  expect(log).toEqual(['a', 'b']);
});

test('Die Suche filtert erst nach einer Tipp-Pause', async () => {
  const vorher = Number(document.querySelector('#anzahl').textContent);
  tippen('a');
  tippen('ap');
  tippen('apr');
  expect(sichtbar().length, 'Sofort nach dem Tippen soll noch nicht gefiltert sein.').toBe(5);
  await wait(300);
  expect(sichtbar(), 'Nach 150 ms Ruhe: Einträge ohne den Suchtext ausblenden (li.hidden = true).').toEqual(['Aprikose']);
  expect(Number(document.querySelector('#anzahl').textContent), 'Drei Tastendrücke, aber nur eine Suche.').toBe(vorher + 1);
});

test('Die Suche ignoriert Groß- und Kleinschreibung', async () => {
  tippen('BIRNE');
  await wait(300);
  expect(sichtbar()).toEqual(['Birne']);
  tippen('');
  await wait(300);
  expect(sichtbar().length, 'Ein leerer Suchtext zeigt wieder alles.').toBe(5);
});
