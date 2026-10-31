function zusammenbauen(teile, werte, umwandeln) {
  let text = teile[0];
  for (let i = 0; i < werte.length; i++) {
    text += umwandeln(werte[i]) + teile[i + 1];
  }
  return text;
}

function hervorheben(teile, ...werte) {
  return zusammenbauen(teile, werte, (wert) => `*${wert}*`);
}

function sicher(teile, ...werte) {
  return zusammenbauen(teile, werte, (wert) => String(wert)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;"));
}

function euro(teile, ...werte) {
  return zusammenbauen(teile, werte, (wert) => wert.toFixed(2).replace(".", ",") + " €");
}

const pfad = String.raw`C:\neu\daten`;
