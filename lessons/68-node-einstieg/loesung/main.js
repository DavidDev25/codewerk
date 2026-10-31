function begruessen(name, anzahl, gruss = "Hallo") {
  return Array.from({ length: anzahl }, () => `${gruss}, ${name}!`);
}

const [name, anzahlText] = process.argv.slice(2);
const gruss = process.env.GRUSS ?? "Hallo";

if (!name) {
  console.error("Bitte gib einen Namen an: node main.js <name> [anzahl]");
  process.exitCode = 1;
} else {
  for (const zeile of begruessen(name, Number(anzahlText ?? 1), gruss)) {
    console.log(zeile);
  }
}

module.exports = { begruessen };
