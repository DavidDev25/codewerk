function fastGleich(a, b) {
  return Math.abs(a - b) < Number.EPSILON;
}

function inCent(euro) {
  return Math.round(euro * 100);
}

function istSicher(zahl) {
  return Number.isSafeInteger(zahl);
}

function malGross(a, b) {
  return (BigInt(a) * BigInt(b)).toString();
}

function istGeradeGross(zahl) {
  return zahl % 2n === 0n;
}
