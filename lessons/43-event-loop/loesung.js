setTimeout(() => console.log("W"), 0);
Promise.resolve().then(() => console.log("X"));
console.log("Y");
queueMicrotask(() => console.log("Z"));

const vorhersage = ["Y", "X", "Z", "W"];

function einplanen(log) {
  setTimeout(() => log.push("task"), 0);
  queueMicrotask(() => log.push("micro"));
  log.push("sync");
}

function zerlegen(liste, fertig) {
  const ergebnis = [];
  let i = 0;
  function stueck() {
    if (i >= liste.length) {
      fertig(ergebnis);
      return;
    }
    ergebnis.push(liste[i] * 2);
    i++;
    setTimeout(stueck, 0);
  }
  setTimeout(stueck, 0);
}
