const rechner = (() => {
  const verlauf = [];

  function addiere(a, b) {
    const ergebnis = a + b;
    verlauf.push(`${a} + ${b} = ${ergebnis}`);
    return ergebnis;
  }

  function letzteRechnung() {
    return verlauf.length ? verlauf[verlauf.length - 1] : null;
  }

  return { addiere, letzteRechnung };
})();

const { addiere } = rechner;
