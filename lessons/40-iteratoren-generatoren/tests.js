const istGenerator = (wert) => Object.prototype.toString.call(wert) === '[object Generator]';

test('zaehleBis ist ein Generator', () => {
  expect(istGenerator(zaehleBis(1)), 'Schreibe function* mit Stern und nutze yield.').toBe(true);
});

test('zaehleBis(4) liefert 1 bis 4', () => {
  expect([...zaehleBis(4)], 'for (let i = 1; i <= n; i++) { yield i; }').toEqual([1, 2, 3, 4]);
  expect([...zaehleBis(0)]).toEqual([]);
});

test('fibonacci ist ein Generator', () => {
  expect(istGenerator(fibonacci()), 'function* fibonacci() { … }').toBe(true);
});

test('fibonacci beginnt mit 0, 1, 1, 2, 3, 5', () => {
  const f = fibonacci();
  const werte = [f.next().value, f.next().value, f.next().value, f.next().value, f.next().value, f.next().value];
  expect(werte, 'Merke dir zwei Zahlen a = 0, b = 1. In einer while (true)-Schleife: yield a; dann [a, b] = [b, a + b];').toEqual([0, 1, 1, 2, 3, 5]);
});

test('erste holt die ersten n Werte', () => {
  expect(erste(zaehleBis(10), 3)).toEqual([1, 2, 3]);
  expect(erste(fibonacci(), 10), 'Hole mit for…of und höre mit break auf, sobald das Ergebnis n Werte hat.').toEqual([0, 1, 1, 2, 3, 5, 8, 13, 21, 34]);
});

test('erste klappt, wenn der Generator weniger Werte hat', () => {
  expect(erste(zaehleBis(2), 5)).toEqual([1, 2]);
  expect(erste(zaehleBis(5), 0)).toEqual([]);
});

test('countdown ist durchlaufbar', () => {
  expect(typeof countdown[Symbol.iterator], 'Ergänze *[Symbol.iterator]() { … } im Objekt.').toBe('function');
  expect([...countdown], 'Zähle von this.start herunter bis 1.').toEqual([3, 2, 1]);
});

test('countdown nutzt this.start', () => {
  const kurz = { ...countdown, start: 2 };
  expect([...kurz], 'Nutze this.start statt einer festen 3.').toEqual([2, 1]);
});
