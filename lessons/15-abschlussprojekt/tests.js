test('Buch: Titel und Beschreibung', () => {
  const b = new Buch('Momo');
  expect(b.beschreibung()).toBe('Momo');
});

test('Buch: Ein neues Buch ist nicht verliehen', () => {
  expect(new Buch('Momo').istVerliehen, 'Lege #verliehen = false; an und gib es im Getter istVerliehen zurück.').toBe(false);
});

test('Buch: ausleihen() und zurueckgeben()', () => {
  const b = new Buch('Momo');
  expect(b.ausleihen(), 'Beim ersten Mal soll true zurückkommen.').toBe(true);
  expect(b.istVerliehen).toBe(true);
  expect(b.ausleihen(), 'Ein verliehenes Buch lässt sich nicht nochmal ausleihen: false.').toBe(false);
  b.zurueckgeben();
  expect(b.istVerliehen).toBe(false);
});

test('Buch: #verliehen ist privat und von außen nicht änderbar', () => {
  const b = new Buch('Momo');
  expect(source(), 'Nutze ein privates Feld #verliehen.').toMatch(/#verliehen/);
  expect(() => { b.istVerliehen = true; }, 'istVerliehen darf nur einen Getter haben, keinen Setter.').toThrow();
  expect(b.istVerliehen).toBe(false);
});

test('Hoerbuch ist ein Buch und kennt die Minuten', () => {
  const h = new Hoerbuch('Der Hobbit', 660);
  expect(h, 'Schreibe class Hoerbuch extends Buch.').toBeInstanceOf(Buch);
  expect(h.minuten, 'Speichere this.minuten nach super(titel).').toBe(660);
});

test('Hoerbuch: beschreibung() baut auf Buch auf', () => {
  expect(new Hoerbuch('Der Hobbit', 660).beschreibung(), 'Schreibe `${super.beschreibung()} (Hörbuch, ${this.minuten} Min.)`').toBe('Der Hobbit (Hörbuch, 660 Min.)');
});

test('Hoerbuch kann auch ausgeliehen werden (geerbt)', () => {
  const h = new Hoerbuch('X', 1);
  expect(h.ausleihen()).toBe(true);
  expect(h.istVerliehen).toBe(true);
});

test('Bibliothek: hinzufuegen() sammelt Bücher', () => {
  const bib = new Bibliothek();
  bib.hinzufuegen(new Buch('A'));
  bib.hinzufuegen(new Buch('B'));
  expect(bib.buecher, 'Lege im constructor this.buecher = []; an.').toHaveLength(2);
});

test('Bibliothek: ausleihen() meldet Erfolg, Verleih und unbekannte Titel', () => {
  const bib = new Bibliothek();
  bib.hinzufuegen(new Buch('Momo'));
  expect(bib.ausleihen('Momo'), 'Suche mit this.buecher.find(…) und gib „Viel Spaß mit Momo!“ zurück.').toBe('Viel Spaß mit Momo!');
  expect(bib.ausleihen('Momo')).toBe('Momo ist schon verliehen.');
  expect(bib.ausleihen('Nichts')).toBe('Nichts gibt es nicht.');
});

test('Bibliothek: verfuegbar() listet nur freie Bücher (Polymorphie)', () => {
  const bib = new Bibliothek();
  bib.hinzufuegen(new Buch('Momo'));
  bib.hinzufuegen(new Hoerbuch('Der Hobbit', 660));
  bib.hinzufuegen(new Buch('Ende'));
  bib.ausleihen('Momo');
  expect(bib.verfuegbar(), 'Filtere mit if (!buch.istVerliehen) und sammle buch.beschreibung().').toEqual(['Der Hobbit (Hörbuch, 660 Min.)', 'Ende']);
});

test('Deine Bibliothek ist eingerichtet', () => {
  expect(bibliothek, 'Lege am Ende const bibliothek = new Bibliothek(); an.').toBeInstanceOf(Bibliothek);
  expect(bibliothek.buecher, 'Füge zwei Bücher hinzu: ein Buch und ein Hörbuch.').toHaveLength(2);
  expect(bibliothek.verfuegbar(), 'Leihe „Momo“ aus, dann bleibt nur das Hörbuch übrig.').toEqual(['Der Hobbit (Hörbuch, 660 Min.)']);
});
