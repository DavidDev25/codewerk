function summe(zahlen) {
  let ergebnis = 0;
  for (const zahl of zahlen) {
    ergebnis += zahl;
  }
  return ergebnis;
}

function nurGrosse(zahlen) {
  const ergebnis = [];
  for (const zahl of zahlen) {
    if (zahl > 10) {
      ergebnis.push(zahl);
    }
  }
  return ergebnis;
}

function einsBis(n) {
  const ergebnis = [];
  for (let i = 1; i <= n; i++) {
    ergebnis.push(i);
  }
  return ergebnis;
}

function ersteNegative(zahlen) {
  for (const zahl of zahlen) {
    if (zahl < 0) {
      return zahl;
    }
  }
  return null;
}

function verdoppelnBis(start, grenze) {
  let wert = start;
  let anzahl = 0;
  while (wert < grenze) {
    wert *= 2;
    anzahl++;
  }
  return anzahl;
}

console.log(summe([1, 2, 3]));
