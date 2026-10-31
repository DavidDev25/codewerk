const produkte = [
  { name: "Apfel", kategorie: "Obst", preis: 0.5 },
  { name: "Brot", kategorie: "Backwaren", preis: 3 },
  { name: "Birne", kategorie: "Obst", preis: 0.8 },
  { name: "Kuchen", kategorie: "Backwaren", preis: 2 },
  { name: "Milch", kategorie: "Getränke", preis: 1.2 },
];
const fussball = new Set(["Lea", "Tom", "Ben", "Ali"]);
const schwimmen = new Set(["Tom", "Mia", "Ali"]);

const nachKategorie = Object.groupBy(produkte, (p) => p.kategorie);
const nachPreis = Map.groupBy(produkte, (p) => (p.preis < 2 ? "günstig" : "teuer"));

const beides = fussball.intersection(schwimmen);
const alle = fussball.union(schwimmen);
const nurFussball = fussball.difference(schwimmen);

function istTeilVon(a, b) {
  return a.isSubsetOf(b);
}
