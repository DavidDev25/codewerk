const richtig = (preis, prozent) => {
  if (prozent < 0 || prozent > 100) throw new RangeError('Rabatt muss zwischen 0 und 100 liegen');
  return preis - (preis * prozent) / 100;
};
const ohneRabatt = (preis, prozent) => {
  if (prozent < 0 || prozent > 100) throw new RangeError('x');
  return preis;
};
const nurRabatt = (preis, prozent) => {
  if (prozent < 0 || prozent > 100) throw new RangeError('x');
  return (preis * prozent) / 100;
};
const keinePruefung = (preis, prozent) => preis - (preis * prozent) / 100;
const hundertVerboten = (preis, prozent) => {
  if (prozent < 0 || prozent >= 100) throw new RangeError('x');
  return preis - (preis * prozent) / 100;
};
const sicher = (fn) => { try { return fn(); } catch (e) { return null; } };
const alleOk = (r) => Array.isArray(r) && r.length > 0 && r.every((x) => x === true);
const merktEs = (fn) => { const r = sicher(() => meineTests(fn)); return r === null || !alleOk(r); };

test('meineTests gibt ein Array von true/false zurück', () => {
  const r = meineTests(richtig);
  expect(Array.isArray(r), 'return [pruefe(…), wirft(…), …];').toBe(true);
  expect(r.every((x) => typeof x === 'boolean')).toBe(true);
});

test('Es sind mindestens vier Prüfungen', () => {
  expect(meineTests(richtig).length >= 4, 'Normalfall, Grenzfälle und Fehlerfälle: mindestens vier Einträge.').toBe(true);
});

test('Bei der richtigen Funktion bestehen alle Prüfungen', () => {
  expect(alleOk(meineTests(richtig)), 'Eine deiner Prüfungen erwartet etwas Falsches. Rechne nach.').toBe(true);
});

test('Mutant 1 fällt auf: Der Rabatt wird ignoriert', () => {
  expect(merktEs(ohneRabatt), 'Prüfst du einen normalen Rabatt, z. B. 10 % von 100?').toBe(true);
});

test('Mutant 2 fällt auf: Es kommt der Rabatt statt des Preises heraus', () => {
  expect(merktEs(nurRabatt)).toBe(true);
});

test('Mutant 3 fällt auf: Unsinnige Prozente werden nicht abgelehnt', () => {
  expect(merktEs(keinePruefung), 'Prüfe mit wirft(() => rabatt(100, 150)) und wirft(() => rabatt(100, -5)).').toBe(true);
});

test('Mutant 4 fällt auf: Genau 100 % wird fälschlich abgelehnt', () => {
  expect(merktEs(hundertVerboten), 'Grenzfall: 100 % ist erlaubt. Was kostet etwas mit 100 % Rabatt?').toBe(true);
});
