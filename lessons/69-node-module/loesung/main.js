const { einlagern, bestand } = require("./lager");
const preise = require("./preise.json");

einlagern("Tee", 10);
einlagern("Kaffee", 4);

const wert = ["Tee", "Kaffee"].reduce((summe, name) => summe + bestand(name) * preise[name], 0);
console.log(`Lagerwert: ${wert} Euro`);
