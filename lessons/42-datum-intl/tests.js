const leerzeichen = (text) => String(text).replace(/\s/g, ' ');

test('tageBis zählt die Tage', () => {
  expect(tageBis('2026-10-31', '2026-12-24'), '(new Date(bis) - new Date(von)) / (24 * 60 * 60 * 1000)').toBe(54);
  expect(tageBis('2026-01-01', '2026-01-02')).toBe(1);
  expect(tageBis('2026-05-05', '2026-05-05')).toBe(0);
});

test('tageBis klappt über den Jahreswechsel und mit Schaltjahr', () => {
  expect(tageBis('2026-12-31', '2027-01-01')).toBe(1);
  expect(tageBis('2028-02-28', '2028-03-01'), '2028 ist ein Schaltjahr, es gibt den 29. Februar.').toBe(2);
});

test('datumLang schreibt das Datum aus', () => {
  expect(datumLang('2026-12-24'), 'new Intl.DateTimeFormat("de-DE", { dateStyle: "long", timeZone: "UTC" }).format(new Date(iso))').toBe('24. Dezember 2026');
  expect(datumLang('2027-03-01')).toBe('1. März 2027');
});

test('datumLang zeigt den richtigen Tag', () => {
  expect(datumLang('2026-01-01'), 'Kommt der 31. Dezember heraus? Dann fehlt timeZone: "UTC".').toBe('1. Januar 2026');
});

test('wochentag nennt den Tag', () => {
  expect(wochentag('2026-12-24'), '{ weekday: "long", timeZone: "UTC" }').toBe('Donnerstag');
  expect(wochentag('2026-10-31')).toBe('Samstag');
});

test('preis formatiert Euro-Beträge', () => {
  expect(leerzeichen(preis(1234.5)), 'new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(betrag)').toBe('1.234,50 €');
  expect(leerzeichen(preis(3))).toBe('3,00 €');
});

test('Du nutzt Intl statt Handarbeit', () => {
  const code = source().replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  expect(code, 'Nutze Intl.DateTimeFormat und Intl.NumberFormat.').toMatch(/Intl\.DateTimeFormat/);
  expect(code).toMatch(/Intl\.NumberFormat/);
});
