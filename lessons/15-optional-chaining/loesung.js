const komplett = {
  kunde: { name: "Ali", adresse: { stadt: "Erlangen" } },
  rabatt: 0,
  artikel: ["Pizza", "Salat"],
};
const lueckenhaft = { kunde: { name: "Lea" } };

function stadtVon(bestellung) {
  return bestellung.kunde?.adresse?.stadt ?? "unbekannt";
}

function rabattVon(bestellung) {
  return bestellung.rabatt ?? 10;
}

function anzahlArtikel(bestellung) {
  return bestellung.artikel?.length ?? 0;
}
