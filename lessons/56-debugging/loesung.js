function durchschnitt(zahlen) {
  let summe = 0;
  for (let i = 0; i < zahlen.length; i++) {
    summe += zahlen[i];
  }
  return summe / zahlen.length;
}

function istGleich(a, b) {
  return a === b;
}

function sortiertKopie(liste) {
  return liste.toSorted((a, b) => a - b);
}

function letzter(liste) {
  return liste[liste.length - 1];
}
