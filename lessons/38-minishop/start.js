// Lektion 38 – Abschlussprojekt: Mini-Shop
// Diese beiden Funktionen tun so, als würden sie mit einem Server sprechen.
// Ändere sie nicht.
function ladeProdukte() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([
      { name: "Tasse", preis: 8 },
      { name: "Kaffee", preis: 12 },
      { name: "Kanne", preis: 35 },
      { name: "Fernseher", preis: 400 },
    ]), 80);
  });
}

function bezahlen(betrag) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (betrag > 100) reject(new Error("Limit überschritten"));
      else resolve("Bezahlt: " + betrag + " €");
    }, 80);
  });
}

// 1. Warenkorb
class Warenkorb {
  // privates Feld, hinzufuegen(produkt, menge = 1),
  // Getter anzahl, summe(), namen()
}

// 2. async function einkaufen(namen)


// 3. async function kasse(korb)


// 4. async function start() – und danach aufrufen
