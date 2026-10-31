function mussZahlSein(wert, name) {
  if (typeof wert !== "number" || !Number.isFinite(wert)) {
    throw new TypeError(`${name} muss eine Zahl sein`);
  }
}

/**
 * @typedef {Object} Posten
 * @property {string} name
 * @property {number} preis
 * @property {number} menge
 */

/**
 * Summiert alle Posten einer Rechnung.
 * @param {Posten[]} posten
 * @returns {number}
 */
function rechnungsSumme(posten) {
  let summe = 0;
  for (const p of posten) {
    mussZahlSein(p.preis, "preis");
    mussZahlSein(p.menge, "menge");
    summe += p.preis * p.menge;
  }
  return summe;
}
