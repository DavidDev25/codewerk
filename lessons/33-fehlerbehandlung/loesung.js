function teilen(a, b) {
  if (b === 0) {
    throw new Error("Durch 0 kann man nicht teilen.");
  }
  return a / b;
}

function sicherTeilen(a, b) {
  try {
    return teilen(a, b);
  } catch (fehler) {
    return "Fehler: " + fehler.message;
  }
}

const ergebnis = sicherTeilen(10, 0);
console.log(ergebnis);
