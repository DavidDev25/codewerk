const produkte = [
  { name: "Apfel", preis: 1, kategorie: "Obst" },
  { name: "Brot", preis: 3, kategorie: "Backwaren" },
  { name: "Banane", preis: 2, kategorie: "Obst" },
  { name: "Kuchen", preis: 8, kategorie: "Backwaren" },
  { name: "Milch", preis: 2, kategorie: "Getränke" },
];

const namen = produkte.map((p) => p.name);
const obst = produkte.filter((p) => p.kategorie === "Obst");
const gesamt = produkte.reduce((summe, p) => summe + p.preis, 0);
const kuchen = produkte.find((p) => p.name === "Kuchen");
const guenstig = produkte.filter((p) => p.preis <= 2).map((p) => p.name);
