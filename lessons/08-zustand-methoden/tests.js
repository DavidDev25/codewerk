test('Ein neuer Zähler startet bei 0', () => {
  expect(new Zaehler().wert, 'Im constructor: this.wert = start;').toBe(0);
});

test('Der Startwert lässt sich festlegen', () => {
  expect(new Zaehler(10).wert).toBe(10);
});

test('erhoehen() zählt um 1 hoch, verringern() um 1 runter', () => {
  const z = new Zaehler(5);
  z.erhoehen();
  z.erhoehen();
  expect(z.wert, 'Schreibe this.wert = this.wert + 1;').toBe(7);
  z.verringern();
  expect(z.wert, 'Schreibe this.wert = this.wert - 1;').toBe(6);
});

test('zuruecksetzen() setzt auf 0', () => {
  const z = new Zaehler(5);
  z.zuruecksetzen();
  expect(z.wert).toBe(0);
});

test('beschreibung() gibt den Text zurück', () => {
  const z = new Zaehler(2);
  expect(z.beschreibung(), 'Nutze return `Zählerstand: ${this.wert}`;').toBe('Zählerstand: 2');
});

test('Jeder Zähler hat seinen eigenen Zustand', () => {
  const a = new Zaehler();
  const b = new Zaehler();
  a.erhoehen();
  expect(b.wert).toBe(0);
});

test('`klicker` wurde dreimal erhöht', () => {
  expect(klicker.wert, 'Rufe klicker.erhoehen(); dreimal auf.').toBe(3);
});
