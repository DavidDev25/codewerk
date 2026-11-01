test('`Hund` erbt von `Tier`', () => {
  expect(new Hund('X'), 'Schreibe class Hund extends Tier { … }').toBeInstanceOf(Tier);
});

test('`Katze` erbt von `Tier`', () => {
  expect(new Katze('X'), 'Schreibe class Katze extends Tier { … }').toBeInstanceOf(Tier);
});

test('Hund und Katze übernehmen den Namen von Tier', () => {
  expect(new Hund('Rex').name, 'Du brauchst keinen eigenen constructor. Hund übernimmt den von Tier.').toBe('Rex');
  expect(new Katze('Tom').name).toBe('Tom');
});

test('Hund kann bellen', () => {
  expect(new Hund('Rex').bellen()).toBe('Wuff');
});

test('Katze kann miauen', () => {
  expect(new Katze('Tom').miauen()).toBe('Miau');
});

test('Geerbte Methoden funktionieren (beschreibung)', () => {
  expect(new Hund('Rex').beschreibung()).toBe('Rex ist ein Tier.');
});

test('`bello` ist ein Hund, `minka` eine Katze', () => {
  expect(bello, 'Erzeuge: const bello = new Hund("Bello");').toBeInstanceOf(Hund);
  expect(bello.name).toBe('Bello');
  expect(minka, 'Erzeuge: const minka = new Katze("Minka");').toBeInstanceOf(Katze);
  expect(minka.name).toBe('Minka');
});
