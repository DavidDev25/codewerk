const fange = (fn) => { try { fn(); } catch (e) { return e; } return null; };

test('EingabeFehler ist ein echter Fehler mit Feld', () => {
  const f = new EingabeFehler('email', 'Da fehlt das @.');
  expect(f, 'class EingabeFehler extends Error').toBeInstanceOf(Error);
  expect(f.message, 'super(nachricht)').toBe('Da fehlt das @.');
  expect(f.name, 'this.name = "EingabeFehler";').toBe('EingabeFehler');
  expect(f.feld, 'this.feld = feld;').toBe('email');
});

test('alterPruefen gibt gültige Zahlen zurück', () => {
  expect(alterPruefen('42'), 'Number(text)').toBe(42);
});

test('alterPruefen wirft bei Unsinn einen EingabeFehler', () => {
  const f = fange(() => alterPruefen('vierzig'));
  expect(f, 'throw new EingabeFehler("alter", "Bitte eine Zahl eingeben.")').toBeInstanceOf(EingabeFehler);
  expect(f.message).toBe('Bitte eine Zahl eingeben.');
  expect(f.feld).toBe('alter');
});

test('alterPruefen lehnt negative Zahlen ab', () => {
  const f = fange(() => alterPruefen('-3'));
  expect(f).toBeInstanceOf(EingabeFehler);
  expect(f.message).toBe('Das Alter kann nicht negativ sein.');
});

test('profilLesen liest gültiges JSON', () => {
  expect(profilLesen('{"name":"Lea"}')).toEqual({ name: 'Lea' });
});

test('profilLesen meldet kaputtes JSON mit Ursache', () => {
  const f = fange(() => profilLesen('{kaputt'));
  expect(f && f.message, 'Fange den Fehler von JSON.parse und wirf new Error("Profil beschädigt", { cause: fehler }).').toBe('Profil beschädigt');
  expect(f.cause, 'Gib den ursprünglichen Fehler als cause mit.').toBeInstanceOf(SyntaxError);
});

test('sicher meldet Erfolg', () => {
  expect(sicher(() => alterPruefen('7'))).toEqual({ ok: true, wert: 7 });
});

test('sicher fängt EingabeFehler', () => {
  expect(sicher(() => alterPruefen('x')), 'Im catch: if (fehler instanceof EingabeFehler) return { ok: false, feld: fehler.feld, nachricht: fehler.message };').toEqual({ ok: false, feld: 'alter', nachricht: 'Bitte eine Zahl eingeben.' });
});

test('sicher reicht andere Fehler weiter', () => {
  const f = fange(() => sicher(() => { throw new TypeError('kaputt'); }));
  expect(f, 'Alle anderen Fehler mit throw fehler; weiterwerfen, nicht verschlucken.').toBeInstanceOf(TypeError);
});
