const fs = require("node:fs");
const path = require("node:path");

function woerterZaehlen(pfad) {
  try {
    const text = fs.readFileSync(pfad, "utf8");
    return text.split(/\s+/).filter(Boolean).length;
  } catch (fehler) {
    if (fehler.code === "ENOENT") return 0;
    throw fehler;
  }
}

function notieren(text) {
  fs.appendFileSync(path.join(__dirname, "notizen.txt"), text + "\n");
}

function statistikSpeichern(daten) {
  const ordner = path.join(__dirname, "ausgabe");
  fs.mkdirSync(ordner, { recursive: true });
  fs.writeFileSync(path.join(ordner, "statistik.json"), JSON.stringify(daten, null, 2));
}

const woerter = woerterZaehlen(path.join(__dirname, "texte", "gedicht.txt"));
notieren("Gedicht gezählt");
statistikSpeichern({ datei: "gedicht.txt", woerter });
console.log(`Das Gedicht hat ${woerter} Wörter.`);

module.exports = { woerterZaehlen, notieren, statistikSpeichern };
