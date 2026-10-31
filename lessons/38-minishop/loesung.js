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

class Warenkorb {
  #artikel = [];

  hinzufuegen(produkt, menge = 1) {
    if (menge < 1) {
      throw new Error("Menge muss mindestens 1 sein.");
    }
    this.#artikel.push({ produkt, menge });
  }

  get anzahl() {
    return this.#artikel.reduce((summe, eintrag) => summe + eintrag.menge, 0);
  }

  summe() {
    return this.#artikel.reduce((summe, eintrag) => summe + eintrag.produkt.preis * eintrag.menge, 0);
  }

  namen() {
    return this.#artikel.map((eintrag) => eintrag.produkt.name);
  }
}

async function einkaufen(namen) {
  const produkte = await ladeProdukte();
  const korb = new Warenkorb();
  for (const name of namen) {
    const produkt = produkte.find((p) => p.name === name);
    if (!produkt) {
      throw new Error(name + " gibt es nicht.");
    }
    korb.hinzufuegen(produkt);
  }
  return korb;
}

async function kasse(korb) {
  try {
    return await bezahlen(korb.summe());
  } catch (fehler) {
    return "Zahlung fehlgeschlagen: " + fehler.message;
  }
}

async function start() {
  const korb = await einkaufen(["Tasse", "Kaffee"]);
  console.log(await kasse(korb));
}

start();
