const f = () => document.querySelector('#anmeldung');
const absenden = (name, email, kurs = 'JavaScript') => {
  f().elements.name.value = name;
  f().elements.email.value = email;
  f().elements.kurs.value = kurs;
  let event = null;
  const merken = (e) => { event = e; e.preventDefault(); };
  f().addEventListener('submit', merken);
  f().requestSubmit();
  f().removeEventListener('submit', merken);
  return event;
};
const text = () => document.querySelector('#meldung').textContent.trim();
const klasse = (name) => document.querySelector('#meldung').classList.contains(name);
const teilnehmer = () => [...document.querySelectorAll('#teilnehmer li')].map((li) => li.textContent);

test('Das Absenden lädt die Seite nicht neu', () => {
  const event = absenden('Mara', 'mara@web.de');
  expect(event && event.defaultPrevented, 'form.addEventListener("submit", (event) => { event.preventDefault(); … });').toBe(true);
});

test('Ohne Namen kommt eine Fehlermeldung', () => {
  absenden('   ', 'a@b.de');
  expect(text(), 'Prüfe nach trim(): if (!name) …').toBe('Bitte gib einen Namen ein.');
  expect(klasse('fehler'), 'meldung.classList.add("fehler")').toBe(true);
});

test('Eine E-Mail ohne @ wird abgelehnt', () => {
  absenden('Ali', 'ali.web.de');
  expect(text(), 'if (!email.includes("@")) …').toBe('Bitte gib eine gültige E-Mail ein.');
});

test('Bei Fehlern kommt niemand auf die Liste', () => {
  const vorher = teilnehmer().length;
  absenden('', '');
  expect(teilnehmer().length, 'Bei einem Fehler: Meldung zeigen und mit return aufhören.').toBe(vorher);
});

test('Eine gültige Anmeldung landet auf der Liste', () => {
  absenden('  Lea ', 'lea@web.de', 'React');
  const liste = teilnehmer();
  expect(liste[liste.length - 1], 'Neues <li> mit `${name} (${kurs})` an #teilnehmer anhängen.').toBe('Lea (React)');
});

test('Erfolg wird gemeldet und das Formular geleert', () => {
  absenden('Tom', 'tom@web.de');
  expect(text()).toBe('Angemeldet: Tom');
  expect(klasse('ok'), 'Bei Erfolg die Klasse ok setzen …').toBe(true);
  expect(klasse('fehler'), '… und fehler entfernen: classList.remove("fehler").').toBe(false);
  expect(f().elements.name.value, 'form.reset();').toBe('');
});

test('Auf Absenden wird gehört, nicht auf Klick', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code, 'Nutze das submit-Event des Formulars.').toMatch(/["']submit["']/);
});
