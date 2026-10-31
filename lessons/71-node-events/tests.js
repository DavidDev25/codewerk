const { EventEmitter } = node.require('node:events');
const ohneKommentare = (text) => (text || '').replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
const { Kasse } = modul('main.js');

test('Kasse erbt von EventEmitter', () => {
  const kasse = new Kasse(100);
  expect(kasse, 'class Kasse extends EventEmitter { constructor(tagesziel) { super(); … } }').toBeInstanceOf(EventEmitter);
  expect(kasse.summe, 'this.summe = 0;').toBe(0);
  expect(kasse.tagesziel).toBe(100);
});

test('bezahlen löst "bezahlt" mit betrag und summe aus', () => {
  const kasse = new Kasse(100);
  const gemeldet = [];
  kasse.on('bezahlt', (info) => gemeldet.push(info));
  kasse.bezahlen(30);
  kasse.bezahlen(12);
  expect(gemeldet, 'this.emit("bezahlt", { betrag, summe: this.summe })').toEqual([{ betrag: 30, summe: 30 }, { betrag: 12, summe: 42 }]);
});

test('Ab dem Tagesziel kommt "ziel"', () => {
  const kasse = new Kasse(50);
  let ziele = 0;
  kasse.on('ziel', () => ziele++);
  kasse.bezahlen(49);
  expect(ziele, 'Unter dem Ziel noch kein "ziel"').toBe(0);
  kasse.bezahlen(1);
  expect(ziele, 'if (this.summe >= this.tagesziel) this.emit("ziel");').toBe(1);
});

test('Ungültige Beträge lösen "error" aus und ändern nichts', () => {
  const kasse = new Kasse(50);
  const fehler = [];
  kasse.on('error', (e) => fehler.push(e.message));
  kasse.bezahlen(-5);
  kasse.bezahlen(0);
  kasse.bezahlen('10');
  expect(fehler, 'this.emit("error", new Error("Ungültiger Betrag")); return;').toEqual(['Ungültiger Betrag', 'Ungültiger Betrag', 'Ungültiger Betrag']);
  expect(kasse.summe, 'Nach einem Fehler bleibt die Summe gleich.').toBe(0);
});

test('Das Hauptprogramm meldet alles richtig, das Ziel nur einmal', () => {
  expect(output(), 'Für "ziel" nimmst du once statt on.').toEqual([
    '+20 € (gesamt 20 €)',
    'Fehler: Ungültiger Betrag',
    '+40 € (gesamt 60 €)',
    'Tagesziel erreicht!',
    '+10 € (gesamt 70 €)',
  ]);
  expect(ohneKommentare(source('main.js')), 'kasse.once("ziel", …)').toMatch(/\.once\(\s*["']ziel["']/);
});
