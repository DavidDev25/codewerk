test('Ein Auto hat einen Motor', () => {
  const a = new Auto('Golf');
  expect(a.marke).toBe('Golf');
  expect(a.motor, 'Schreibe im constructor: this.motor = new Motor();').toBeInstanceOf(Motor);
});

test('Ein Auto ist kein Motor (Komposition statt Vererbung)', () => {
  expect(new Auto('Golf') instanceof Motor, 'Schreibe class Auto { … } ohne extends.').toBe(false);
});

test('Ein neues Auto steht mit ausgeschaltetem Motor', () => {
  expect(new Auto('Golf').motor.laeuft).toBe(false);
});

test('fahren() startet den Motor', () => {
  const a = new Auto('Golf');
  expect(a.fahren(), 'Gib den Text `${this.marke} fährt` zurück.').toBe('Golf fährt');
  expect(a.motor.laeuft, 'Rufe in fahren() this.motor.starten() auf.').toBe(true);
});

test('anhalten() stoppt den Motor', () => {
  const a = new Auto('Golf');
  a.fahren();
  expect(a.anhalten()).toBe('Golf steht');
  expect(a.motor.laeuft, 'Rufe in anhalten() this.motor.stoppen() auf.').toBe(false);
});

test('status() zeigt den Motorzustand', () => {
  const a = new Auto('Polo');
  expect(a.status(), 'Nutze this.motor.laeuft (ohne Klammern – es ist ein Getter).').toBe('Polo: Motor aus');
  a.fahren();
  expect(a.status()).toBe('Polo: Motor an');
});

test('`golf` ist ein Auto', () => {
  expect(golf, 'Erzeuge: const golf = new Auto("Golf");').toBeInstanceOf(Auto);
});
