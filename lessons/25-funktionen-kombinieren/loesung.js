const addiere = (a) => (b) => a + b;

const plusZehn = addiere(10);

function pipe(...funktionen) {
  return (wert) => funktionen.reduce((bisher, fn) => fn(bisher), wert);
}

function merken(fn) {
  const speicher = new Map();
  return (wert) => {
    if (speicher.has(wert)) {
      return speicher.get(wert);
    }
    const ergebnis = fn(wert);
    speicher.set(wert, ergebnis);
    return ergebnis;
  };
}

const fibSchnell = merken((n) => (n <= 1 ? n : fibSchnell(n - 1) + fibSchnell(n - 2)));
