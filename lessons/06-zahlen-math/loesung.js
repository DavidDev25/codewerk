function runden(zahl) {
  return Math.round(zahl * 100) / 100;
}

function preisText(betrag) {
  return betrag.toFixed(2).replace(".", ",") + " €";
}

function wuerfeln() {
  return Math.floor(Math.random() * 6) + 1;
}

function alsZahl(text) {
  const zahl = Number(text);
  return Number.isNaN(zahl) ? null : zahl;
}

console.log(preisText(4.5));
