test('Hund speichert name (über super) und rasse', () => {
  const h = new Hund('Rex', 'Pudel');
  expect(h.name, 'Rufe im constructor super(name); auf.').toBe('Rex');
  expect(h.rasse, 'Schreibe nach super(name): this.rasse = rasse;').toBe('Pudel');
});

test('Hund ist weiterhin ein Tier', () => {
  expect(new Hund('Rex', 'Pudel')).toBeInstanceOf(Tier);
});

test('beschreibung() baut auf der Methode von Tier auf', () => {
  expect(new Hund('Rex', 'Pudel').beschreibung(), 'Schreibe return super.beschreibung() + ` Rasse: ${this.rasse}`;').toBe('Rex ist ein Tier. Rasse: Pudel');
});

test('Tier selbst bleibt unverändert', () => {
  expect(new Tier('Fisch').beschreibung()).toBe('Fisch ist ein Tier.');
});

test('`bello` ist ein Hund mit Rasse Dackel', () => {
  expect(bello, 'Erzeuge: const bello = new Hund("Bello", "Dackel");').toBeInstanceOf(Hund);
  expect(bello.rasse).toBe('Dackel');
});
