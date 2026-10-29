test('`Buch` ist eine Klasse', () => {
  expect(typeof Buch, 'Schreibe class Buch { … }').toBe('function');
});

test('Ein neues Buch speichert titel, autor und seiten', () => {
  const b = new Buch('A', 'B', 3);
  expect(b.titel, 'Im constructor: this.titel = titel;').toBe('A');
  expect(b.autor, 'Im constructor: this.autor = autor;').toBe('B');
  expect(b.seiten, 'Im constructor: this.seiten = seiten;').toBe(3);
});

test('`hobbit` ist ein Buch mit den richtigen Werten', () => {
  expect(hobbit).toBeInstanceOf(Buch);
  expect(hobbit.titel).toBe('Der Hobbit');
  expect(hobbit.autor).toBe('J. R. R. Tolkien');
  expect(hobbit.seiten).toBe(310);
});

test('`krimi` ist ein zweites, eigenes Buch', () => {
  expect(krimi, 'Erzeuge es mit new Buch(…).').toBeInstanceOf(Buch);
  expect(krimi === hobbit, 'krimi muss ein neues Objekt sein.').toBe(false);
});
