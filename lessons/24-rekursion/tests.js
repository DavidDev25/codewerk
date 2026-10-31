const ohneKommentare = () => source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const ruftSichSelbst = (name) => {
  const code = ohneKommentare();
  const start = code.search(new RegExp('function\\s+' + name + '\\s*\\('));
  if (start < 0) return false;
  return new RegExp('\\b' + name + '\\s*\\(').test(code.slice(code.indexOf('{', start)));
};

test('fakultaet(5) ist 120', () => {
  expect(fakultaet(5), 'n * fakultaet(n - 1)').toBe(120);
  expect(fakultaet(3)).toBe(6);
});

test('fakultaet(0) und fakultaet(1) sind 1', () => {
  expect(fakultaet(1), 'Der Abbruch: if (n <= 1) return 1;').toBe(1);
  expect(fakultaet(0)).toBe(1);
});

test('fakultaet ruft sich selbst auf', () => {
  expect(ruftSichSelbst('fakultaet'), 'Löse es rekursiv: fakultaet ruft fakultaet mit n - 1 auf.').toBe(true);
});

test('tiefeSumme addiert auch verschachtelte Zahlen', () => {
  expect(tiefeSumme([1, [2, 3], [4, [5]]]), 'Ist ein Element ein Array (Array.isArray), rufe tiefeSumme dafür auf. Sonst addiere die Zahl.').toBe(15);
});

test('tiefeSumme klappt auch flach und leer', () => {
  expect(tiefeSumme([1, 2, 3])).toBe(6);
  expect(tiefeSumme([]), 'Eine leere Liste hat die Summe 0.').toBe(0);
  expect(tiefeSumme([[[[7]]]])).toBe(7);
});

test('zaehleMitarbeiter zählt die ganze Firma', () => {
  expect(zaehleMitarbeiter(firma), 'Die Person selbst zählt 1, dazu kommt zaehleMitarbeiter(…) für jedes Teammitglied.').toBe(6);
});

test('zaehleMitarbeiter klappt für Teilbäume', () => {
  expect(zaehleMitarbeiter(firma.team[1]), 'Lea, Tom, Ben und Mia').toBe(4);
  expect(zaehleMitarbeiter({ name: 'Solo', team: [] })).toBe(1);
});

test('zaehleMitarbeiter ruft sich selbst auf', () => {
  expect(ruftSichSelbst('zaehleMitarbeiter')).toBe(true);
});
