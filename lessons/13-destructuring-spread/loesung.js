const nutzer = { name: "Mara", alter: 31, stadt: "Nürnberg" };
const punkte = [12, 7, 3];

const { name, stadt } = nutzer;

const [erster, zweiter] = punkte;

const umgezogen = { ...nutzer, stadt: "Fürth" };

function summe(...zahlen) {
  let ergebnis = 0;
  for (const zahl of zahlen) {
    ergebnis += zahl;
  }
  return ergebnis;
}

const vorstellen = ({ name, alter }) => `${name} ist ${alter}.`;
