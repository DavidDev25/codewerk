test('fastGleich erkennt 0.1 + 0.2 und 0.3 als gleich', () => {
  expect(fastGleich(0.1 + 0.2, 0.3), 'return Math.abs(a - b) < Number.EPSILON;').toBe(true);
});

test('fastGleich unterscheidet echte Unterschiede', () => {
  expect(fastGleich(0.3, 0.31)).toBe(false);
  expect(fastGleich(1, 1)).toBe(true);
});

test('inCent rechnet in ganze Cent um', () => {
  expect(inCent(19.99), '19.99 * 100 ist 1998.9999… – runde mit Math.round.').toBe(1999);
  expect(inCent(0.1)).toBe(10);
  expect(inCent(4.35)).toBe(435);
});

test('istSicher kennt die Grenze', () => {
  expect(istSicher(42), 'Number.isSafeInteger(zahl)').toBe(true);
  expect(istSicher(Number.MAX_SAFE_INTEGER)).toBe(true);
  expect(istSicher(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  expect(istSicher(1.5), 'Kommazahlen sind keine ganzen Zahlen.').toBe(false);
});

test('malGross rechnet exakt', () => {
  expect(malGross('9007199254740993', '3'), 'return (BigInt(a) * BigInt(b)).toString();').toBe('27021597764222979');
  expect(malGross('123456789012345678901234567890', '2')).toBe('246913578024691357802469135780');
});

test('malGross gibt einen Text zurück', () => {
  expect(typeof malGross('2', '3'), 'Wandle das Ergebnis mit .toString() in einen Text um.').toBe('string');
});

test('istGeradeGross prüft BigInts', () => {
  expect(istGeradeGross(10n), 'Mit BigInt rechnest du auch beim Rest mit n: zahl % 2n === 0n').toBe(true);
  expect(istGeradeGross(9007199254740993n)).toBe(false);
});
