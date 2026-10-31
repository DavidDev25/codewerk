// rechner.js ist ein Modul. Alles hier ist zuerst privat.

const verlauf = [];

// 1. Mach addiere für andere Dateien sichtbar.
function addiere(a, b) {
  const ergebnis = a + b;
  verlauf.push(`${a} + ${b} = ${ergebnis}`);
  return ergebnis;
}

// 2. Schreibe letzteRechnung() und exportiere sie.

