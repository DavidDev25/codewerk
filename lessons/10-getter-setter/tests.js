test('Der Getter `celsius` liefert den Startwert 20', () => {
  expect(new Thermometer().celsius, 'Schreibe im Getter: return this.#celsius;').toBe(20);
});

test('Der Setter `celsius` speichert einen neuen Wert', () => {
  const x = new Thermometer();
  x.celsius = 5;
  expect(x.celsius, 'Schreibe im Setter: this.#celsius = wert;').toBe(5);
});

test('Zu kalte Werte lösen einen Fehler aus', () => {
  const x = new Thermometer();
  expect(() => { x.celsius = -300; }, 'Prüfe im Setter: if (wert < -273.15) { throw new Error("Zu kalt!"); }').toThrow();
});

test('Nach dem Fehler bleibt der alte Wert erhalten', () => {
  const x = new Thermometer();
  x.celsius = 10;
  try { x.celsius = -300; } catch (e) { /* erwartet */ }
  expect(x.celsius, 'Wirf den Fehler, BEVOR du #celsius änderst.').toBe(10);
});

test('`fahrenheit` wird aus celsius berechnet', () => {
  const x = new Thermometer();
  x.celsius = 100;
  expect(x.fahrenheit, 'Schreibe get fahrenheit() { return this.#celsius * 9 / 5 + 32; }').toBe(212);
  x.celsius = 0;
  expect(x.fahrenheit).toBe(32);
});

test('`fahrenheit` ist nur lesbar', () => {
  const x = new Thermometer();
  expect(() => { x.fahrenheit = 50; }, 'Schreibe nur einen Getter, keinen Setter für fahrenheit.').toThrow();
});
