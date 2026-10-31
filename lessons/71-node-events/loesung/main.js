const { EventEmitter } = require("node:events");

class Kasse extends EventEmitter {
  constructor(tagesziel) {
    super();
    this.summe = 0;
    this.tagesziel = tagesziel;
  }

  bezahlen(betrag) {
    if (typeof betrag !== "number" || !(betrag > 0)) {
      this.emit("error", new Error("Ungültiger Betrag"));
      return;
    }
    this.summe += betrag;
    this.emit("bezahlt", { betrag, summe: this.summe });
    if (this.summe >= this.tagesziel) this.emit("ziel");
  }
}

const kasse = new Kasse(50);
kasse.on("bezahlt", ({ betrag, summe }) => console.log(`+${betrag} € (gesamt ${summe} €)`));
kasse.once("ziel", () => console.log("Tagesziel erreicht!"));
kasse.on("error", (fehler) => console.log(`Fehler: ${fehler.message}`));

for (const betrag of [20, -5, 40, 10]) kasse.bezahlen(betrag);

module.exports = { Kasse };
