// Lektion 57 – Eigene Tests schreiben
function pruefe(ist, soll) {
  return ist === soll;
}

function wirft(fn) {
  try {
    fn();
    return false;
  } catch (fehler) {
    return true;
  }
}

function meineTests(rabatt) {
  return [
    pruefe(rabatt(100, 10), 90),
    // weitere Prüfungen …
  ];
}

console.log(meineTests((preis, prozent) => preis - (preis * prozent) / 100));
