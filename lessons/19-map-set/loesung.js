const antworten = ["Kino", "Bowling", "Kino", "Picknick", "Kino", "Bowling"];

const optionen = [...new Set(antworten)];

function zaehlen(liste) {
  const zaehler = new Map();
  for (const eintrag of liste) {
    zaehler.set(eintrag, (zaehler.get(eintrag) ?? 0) + 1);
  }
  return zaehler;
}

const ergebnis = zaehlen(antworten);

function beliebteste(liste) {
  let sieger = null;
  let rekord = 0;
  for (const [eintrag, anzahl] of zaehlen(liste)) {
    if (anzahl > rekord) {
      sieger = eintrag;
      rekord = anzahl;
    }
  }
  return sieger;
}
