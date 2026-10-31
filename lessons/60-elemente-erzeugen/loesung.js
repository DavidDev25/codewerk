const artikel = ["Milch", "Brot", "Käse"];

function eintragErstellen(text) {
  const li = document.createElement("li");
  li.textContent = text;
  return li;
}

const liste = document.querySelector("#liste");
for (const name of artikel) {
  liste.append(eintragErstellen(name));
}

document.querySelector("#leer").remove();

function hinzufuegen(text) {
  liste.append(eintragErstellen(text));
}
