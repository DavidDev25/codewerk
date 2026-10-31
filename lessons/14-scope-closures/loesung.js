function zaehlerErstellen() {
  let stand = 0;
  return () => {
    stand = stand + 1;
    return stand;
  };
}

function begruesser(gruss) {
  return (name) => `${gruss}, ${name}!`;
}

function kontoErstellen(start) {
  let kontostand = start;
  return {
    einzahlen(betrag) {
      kontostand += betrag;
    },
    stand() {
      return kontostand;
    },
  };
}
