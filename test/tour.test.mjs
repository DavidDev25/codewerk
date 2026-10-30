// Die Tour merkt sich im Browser, dass sie gesehen wurde. Ohne Browser-Speicher
// (z. B. privater Modus mit Sperre) startet sie lieber gar nicht als bei jedem Besuch.
import test from 'node:test';
import assert from 'node:assert/strict';

const store = new Map();
let storageBroken = false;
globalThis.window = { matchMedia: () => ({ matches: false, addEventListener() {} }) };
globalThis.localStorage = {
  getItem: (k) => { if (storageBroken) throw new Error('blockiert'); return store.has(k) ? store.get(k) : null; },
  setItem: (k, v) => { if (storageBroken) throw new Error('blockiert'); store.set(k, String(v)); },
};

const { tourSeen } = await import('../public/js/tour.js');

test('Neue Besucher haben die Tour noch nicht gesehen', () => {
  store.clear();
  assert.equal(tourSeen(), false);
});

test('Nach dem Merken gilt die Tour als gesehen', () => {
  store.set('cw-tour-done', '1');
  assert.equal(tourSeen(), true);
});

test('Ist der Browser-Speicher gesperrt, startet die Tour nicht automatisch', () => {
  storageBroken = true;
  assert.equal(tourSeen(), true);
  storageBroken = false;
});
