const inhalt = () => document.querySelector('#inhalt').textContent.trim();
const aktiv = () => [...document.querySelectorAll('nav a')].filter((a) => a.getAttribute('aria-current') === 'page').map((a) => a.getAttribute('href'));
const gehe = async (hash) => {
  location.hash = hash;
  await wait(60);
};

test('parameter liest die Suchparameter', () => {
  expect(parameter('https://shop.de/?q=tee&seite=2'), 'Object.fromEntries(new URL(adresse).searchParams)').toEqual({ q: 'tee', seite: '2' });
  expect(parameter('https://shop.de/')).toEqual({});
});

test('suchLink baut eine korrekte Adresse', () => {
  expect(suchLink('https://shop.de/suche', { q: 'rote schuhe', seite: 2 }), 'const url = new URL(basis); für jeden Eintrag url.searchParams.set(name, wert); return url.toString();').toBe('https://shop.de/suche?q=rote+schuhe&seite=2');
});

test('suchLink kodiert Sonderzeichen', () => {
  expect(suchLink('https://shop.de/suche', { q: 'Äpfel & Birnen' })).toBe('https://shop.de/suche?q=%C3%84pfel+%26+Birnen');
});

test('Beim Start wird die Startseite gezeigt', async () => {
  await gehe('');
  expect(inhalt(), 'Rufe zeigen() einmal beim Start auf. Ein leerer Hash zählt als "#/".').toBe('Willkommen im Laden!');
});

test('Ein Hash-Wechsel zeigt die passende Seite', async () => {
  await gehe('#/kontakt');
  expect(inhalt(), 'window.addEventListener("hashchange", zeigen);').toBe('Schreib uns: hallo@laden.example');
  await gehe('#/produkte');
  expect(inhalt()).toBe('Unsere Produkte: Tee, Kaffee, Kakao.');
});

test('Unbekannte Adressen zeigen einen Hinweis', async () => {
  await gehe('#/gibt-es-nicht');
  expect(inhalt(), 'seiten[ziel] ?? "Seite nicht gefunden"').toBe('Seite nicht gefunden');
});

test('Der aktive Link ist markiert', async () => {
  await gehe('#/produkte');
  expect(aktiv(), 'Bei passendem href: a.setAttribute("aria-current", "page"), sonst removeAttribute("aria-current").').toEqual(['#/produkte']);
  await gehe('#/kontakt');
  expect(aktiv()).toEqual(['#/kontakt']);
});
