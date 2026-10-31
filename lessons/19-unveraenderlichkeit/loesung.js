const zahlen = [3, 1, 2];
const kurs = { titel: "JavaScript", teilnehmer: ["Lea", "Tom"], ort: { stadt: "Nürnberg" } };

const sortiert = zahlen.toSorted((a, b) => a - b);
const rueckwaerts = zahlen.toReversed();
const ersetzt = zahlen.with(0, 10);

const kopie = structuredClone(kurs);
kopie.ort.stadt = "Fürth";

function mitTeilnehmer(kurs, name) {
  return { ...kurs, teilnehmer: [...kurs.teilnehmer, name] };
}

const konfig = Object.freeze({ farbe: "blau" });
