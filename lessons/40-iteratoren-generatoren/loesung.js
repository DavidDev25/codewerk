function* zaehleBis(n) {
  for (let i = 1; i <= n; i++) {
    yield i;
  }
}

function* fibonacci() {
  let a = 0;
  let b = 1;
  while (true) {
    yield a;
    [a, b] = [b, a + b];
  }
}

function erste(gen, n) {
  const ergebnis = [];
  if (n <= 0) {
    return ergebnis;
  }
  for (const wert of gen) {
    ergebnis.push(wert);
    if (ergebnis.length >= n) {
      break;
    }
  }
  return ergebnis;
}

const countdown = {
  start: 3,
  *[Symbol.iterator]() {
    for (let i = this.start; i >= 1; i--) {
      yield i;
    }
  },
};
