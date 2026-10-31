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
    pruefe(rabatt(80, 0), 80),
    pruefe(rabatt(50, 100), 0),
    wirft(() => rabatt(100, 150)),
    wirft(() => rabatt(100, -5)),
  ];
}

console.log(meineTests((preis, prozent) => preis - (preis * prozent) / 100));
