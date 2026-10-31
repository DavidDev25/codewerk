const verlauf = [];

export function addiere(a, b) {
  const ergebnis = a + b;
  verlauf.push(`${a} + ${b} = ${ergebnis}`);
  return ergebnis;
}

export function letzteRechnung() {
  return verlauf.at(-1) ?? null;
}
